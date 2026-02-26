
BEGIN;
WITH updated AS (
  ---1. Try to update the row ONLY if version is still 1 and there is still space
  UPDATE event_occurrences
  SET current_bookings = current_bookings + 1,
      version = version + 1
  WHERE id = 1
    AND version = 2 
    AND current_bookings < capacity_limit
    RETURNING id -- this only returns a row if the UPDATE actually happened
)
  -- 1. Check if the update actually modifed a row
  -- In psql, we can use a trick to fail if the update didin't happen
  INSERT INTO event_registrations (user_id, occurrence_id)
  SELECT 'user_1001', id 
  FROM updated;
  
COMMIT;
