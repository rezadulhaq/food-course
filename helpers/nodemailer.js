const nodemailer = require('nodemailer')

function sendEmail(emailSend, data) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "dhiaulhaqreza@gmail.com",
            pass: "cfyttisuwqnwtzpx"
        },
        debug: true,
        logger: true
    })

    let details = {
        from: "dhiaulhaqreza@gmail.com",
        to: emailSend,
        subject: `Selamat!, kamu berhasil membeli ${data}`,
        text: "TES TES TES"
    }

    transporter.sendMail(details, (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log('KEKIRIM!!!');
        }
    })
}

module.exports = sendEmail
