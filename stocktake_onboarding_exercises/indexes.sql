-- Create your proposed indexes
CREATE INDEX idx_active_slots ON event_occurrences (is_active, start_time)
WHERE is_active = TRUE;

CREATE INDEX idx_template_time ON event_occurrences (template_id, start_time);

CREATE INDEX idx_user_bookings ON event_registrations (user_id, registered_at DESC);

-- Test Query 1
EXPLAIN ANALYSE
SELECT * FROM event_occurrences
WHERE start_time BETWEEN '2026-01-01' AND '2026-01-31'
  AND is_active = TRUE
  AND current_bookings < capacity_limit;


-- Look for : "index Scan using idx_active_slots"
-- Check: How many rows scanned vs returned?"
