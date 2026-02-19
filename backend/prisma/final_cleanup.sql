-- CLEANUP SCRIPT
-- 1. Drop all potentially conflicting triggers
DROP TRIGGER IF EXISTS trg_audit_orders ON orders;
DROP TRIGGER IF EXISTS trg_audit_log ON orders;
DROP TRIGGER IF EXISTS trg_restore_stock_on_cancel ON orders;

DROP TRIGGER IF EXISTS trg_product_audit ON products;
DROP TRIGGER IF EXISTS trg_check_stock ON products;

DROP TRIGGER IF EXISTS trg_check_order_item_stock ON order_items;
DROP TRIGGER IF EXISTS trg_prevent_negative_stock ON order_items;
DROP TRIGGER IF EXISTS trg_update_stock_on_order ON order_items;

DROP TRIGGER IF EXISTS trg_audit_payments ON payments;

-- 2. Drop functions
DROP FUNCTION IF EXISTS log_audit_event() CASCADE;
DROP FUNCTION IF EXISTS check_order_item_stock() CASCADE;
DROP FUNCTION IF EXISTS check_stock_level() CASCADE;
DROP FUNCTION IF EXISTS handle_order_stock() CASCADE;

-- 3. RE-IMPLEMENT CLEAN TRIGGER SYSTEM

-- A. Audit Logging (for Admin tracking)
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO "audit_log" ("action", "table_name", "record_id", "details", "created_at")
        VALUES (TG_OP, TG_TABLE_NAME, OLD.id::text, row_to_json(OLD)::text, NOW());
        RETURN OLD;
    ELSE
        INSERT INTO "audit_log" ("action", "table_name", "record_id", "details", "created_at")
        VALUES (TG_OP, TG_TABLE_NAME, NEW.id::text, row_to_json(NEW)::text, NOW());
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_log_orders
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

CREATE TRIGGER trg_audit_log_products
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION log_audit_event();

-- B. Stock Management (The core requirement)
-- This checks stock BEFORE order and updates it
CREATE OR REPLACE FUNCTION check_order_item_stock()
RETURNS TRIGGER AS $$
DECLARE
    avail_stock INTEGER;
    prod_name TEXT;
BEGIN
    SELECT stock, name INTO avail_stock, prod_name 
    FROM products 
    WHERE id = NEW."productId";

    IF avail_stock < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product %: requested %, but only % available', prod_name, NEW.quantity, avail_stock;
    END IF;

    -- Decrement stock
    UPDATE products 
    SET stock = stock - NEW.quantity 
    WHERE id = NEW."productId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_order_item_stock
BEFORE INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION check_order_item_stock();

-- 2. Stored Procedure with Cursor for Category Value Analysis
-- This iterates through all categories and calculates total stock value using a cursor
CREATE OR REPLACE FUNCTION get_categories_report()
RETURNS TABLE(cat_name TEXT, total_value DECIMAL, total_items INTEGER) AS $$
DECLARE
    cat_cursor CURSOR FOR SELECT id, name FROM categories;
    v_cat_id TEXT;
    v_cat_name TEXT;
    v_total_val DECIMAL;
    v_total_items INTEGER;
BEGIN
    OPEN cat_cursor;
    LOOP
        FETCH cat_cursor INTO v_cat_id, v_cat_name;
        EXIT WHEN NOT FOUND;

        -- Calculate total for this category
        SELECT COALESCE(SUM(price * stock), 0), COALESCE(SUM(stock), 0)
        INTO v_total_val, v_total_items
        FROM products
        WHERE "categoryId" = v_cat_id;

        cat_name := v_cat_name;
        total_value := v_total_val;
        total_items := v_total_items;
        RETURN NEXT;
    END LOOP;
    CLOSE cat_cursor;
END;
$$ LANGUAGE plpgsql;
