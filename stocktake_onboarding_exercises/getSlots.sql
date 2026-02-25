-- Query 1: Get slots for a specific date range
SELECT * FROM event_occurrences
WHERE start_time BETWEEN :start_date AND :end_date
  AND is_active = TRUE
  AND current_bookings < capacity_limit;

-- Query 2: Get slots for a specific event type
SELECT * FROM event_occurrences eo
JOIN event_templates et on eo.template_id = et.id
WHERE et.title = 'Interview'
  AND eo.start_time >= CURRENT_DATE
  AND eo.current_bookings < eo.capacity_limit;

-- Query 3: Get user's bookings
SELECT * FROM event_registrations
WHERE user_id = :user_id
ORDER BY registered_at DESC;


--Question 5: For each query, what indexes would help? Think about:
-- # Column order in composite indexes
-- # Which queries happen most frequently
-- # Write vs read trade-off

--Answer
-- Query 1 B-Tree recommended columns: (is_active, start_time) reason: Equality first, then Range
-- Query 2 B-Tree recommended columns:(template_id, start_time) reason: Optimizes the Join + Date filter 
-- Query 3 B-Tree recommended columns: (user_id, registered_at DESC) reason: Powers the filter AND the sort.
