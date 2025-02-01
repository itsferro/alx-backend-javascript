// Import the express module
const express = require('express');

// Create an instance of express
const app = express();

// Define a route for the root endpoint '/'
app.get('/', (req, res) => {
  res.send('Hello ALX!');
});

// Start the server and listen on port 1245
const PORT = 1245;
app.listen(PORT, () => {
  console.log(`Server is running and listening on port ${PORT}`);
});

// Export the app variable
module.exports = app;
