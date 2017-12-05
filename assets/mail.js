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

    var mailOptions = {
        from: 'websiteupdates@cigionline.org',
        to: 'namscott@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

});
   