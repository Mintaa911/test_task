const nodemailer = require('nodemailer');
// Nodemailer setup (replace with your email service provider details)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: "amirtest798@gmail.com",
        pass:  "wgwyzidawhtmtdxf",
    },
});


module.exports = {
    sendEmailNotification
}

// Function to send email notification
function sendEmailNotification(task) {
    const mailOptions = {
      from: "amirtest798@gmail.com",
      to: task.assigned_to,
      subject: 'New Task Assigned',
      text: `A new task has been assigned to you.\nTitle: ${task.title}\nDescription: ${task.description}`,
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
}