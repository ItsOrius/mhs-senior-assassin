const nodemailer = require('nodemailer');

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



function sendConfirmationEmail(email)
{
  transporter.sendMail({
    from: FROM_STR,
    to: email,
    subject: "You're confirmed for MHS Senior Assassin!",
    text: "You're all set for MHS Senior Assassin! Keep an eye on your email for more information."
  }, (err, info) => {
    if (err) {
      console.error(err);
    } else {
      console.log(info);
    }
  });
}



module.exports = {
  sendConfirmationEmail
};