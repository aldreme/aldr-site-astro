-- Add status column to customer_request_for_quotes
ALTER TABLE customer_request_for_quotes
ADD COLUMN status text NOT NULL DEFAULT 'new';

-- Add status column to cx_contact_messages
ALTER TABLE cx_contact_messages
ADD COLUMN status text NOT NULL DEFAULT 'new';

-- Add check constraints for valid status values (optional but good practice)
ALTER TABLE customer_request_for_quotes
ADD CONSTRAINT cx_rfq_status_check CHECK (status IN ('new', 'read', 'responded', 'archived'));

ALTER TABLE cx_contact_messages
ADD CONSTRAINT cx_msg_status_check CHECK (status IN ('new', 'read', 'responded', 'archived'));
