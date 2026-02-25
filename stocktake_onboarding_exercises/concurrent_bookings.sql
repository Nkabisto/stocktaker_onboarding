CREATE TABLE IF NOT EXISTS event_occurrences(
  id SERIAL PRIMARY KEY,
  template_id INTEGER,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  capacity_limit INTEGER NOT NULL,
  current_bookings INTEGER DEFAULT 0,
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  CHECK (current_bookings <= capacity_limit)
);

CREATE TABLE IF NOT EXISTS event_registrations(
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  occurrence_id INTEGER REFERENCES event_occurrences(id) ON DELETE CASCADE ,
  registered_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
  -- Create a training event with 18/20 spots taken 
  INSERT INTO event_occurrences
  (template_id, start_time, end_time, capacity_limit, current_bookings, version)
  VALUES
  (1, '2026-01-15 09:00:00+2', '2026-01-15 12:00:00+2', 20, 18, 1)
  ON CONFLICT (id) DO NOTHING;

/*
BEGIN;
  -- App-side fetch simulation: version 1
  UPDATE event_occurrences 
  SET current_bookings = current_bookings + 1, version = version + 1
  WHERE id = 1 AND version = 1 AND current_bookings < capacity_limit;
  
  -- If update succeeds, in sert registration
  INSERT INTO event_registrations (user_id, occurrence_id)  VALUES('user_1001',1);
COMMIT;

-- 2. Show what happens when they execute "simulaneously"

-- 3. Demonstrate that only 2 succeed

    -- 4. Show the error handling for the other 3
*/
