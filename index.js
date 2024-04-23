require('dotenv').config();



// set up basic express server
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const emailManager = require('./email-manager');
const gameManager = require('./game-manager');
const { SupabaseUser, supabase } = require('./supabase-manager');

// make all files/directories in the public folder accessible
app.use(express.static('public'));

// set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log('MHS Senior Assassin server is running on port 3000');
});


// RUN FUN CODE WITH gameManager HERE!!!
// gameManager.confirmUser('24lasfir@manistee.org', 'Firstname', 'Lastname', 'color'/*, 'avatarurl.com/img.png'*/);
// emailManager.sendPregameUpdateEmail('25maunoa@manistee.org');

async function sendAllPregameUpdate() {
  const { data: users, error } = await supabase
    .from('mhs_24_senior_assassin_users')
    .select('email');
  if (error) {
    console.error(error);
    return;
  }
  for (const user of users) {
    emailManager.sendPregameUpdateEmail(user.email);
  }
}

// sendAllPregameUpdate();
// dont uncomment until website is finished