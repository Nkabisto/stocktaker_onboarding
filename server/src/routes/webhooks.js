const express = require('express');
const router =expres.Router();

// This creates the "/clerk" portion of the URL
router.post('/clerk'. (req, res) =>{
  console.log('Webhooks received!');
  res.status(200).send('Success');
});

module.exports = router;
