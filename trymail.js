const mailsender = require('./assets/mail.main.template');

let mailOptions = {
  from: `"ParcelPro" <${process.env.EMAIL}>`,
  to: '',
  subject: '',
  text: '',
  title: '',
  message: '',
  dateTimeLocalString: '',
};

// Send mail

const sendMail = async data => {
  const { email, subject, title, message } = data;
  mailOptions.to = email;
  mailOptions.subject = subject;
  mailOptions.title = title;
  mailOptions.message = message;

  try {
    await mailsender(mailOptions);
    console.log('Mail sent successfully');
  } catch (error) {
    console.error('Error sending mail:', error);
  }
};

sendMail({
  email: 'ribhusaha2003@gmail.com',
  subject: 'testing',
  title: 'try 2',
  message: 'try 3',
});
