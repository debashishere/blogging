
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' });

const nodeMailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `https://developers.google.com/oauthplayground`
const REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN
const MY_EMAIL = process.env.USER_EMAIL

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });


module.exports = {
    sendMail: async function (sender, receiver, subject, message, template) {
        try {
            //get access toeken
            const accessToken = await oAuth2Client.getAccessToken();
            // create a transport
            const transport = nodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: MY_EMAIL,
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refreshToken: REFRESH_TOKEN,
                    accessToken: accessToken
                }
            })
            //optins for emial
            const mailOptions = {
                from: sender,
                to: receiver,
                subject: subject,
                text: message,
                html: template,
            }

            const result = await transport.sendMail(mailOptions);
            return result;

        }
        catch (err) {
            console.log(err);
            return err;
        }
    },
}
