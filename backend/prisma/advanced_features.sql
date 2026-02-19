-- Create Stock Alerts table
CREATE TABLE IF NOT EXISTS "stock_alerts" (
    "id" SERIAL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Trigger Function for Stock Updates
CREATE OR REPLACE FUNCTION check_stock_level()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock <= 0 THEN
        INSERT INTO "stock_alerts" ("productId", "message")
        VALUES (NEW.id, 'Alert: Product ' || NEW.name || ' is out of stock!');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
DROP TRIGGER IF EXISTS trg_check_stock ON products;
CREATE TRIGGER trg_check_stock
AFTER UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION check_stock_level();

-- Stored Procedure with Cursor for Price Range Analysis
CREATE OR REPLACE FUNCTION get_products_summary_by_price(min_price DECIMAL, max_price DECIMAL)
RETURNS TABLE(total_items INTEGER, total_value DECIMAL) AS $$
DECLARE
    p_cursor CURSOR FOR SELECT price, stock FROM products WHERE price >= min_price AND price <= max_price;
    p_price DECIMAL;
    p_stock INTEGER;
    v_count INTEGER := 0;
    v_total DECIMAL := 0;
BEGIN
    OPEN p_cursor;
    LOOP
        FETCH p_cursor INTO p_price, p_stock;
        EXIT WHEN NOT FOUND;
        v_count := v_count + 1;
        v_total := v_total + (p_price * p_stock);
    END LOOP;
    CLOSE p_cursor;
    
    total_items := v_count;
    total_value := v_total;
    RETURN NEXT;
END;
$$ LANGUAGE plpgsql;
