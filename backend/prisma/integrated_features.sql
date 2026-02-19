-- 1. Trigger to check stock BEFORE adding to order_items
CREATE OR REPLACE FUNCTION check_order_item_stock()
RETURNS TRIGGER AS $$
DECLARE
    avail_stock INTEGER;
    prod_name TEXT;
BEGIN
    -- Get current stock and product name
    SELECT stock, name INTO avail_stock, prod_name 
    FROM products 
    WHERE id = NEW."productId";

    -- Check if sufficient stock exists
    IF avail_stock < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product %: requested %, but only % available', prod_name, NEW.quantity, avail_stock;
    END IF;

    -- Update the stock (this is a convenient place to do it, OR we can do it after insert)
    UPDATE products 
    SET stock = stock - NEW.quantity 
    WHERE id = NEW."productId";

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_order_item_stock ON order_items;
CREATE TRIGGER trg_check_order_item_stock
BEFORE INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION check_order_item_stock();


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
