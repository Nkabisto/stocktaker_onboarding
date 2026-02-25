// Option A: Automatic Retry (Backend)
// Express endpoint
async function bookSlot(req,res){
  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++){
    try{
      await attemptBooking(userId, occurrenceId);
      return res.json ({success:true});
    } catch(error){
        if (error.code === 'VERSION_MISMATCH' && attempt < MAX_RETRIES){
          // Wait a bit and retry
          await sleep(100 * attempt); // Exponential bac koff
          continue;
        }
        throw error;
      }
  }

  return res.status(409).json({
    error: 'Slot filled during booking attempt'
  });
}


// Option B: User-initiated Retry (Frontend)
// React Component
const handleBooking = async () => {
  try {
    await api.bookSlot(occurrenceId);
    setSuccess(trye);
  } catch(error){
      if (error.status === 409){
      // Show user: "This slot just filled. Try another?"
      setError('Slot unavailable, please select another time');
    }
  }
};

