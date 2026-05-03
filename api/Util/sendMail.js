const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail
    pass: process.env.EMAIL_PASS, // app password
  },
});

const sendMail = async (to, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: `"Training Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent,
    });
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Mail Error:", error);
    return false;
  }
};

module.exports = sendMail;


