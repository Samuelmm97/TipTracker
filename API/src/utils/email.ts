const nodemailer = require("nodemailer");

export const email = {

    /**
     * @function    :   sendVerification()        
     *   
     * @brief   This function sends a verification email to the email address the user sent during
     *          the registration step. This email contains a verification link with a token that 
     *          ties the link with the account it's meant for.
     * 
     * @param   recipient   string      email of the recipient
     * @param   user_id     number      id of user for accounts table in database
     * @param   token       string      jwt token for building verification link
     * 
     * @return  None
     * 
     * @example
     *      sendVerification("example@example.com", 31, token1);
     *      await sendVerification("foo@bar.net", 100, token2);
     */
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