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
  let subject = `🔫🎯 Your first target for MHS Senior Assassin`;
  if (!isFirst) {
    subject = `🔫🎯 Elimination confirmed! Your next target... (#${user.data.elimination_count + 1})`;
  }
  let emailText = `Your next target for MHS Senior Assassin is enclosed in this email.\nA friendly reminder that all eliminations/resignations must have evidence and be posted at https://marinercentral.net!\n\nYOUR NEXT TARGET:\n${target.data.first_name} ${target.data.last_name}\n\nElimination Form: https://forms.gle/RF94Knbtpg29AYHh6\n\nGood luck, ${user.data.first_name}!`;
  if (isFirst)
  {
    emailText = 'Congratulations, your last elimination has been confirmed!\n' + emailText;
  }
  transporter.sendMail({
    from: FROM_STR,
    to: user.data.email,
    subject,
    text: emailText
  }, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
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



module.exports = {
  sendConfirmationEmail,
  sendTargetEmail,
  sendEliminationEmail
};