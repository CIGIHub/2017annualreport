var nodemailer = require("nodemailer");
var bodyParser = require('body-parser');
var express = require('express');
var app     = express();

app.use(bodyParser.urlencoded({ extended: true })); 

app.post('/mail', function (req, res) {

    var transporter = nodemailer.createTransport({
        sendmail: true,
        newline: 'unix',
        path: '/usr/sbin/sendmail'
    });

    transporter.sendMail({
        from: 'websiteupdates@cigionline.com',
        to: req.query.email,
        subject: 'CIGI 2017 Annual Report',
        text: '<p>You have been invited to view our Annual report "<a href="https://cigionline.org/interactives/2017annualreport">.<p>'
    }, (err, info) => {
        console.log(info.envelope);
        console.log(info.messageId);
    });
});
    

