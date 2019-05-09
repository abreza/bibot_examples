const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
//app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');


app.get('/', function (req, res, next) {
    res.render("example.ejs");
});

app.post('/', urlencodedParser, function (req, res, next) {
    let secret_key = "your secret key!";
    let data = JSON.stringify({
        response: req.body["bibot-response"],
        secretkey: secret_key
    });

    const options = {
        hostname: 'api.bibot.ir',
        path: '/api1/siteverify/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json'
        }
    };

    let body = "";
    const request = https.request(options, (response) => {
        console.log(`statusCode: ${response.statusCode}`);
        response.on('data', (d) => {
            body += d;
            //process.stdout.write(d)

        });

        response.on('end', () => {
            body = JSON.parse(body);
            if (body.success) {
                res.render('example.ejs', {
                    message: 'Your contact request have submitted successfully.',
                    message_tag: "success"
                });
            } else {
                res.render('example.ejs', {
                    message: 'Robot verification failed, please try again.',
                    message_tag: "error"
                });
            }


        });

    });
    request.on('error', (error) => {
        console.error(error)
    });

    request.write(data);
    request.end()


});


app.listen(8000, function () {
    console.log("server is runing :) ");
});

