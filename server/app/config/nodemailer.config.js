require('dotenv').config();
const nodemailer = require('nodemailer');
const config = require('../config/auth.config');

const user = config.user;
const pass = config.pass;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

module.exports.sendConfirmationEmail = (name, email, confirmationCode) => {
  transport
    .sendMail({
      from: user,
      to: email,
      subject: 'Please confirm your account',
      html: `<h1>Email Confirmation</h1>
        <h2>Welcome ${name}</h2>
        <p>Thank you for being part of wortheum community, India's first Web 3.0 based News platform where content creators, News creators and even readers will earn rewards.</p>
       <p> Please confirm your email by clicking on the following link</p>
        <a href=http://localhost:3000/confirm/${confirmationCode}> Click here</a>
       <p> Let's grow together!</p>
       <p>Best Regards,</p>
      <p> Team Wortheum</p>
        </div>`,
    })
    .catch((err) => console.log(err));
};
