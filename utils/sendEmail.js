// app.js
const nodemailer = require("nodemailer");

async function sendEmail(options) {
	// service
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		// secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});
	// mail options
	const mailOptions = {
		from: "alabenaissia@natours.io",
		to: options.email,
		subject: options.subject,
		text: options.text,
	};
	// send email
	await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
