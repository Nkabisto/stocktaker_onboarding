
BEGIN;

--Step 1: Attempt the update
UPDATE event_occurrences
SET current_bookings = current_bookings + 1,
    version = version + 1
WHERE id = 1
  AND version = 1 
  AND current_bookings < capacity_limit;

-- In psql, you'll see 'UPDATE 1" or "UPDATED 0"

-- Step 3: Use GET DIAGONOSTICS to check programmatically
-- (This is for stored procedures/functions)

DO $$
DECLARE
  rows_affected INTEGER;
BEGIN
  UPDATE event_occurrences
  SET current_bookings = current_bookings + 1,
  version = version + 1
WHERE id = 1
  AND version = 1
  AND current_bookings < capacity_limit;

-- Get the number of rows_affected 
GET DIAGNOSTICS rows_affected = ROW_COUNT;

IF rows_affected = 0 THEN
  RAISE EXCEPTION 'VERSION_MISMATCH'
    USING ERRCODE = '23P01'; -- Custom error code
END IF;

-- Only insert if update succeeded 
INSERT INTO event_registrations (user_id, occurrence_id)
VALUES('user_1001', 1);
END $$;
