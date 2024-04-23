require('dotenv').config();

// set up basic express server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// make all files/directories in the public folder accessible
app.use(express.static('public'));

app.listen(3000, () => {
  console.log('MHS Senior Assassin server is running on port 3000');
});