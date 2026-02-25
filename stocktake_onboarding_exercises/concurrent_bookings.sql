CREATE TABLE event_occurrences(
  id SERIAL PRIMARY KEY,
  template_id INTEGER,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity_limit INTEGER NOT NULL,
  current_bookings INTEGER DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  CHECK (current_bookings <= capacity_limit)
)

CREATE TABLE event_registrations(
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  occurrence_id INTEGER REFERENCES event_occurrences(id) ON DELETE CASCADE ,
  registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
)
  -- Create a training event with 18/20 spots taken 
  INSERT INTO event_occurrences
  (template_id, start_time, end_time, capacity_limit, current_bookings, version)
  VALUES
(1, '2026-01-15 09:00:00+2', '2026-01-15 12:00:00+02', 20, 18, 1);

-- The Booking Transaction (Optimistic Approach)
BEGIN;
--- 1. Fetch the data (In your app, store these in variables)
  SELECT id, current_bookings, capacity_limit, is_active, version
  FROM event_occurrences
  WHERE id = 1; -- Using ID is safer than matching times

  -- [APP LOGIC: Check if active and space remains]

  --2. Insert the registration
  INSERT INTO event_registrations (user_id, occurrence_id) 
  VALUES('user_123',1);

  -- 3. Update with VERSION check
  UPDATE event_occurrences 
  SET current_bookings = current_bookings + 1,
      version = version + 1
  WHERE id = 1
    AND version = 1-- The 'old' version we fetched
    AND current_bookings < capacity_limit;
  
  --4. FINAL CHECK:
  -- In your code, check if the UPDATE affected 1 row.
  -- If rows_affected == 0. then ROLLBACK (someone else grabbed the spot).
COMMIT;


