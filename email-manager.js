const nodemailer = require('nodemailer');
const { SupabaseUser, SupabaseElimination } = require('./supabase-manager');

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_PASS = process.env.GMAIL_PASS;

const FROM_STR = '"MHS Senior Assassin" <assassin@marinercentral.net>';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS
  }
});



/**
 * Sends a confirmation email to the user.
 * @param {SupabaseUser} user 
 */
function sendConfirmationEmail(user)
{
  if (!user.isLoaded()) {
    throw new Error('User data not loaded');
  }
  if (!user.data.email) {
    throw new Error('User data does not contain email:\n' + JSON.stringify(user.data, null, 2));
  }
  transporter.sendMail({
    from: FROM_STR,
    to: user.data.email,
    subject: `🔫✅ You're confirmed for MHS Senior Assassin, ${user.data.first_name}!`,
    text: `You're all set for MHS Senior Assassin, ${user.data.first_name} ${user.data.last_name}!\nKeep an eye on your email for more information.`
  }, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
}



/**
 * Sends an email to the user with their next target.
 * @param {SupabaseUser} user 
 * @param {SupabaseUser} target
 * @param {boolean} isFirst
 */
function sendTargetEmail(user, target, isFirst)
{
  if (!user.isLoaded() || !target.isLoaded()) {
    throw new Error('User data not loaded');
  }
  if (!user.data.email || !target.data.email) {
    throw new Error('User data does not contain email:\n' + JSON.stringify(user.data, null, 2));
  }
  if (!user.data.target || !target) {
    throw new Error('User data does not contain target:\n' + JSON.stringify(user.data, null, 2));
  }
  let subject = `🔫🎯 Your first target for MHS Senior Assassin (FINAL)`;
  if (!isFirst) {
    subject = `🔫🎯 Elimination confirmed! Your next target... (#${user.data.elimination_count + 1})`;
  }
  let imageText = `They didn't provide an image while signing up, but I'm sure that won't stop you!`;
  if (target.data.avatar_url) {
    imageText = `<img src="${target.data.avatar_url}" alt="Your target's image" style="max-width: 100%; height: auto;">`;
  }
  let emailText = `Your next target for MHS Senior Assassin is enclosed in this email.<br>A friendly reminder that all eliminations/resignations must have evidence and be posted on the elimination form!<br><br><b>YOUR NEXT TARGET:</b><br><i>${target.data.first_name} ${target.data.last_name}</i><br><br>${imageText}<br><br>Elimination Form: https://forms.gle/RF94Knbtpg29AYHh6<br><br>Good luck, ${user.data.first_name}!`;
  if (!isFirst)
  {
    emailText = 'Congratulations, your last elimination has been confirmed!\n' + emailText;
  }
  transporter.sendMail({
    from: FROM_STR,
    to: user.data.email,
    subject,
    html: emailText
  }, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
      if (info.accepted.length < 1) {
        sendEliminationEmail(user, eliminator, elim);
      }
    }
  });
}



/**
 * Send an email to the user letting them know they've been eliminated.
 * @param {SupabaseUser} user 
 * @param {SupabaseUser} eliminator
 * @param {SupabaseElimination} elim
 */
function sendEliminationEmail(user, eliminator, elim) {
  if (!user.isLoaded() || !eliminator.isLoaded() || !elim.isLoaded()) {
    throw new Error('Data not loaded');
  }
  if (!user.data.email) {
    throw new Error('User data does not contain email:\n' + JSON.stringify(user.data, null, 2));
  }
  transporter.sendMail({
    from: FROM_STR,
    to: user.data.email,
    subject: `🔫❌ You've been eliminated from MHS Senior Assassin!`,
    text: `Hello, ${user.data.first_name}.\nYou've been eliminated from MHS Senior Assassin by ${eliminator.data.first_name} ${eliminator.data.last_name}.\n\nEvidence: ${elim.data.video_link ?? "Manually Reviewed"}\nIf you believe that this was a mistake, please email 25maunoa@manistee.org!\n\nThank you for participating, ${user.data.first_name}!\nFINAL ELIMINATION COUNT: ${user.data.elimination_count}`
  }, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
}



/**
 * Sends out a pre-game update email, written 4/23/2024.
 * @param {string} email 
 */
function sendPregameUpdateEmail(email) {
  /*if (!user.isLoaded()) {
    throw new Error('User data not loaded');
  }
  if (!user.data.email) {
    throw new Error('User data does not contain email:\n' + JSON.stringify(user.data, null, 2));
  }*/
  transporter.sendMail({
    from: FROM_STR,
    to: email,
    subject: `🔫📢 SENIOR ASSASSIN: EVERYBODY'S TARGETS HAVE BEEN CHANGED`,
    html: `<h1>MHS Senior Assassin</h1>
    <p>We're super sorry to drop this on you right before school gets out, but due to a flaw in our target-picking algorithm, some players found that they were stuck in a "loop" where after their target was eliminated, they would no longer be able to eliminate or be eliminated.</p>
    <p>Because of this, we've had to reset the entire game. We've randomized the targets again, and we're ready to start fresh. We're sorry for the inconvenience, and we hope that this doesn't ruin the game for you.</p>
    <p>Also, a quick rule change...<p>
    <h2>NO MORE SELF-DEFENSE!</h2>
    <p>Outcry from the seniors has determined that you can no longer eliminate your assassin if they try to eliminate you. If they try and fail, run as fast as possible and STAY AWAY FROM THEM!</p>
    <p>Once more, we're super sorry about this switch-up, but we hope that we've adjusted the game to your class's liking!</p>
    <b>Mariners, stay on track!</b>
    <i>- Noah Maue, 25maunoa@manistee.org</i>`
  }, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
}



module.exports = {
  sendConfirmationEmail,
  sendTargetEmail,
  sendEliminationEmail,
  sendPregameUpdateEmail
};