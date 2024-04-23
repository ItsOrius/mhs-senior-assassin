require('dotenv').config();

// set up basic express server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const emailManager = require('./email-manager');

// make all files/directories in the public folder accessible
app.use(express.static('public'));

// set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('MHS Senior Assassin server is running on port 3000');
});



// set up supabase
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);



// routes
app.post('/api/send-email', (req, res) => {
  
});