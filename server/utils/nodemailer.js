import nodemailer from 'nodemailer';

// Nodemailer
const sendEmail = async (options) => {
  try {
    // 1) Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT, // Port 587 for secure: false, Port 465 for secure: true
      secure: process.env.EMAIL_PORT === '465', // If port is 465, secure is true
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // 2) Define email options
    const mailOpts = {
      from: 'workout App <mohamedelsaid3963@gmail.com>',
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || undefined, // Support for HTML emails (optional)
    };

    // 3) Send email
    const info = await transporter.sendMail(mailOpts);

    console.log(`Email sent: ${info.response}`);
  } catch (error) {
    console.error(`Error sending email: ${error.message}`);
    throw new Error('Email could not be sent');
  }
};

// Export the sendEmail function
export default sendEmail;
