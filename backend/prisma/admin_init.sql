-- Drop any existing triggers that might be causing issues
DROP TRIGGER IF EXISTS trg_audit_log ON orders;
DROP FUNCTION IF EXISTS log_audit_event;

-- Create Audit Trigger Function
CREATE OR REPLACE FUNCTION log_audit_event()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO "audit_log" ("action", "tableName", "recordId", "details", "createdAt")
    VALUES (TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW)::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create Trigger on Orders
CREATE TRIGGER trg_audit_log
AFTER INSERT OR UPDATE OR DELETE ON orders
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();

-- Create Trigger on Products (Tracking Stock Changes)
DROP TRIGGER IF EXISTS trg_product_audit ON products;
CREATE TRIGGER trg_product_audit
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW
EXECUTE FUNCTION log_audit_event();
