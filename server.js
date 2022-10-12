// Import express library
const express = require('express');
const fetchListings = require('./EtsyListing/listing-endpoint')

// Create a new express app
const app = express();

// Routes
app.use('/etsy', require('./routes/auth'))


// Start server on port 3000
const PORT = 3003;
app.listen(PORT, () => console.log(`etsyListingPractice running on http://localhost:${PORT}`))