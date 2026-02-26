async function attemptBooking(userId, occurrenceId){
  const client = await pool.connect();

  try{
    await client.query('BEGIN');

    // Attempt optimistic update
    const updateResult = await client.query(`
      UPDATE event_occurrences
      SET current_bookings = current_bookings + 1,
        version = version + 1
      WHERE id = $1
        AND version = $2
        AND current_bookings < capacity_limit
      RETURNING id, version, current_bookings
      `, [occurenceId, expectedVersion]);

    // Check if update succeeded
    if(updatedResult.rowCount === 0){
      // UPDATE affected rows = version mismatch or slot fulll!
      throw{
        code: 'VERSION_MISMATCH',
        message: 'Slot was taken by an other user'
      };
    }

    // Update succeeded, now insert the registration
    await client.query(`
      INSERT INTO event_registrations (user_id, occurrence_id)
      VALUES ($1, $2) 
    `, [userId, occurrenceId]);

    await client.query('COMMIT');
    return updatedResult.rows[0];
  } catch(error){
      await client.query('ROLLBACK');
      throw error;
  } finally {
      client.release();
  }
}
