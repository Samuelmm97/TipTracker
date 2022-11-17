const nodemailer = require("nodemailer");

export const email = {

    sendVerification: async (recipient: string, user_id: number, token: string) => {
        try {
            let transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_ADDRESS,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            let link = `${process.env.BACKEND_HOST}/verify/${user_id}/${token}`;

            let info = await transporter.sendMail({
                from: `"TipMate Team" <${process.env.EMAIL_ADDRESS}>`,
                to: recipient,
                subject: "Tipmate account verification",
                text: `Welcome to TipMate!\n\n
                To verify your account, click on the following link: ${link}`,
                html: `<p>Welcome to TipMate!</p>
                <p>&nbsp;</p>
                <p>To verify your account, please click on the following link: 
                <a href='${link}'>${link}</a></p>`
            });
        } catch(e) {
            console.log("Error sending verification email", e);
        }
    }
};