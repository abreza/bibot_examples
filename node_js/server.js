const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");
const urlencodedParser = bodyParser.urlencoded({extended: false});
const app = express();
app.set('view engine', 'ejs');

app.get('/', function (req, res, next) {
    res.render("example.ejs");
});


function request_to_bibot_server(secret, bibot_response, callback) {
    let data = JSON.stringify({
        response: bibot_response,
        secret: secret
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

    const request = https.request(options, (response) => {
        let body = "";
        console.log(`statusCode: ${response.statusCode}`);
        response.on('data', (d) => {
            body += d;
        });

        response.on('end', () => {
            body = JSON.parse(body);
            callback(body);
        });

    });
    request.on('error', (error) => {
        console.error(error)
    });
    request.write(data);
    request.end()
}


app.post('/', urlencodedParser, function (req, res, next) {
    let secret = 'your_site_key';
    if (req.body['bibot-response'] !== undefined) {
        if (req.body['bibot-response'] !== '') {
            request_to_bibot_server(secret, req.body['bibot-response'], function (bibot_server_response) {
                let messages = [];
                console.log(bibot_server_response);
                if (bibot_server_response['success']) {
                    messages.push({
                        'text': 'فرایند تایید هویت شما با موفقیت انجام شد!',
                        'tag': 'success'
                    });
                } else if (bibot_server_response['error-codes']) {
                    for (let error_code in bibot_server_response['error-codes']) {
                        messages.push({
                            'text': bibot_server_response['error-codes'][error_code],
                            'tag': 'error'
                        });
                    }
                } else {
                    messages.push({
                        'text': 'بی‌بات به درستی حل نشده است!',
                        'tag': 'error'
                    });
                }
                res.render('example.ejs', {messages: messages});
            })
        } else {
            res.render('example.ejs', {
                messages: [{
                    'text': 'بی‌بات به درستی حل نشده است!',
                    'tag': 'error'
                }]
            });
        }
    } else {
        res.render('example.ejs', {
            messages: [
                {
                    'text': 'ارتباط با سرور بی‌بات برقرار نشده است! آیا جاوااسکریپت شما فعال است؟',
                    'tag': 'error'
                }
            ]
        });
    }
});


app.listen(8000, function () {
    console.log("server is runing :) ");
});

