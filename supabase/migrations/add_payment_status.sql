-- Add payment_status to submissions table
ALTER TABLE submissions ADD COLUMN payment_status TEXT DEFAULT 'free';
ALTER TABLE submissions ADD COLUMN stripe_session_id TEXT;

-- Update existing submissions to mark as free
UPDATE submissions SET payment_status = 'free' WHERE payment_status IS NULL;
