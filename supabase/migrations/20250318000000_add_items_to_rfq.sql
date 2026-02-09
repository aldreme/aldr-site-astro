-- Add cx_rfq_items column to support multi-product submissions
ALTER TABLE customer_request_for_quotes ADD COLUMN IF NOT EXISTS cx_rfq_items JSONB;

COMMENT ON COLUMN customer_request_for_quotes.cx_rfq_items IS 'Stores the list of products in the consolidated RFQ';
