async function  bookSlot(req, res){
  const { userId, occurrenceId } = req.body;
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++){
    try{
      await attemptBooking(userId, occurrenceId);
      return res.status(200).json({
        success: true,
        message: 'Booking confirmed'
      });
    }catch(error){
      const isConflict = error.code === 'VERSION_MISMATCH';
      const canRetry = attempt < MAX_RETRIES;

      if (isConflict && canRetry){
        console.warn(`Attempt ${attempt}: Concurrency conflict. Retrying...');
        await new Promises(res => setTimeout(res, Math.pow(2, attempt - 1)));
        continue;
      }
      
      const status = isConflict ? 409 : 500;
      const message = isConflict
      ? 'Slot taken. Please try an other time slot.'
      : 'Server error. Please try again later.';
    
      return res.status(status).json({error: message });
    }
  }
}
