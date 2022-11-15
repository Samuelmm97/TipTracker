const nodemailer = require("nodemailer");

export const email = {

    sendVerification: async (recipient: string, user_id: number, port: string) => {

        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: recipient, // list of receivers
            subject: "Tipmate account verification", // Subject line
            text: `http://localhost:3000/verify/${user_id}`, // plain text body
            html: `<b><a href='http://localhost:3000/verify/${user_id}'>http://localhost:3000/verify/${user_id}</a></b>`, // html body
        });

        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
};