require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

module.exports = transporter;

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"ST Banking services" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
    const subject = "Welcome to ST Banking Services";
    const text = `Hello ${name}, \n\n Thankyou for registering at ST Banking services. \n\n We're excited to have you onboard.\n\n Best regards, \n ST Banking Services Team`
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ST Banking Services</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:40px 0;">
        <tr>
        <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">

            <!-- Header -->
            <tr>
                <td align="center" style="background:#0d6efd; color:#ffffff; padding:35px;">
                    <h1 style="margin:0;"> ST Banking Services</h1>
                    <p style="margin-top:10px; font-size:16px;">
                        Secure • Reliable • Always Here for You
                    </p>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="padding:40px; color:#333333;">

                    <h2 style="margin-top:0;">
                        Welcome to ST Banking Services!
                    </h2>

                    <p style="font-size:16px; line-height:1.7;">
                        Hello ${name}, thank you for creating your account with <strong>ST Banking Services</strong>.
                        We are excited to have you on board and look forward to helping you manage
                        your finances securely and conveniently.
                    </p>

                    <p style="font-size:16px; line-height:1.7;">
                        Your account has been successfully created, and you can now enjoy a range of
                        banking services including secure account management, seamless transactions,
                        balance tracking, and much more.
                    </p>

                    <div style="background:#f8f9fa; padding:20px; border-left:5px solid #0d6efd; margin:30px 0;">
                        <strong>Getting Started</strong>
                        <ul style="margin-top:10px; line-height:1.8;">
                            <li> Log in to your account securely.</li>
                            <li> Complete your profile information.</li>
                            <li> Explore your banking dashboard.</li>
                            <li> Keep your login credentials safe and confidential.</li>
                        </ul>
                    </div>

                    <p style="font-size:16px; line-height:1.7;">
                        If you have any questions or need assistance, our support team is always ready
                        to help. We're committed to providing you with a secure and seamless banking
                        experience.
                    </p>

                    <p style="font-size:16px;">
                        Once again,
                        <br><br>
                        <strong>Welcome to the ST Banking Services family!</strong> 
                    </p>

                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td align="center" style="background:#f4f6f9; padding:25px; color:#777777; font-size:13px;">
                    <p style="margin:0;">
                        © 2026 ST Banking Services. All rights reserved.
                    </p>

                    <p style="margin-top:10px;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </td>
            </tr>

        </table>

        </td>
        </tr>
        </table>

        </body>
        </html>
        `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendLoginEmail(userEmail, name) {
    const subject = "Welcome to ST Banking Services";
    const text = `Hello ${name}, \n\n A login has been detected from your account at ST Banking Services. \n\n Best regards, \n ST Banking Services Team`
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to ST Banking Services</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:40px 0;">
        <tr>
        <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">

            <!-- Header -->
            <tr>
                <td align="center" style="background:#0d6efd; color:#ffffff; padding:35px;">
                    <h1 style="margin:0;"> ST Banking Services</h1>
                    <p style="margin-top:10px; font-size:16px;">
                        Secure • Reliable • Always Here for You
                    </p>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="padding:40px; color:#333333;">

                    <h2 style="margin-top:0;">
                        Login Detected!
                    </h2>

                    <p style="font-size:16px; line-height:1.7;">
                        Hello ${name}, a login was detected for your account with <strong>ST Banking Services</strong>.
                        We look forward to help you manage
                        your finances securely and conveniently.
                    </p>

                    <div style="background:#f8f9fa; padding:20px; border-left:5px solid #0d6efd; margin:30px 0;">
                        <strong>Important things to keep in mind</strong>
                        <ul style="margin-top:10px; line-height:1.8;">
                            <li> Log in to your account securely.</li>
                            <li> Keep your login credentials safe and confidential.</li>
                        </ul>
                    </div>

                    <p style="font-size:16px; line-height:1.7;">
                        If you have any questions or need assistance, our support team is always ready
                        to help. We're committed to providing you with a secure and seamless banking
                        experience.
                    </p>

                    <p style="font-size:16px;">
                        Regards,
                        <br>
                        ST Banking Services 
                    </p>

                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td align="center" style="background:#f4f6f9; padding:25px; color:#777777; font-size:13px;">
                    <p style="margin:0;">
                        © 2026 ST Banking Services. All rights reserved.
                    </p>

                    <p style="margin-top:10px;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </td>
            </tr>

        </table>

        </td>
        </tr>
        </table>

        </body>
        </html>
        `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Completed!";
    const text = `Hello ${name}, \n\n your transaction of amount ${amount} has been completed and sent to account :${toAccount}. \n\n Best regards, \n ST Banking Services Team`
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transaction Completed</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:40px 0;">
        <tr>
        <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">

            <!-- Header -->
            <tr>
                <td align="center" style="background:#0d6efd; color:#ffffff; padding:35px;">
                    <h1 style="margin:0;"> ST Banking Services</h1>
                    <p style="margin-top:10px; font-size:16px;">
                        Secure • Reliable • Always Here for You
                    </p>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="padding:40px; color:#333333;">

                    <h2 style="margin-top:0;">
                        Login Detected!
                    </h2>

                    <p style="font-size:16px; line-height:1.7;">
                        Hello ${name}, Your transaction of amount ${amount} to the acount ${toAccount}has been completed. Thankyou for choosing <strong>ST Banking Services</strong>.
                        We look forward to help you manage
                        your finances securely and conveniently.
                    </p>

                    <div style="background:#f8f9fa; padding:20px; border-left:5px solid #0d6efd; margin:30px 0;">
                        <strong>Important things to keep in mind</strong>
                        <ul style="margin-top:10px; line-height:1.8;">
                            <li> Keep your login credentials safe and confidential.</li>
                            <li> If the money hasn't reached the reciever yet, please wait for sometime or contact our helpline.</li>
                        </ul>
                    </div>

                    <p style="font-size:16px; line-height:1.7;">
                        If you have any questions or need assistance, our support team is always ready
                        to help. We're committed to providing you with a secure and seamless banking
                        experience.
                    </p>

                    <p style="font-size:16px;">
                        Regards,
                        <br>
                        ST Banking Services 
                    </p>

                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td align="center" style="background:#f4f6f9; padding:25px; color:#777777; font-size:13px;">
                    <p style="margin:0;">
                        © 2026 ST Banking Services. All rights reserved.
                    </p>

                    <p style="margin-top:10px;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </td>
            </tr>

        </table>

        </td>
        </tr>
        </table>

        </body>
        </html>
        `;

    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailEmail(userEmail, name, amount, toAccount) {
    const subject = "Transaction Failed";
    const text = `Hello ${name}, \n\n your transaction of amount ${amount} to account :${toAccount} has been FAILED. Please try again. \n\n Best regards, \n ST Banking Services Team`
    const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Transaction Failed</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f4f6f9; font-family:Arial, Helvetica, sans-serif;">

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f9; padding:40px 0;">
        <tr>
        <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">

            <!-- Header -->
            <tr>
                <td align="center" style="background:#0d6efd; color:#ffffff; padding:35px;">
                    <h1 style="margin:0;"> ST Banking Services</h1>
                    <p style="margin-top:10px; font-size:16px;">
                        Secure • Reliable • Always Here for You
                    </p>
                </td>
            </tr>

            <!-- Body -->
            <tr>
                <td style="padding:40px; color:#333333;">

                    <h2 style="margin-top:0;">
                        Login Detected!
                    </h2>

                    <p style="font-size:16px; line-height:1.7;">
                        Hello ${name}, Your transaction of amount ${amount} to the acount ${toAccount}has been failed, please try again. Thankyou for choosing <strong>ST Banking Services</strong>.
                        We look forward to help you manage
                        your finances securely and conveniently.
                    </p>

                    <div style="background:#f8f9fa; padding:20px; border-left:5px solid #0d6efd; margin:30px 0;">
                        <strong>Important things to keep in mind</strong>
                        <ul style="margin-top:10px; line-height:1.8;">
                            <li> Keep your login credentials safe and confidential.</li>
                        </ul>
                    </div>

                    <p style="font-size:16px; line-height:1.7;">
                        If you have any questions or need assistance, our support team is always ready
                        to help. We're committed to providing you with a secure and seamless banking
                        experience.
                    </p>

                    <p style="font-size:16px;">
                        Regards,
                        <br>
                        ST Banking Services 
                    </p>

                </td>
            </tr>

            <!-- Footer -->
            <tr>
                <td align="center" style="background:#f4f6f9; padding:25px; color:#777777; font-size:13px;">
                    <p style="margin:0;">
                        © 2026 ST Banking Services. All rights reserved.
                    </p>

                    <p style="margin-top:10px;">
                        This is an automated email. Please do not reply to this message.
                    </p>
                </td>
            </tr>

        </table>

        </td>
        </tr>
        </table>

        </body>
        </html>
        `;

    await sendEmail(userEmail, subject, text, html);
}


module.exports = {
    sendRegistrationEmail,
    sendLoginEmail,
    sendTransactionEmail,
    sendTransactionFailEmail
};