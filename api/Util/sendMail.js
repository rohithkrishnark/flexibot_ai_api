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

// const htmlTemplate = `
//   <div style="font-family: Arial; padding:20px;">
//     <h1 style="color:#13163c;">Welcome ${alum_name}</h1>
//     <p>Your alumni registration was successful.</p>
//     <hr/>
//     <small>Training Portal Team</small>
//   </div>
// `;

// const htmlTemplate = `
//       <h2>Welcome ${alum_name} 🎉</h2>
//       <p>Your alumni profile has been successfully registered.</p>
//       <p>Thank you for joining us.</p>
//     `;

//     await sendMail(
//       alum_email,
//       "Welcome to Alumni Portal",
//       htmlTemplate
//     );
