import nodeMailer from 'nodemailer'
const sendEmail = async(options)=>{

    const transporter = nodeMailer.createTransport({
        // host:'smtp.gmail.com',
        port:587,
        // port:465,
        secure:false,
        // service:process.env.SMPT_SERVICE,
        service:'gmail',
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD
        }
    })
    const mailOptions = {
        from : process.env.SMPT_MAIL,
        to:options.userEmail,
        subject:options.subject,
        text:options.message
    }
   await transporter.sendMail(mailOptions, (error, info) => {
       if (error) {
           return console.log(error);
       }
       console.log('Message sent: %s', info.messageId);
       console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
   });
}

export default sendEmail;