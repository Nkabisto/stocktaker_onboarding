-- This block is atomic. If the UPDATE fails, the whole thing fails.
BEGIN;
  ---1. Try to update the row ONLY if version is still 1 and there is still space
  UPDATE event_occurrences
  SET current_bookings = current_bookings + 1,
      version = version + 1
  WHERE id = 1
    AND version = 1
    AND current_bookings < capacity_limit;

  -- 2. Check if the update actually modifed a row
  -- In psql, we can use a trick to fail if the update didin't happen
  INSERT INTO event_registrations (user_id, occurence_id)
  SELECT 'user_' || CAST(random() AS TEXT), 1
  WHERE EXISTS (
    SELECT 1 FROM event_occurrences
    WHERE id = 1 AND version = 2 -- This version only exists if the UPDATE above worked
