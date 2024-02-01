const nodemailer = require("nodemailer");
const path = require("path");
const pug = require("pug");
const htmlToText = require("html-to-text");
module.exports = class Email {
   constructor(user, link) {
      this.to = user.email;
      this.firstName = user.username.split(" ")[0];
      this.from = process.env.EMAIL_FROM;
      this.link = link;
   }

   newTransport() {
      if (process.env.NODE_ENV === "production") {
         // Sendgrid
         return -99;
      } else {
         return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            // secure: true,
            auth: {
               user: process.env.EMAIL_USER,
               pass: process.env.EMAIL_PASS,
            },
         });
      }
   }

   async send(template, subject) {
      // render HTML(pug) template
      const html = pug.renderFile(
         path.join(
            __dirname,
            "..",
            "views",
            "emails",
            `${template}.pug`
         ),
         // needed in customized emails
         {
            firstName: this.firstName,
            link: this.link,
            subject,
         }
      );
      // mail options
      const mailOptions = {
         from: this.from,
         to: this.to,
         subject,
         html,
         text: htmlToText.convert(html),
      };
      // create a transport and send email
      await this.newTransport().sendMail(mailOptions);
   }

   async sendWelcome() {
      await this.send("welcome", "Welcome to the Natours family");
   }

   async sendPasswordReset() {
      await this.send(
         "resetPwd",
         "Password reset token (valid only for 10min)"
      );
   }
};
