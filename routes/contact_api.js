const router = require('express').Router();
const { sendMail } = require('../controller/sendmail');

//@desc post contact message
//@Route POST /api/contact
router.post('/', async (req, res) => {

    try {
        //send contact email to your mail
        await sendContactMail(req);
        // reply contacted user
        await replyContactMail(req)
        res.redirect('/');
    }

    catch (err) {
        res.redirect('/');
    }

})

module.exports = router;

//*******************FUNCTIONS***********************/
const sendContactMail = async function (req) {

    try {
        const sender = req.body.email;
        const receiver = process.env.MESSAGE_RECEIVER;
        const subject = `message from bogging`
        const message = req.body.message;
        const template = `<h3>${message}</h3>`
        sendMail(sender, receiver, subject, message, template)
            .then(res => {
                console.log("mail send", res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    catch (err) {

    }

}

const replyContactMail = async function (req) {

    try {
        const receiver = req.body.email;
        const sender = process.env.MESSAGE_RECEIVER;
        const subject = `Received your message at Debashis's Blog`;
        const message = `Thanks for your message ! we will get to you soon.`;
        const template = `<h4 style="color": "blue" >Thanks for your message ! we will get to you soon</h4>`;
        sendMail(sender, receiver, subject, message, template)
            .then(res => {
                console.log("mail send", res)
            })
            .catch(err => {
                console.log(err)
            })
    }

    catch (err) {

    }

}




