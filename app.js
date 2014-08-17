var open = require('open');
var Q = require('q');
var request = require('request');
var config = require('./lib/config');

var readline = require('readline');

var rl = readline.createInterface(
    {
     input: process.stdin,
        output: process.stdout,
        terminal: false
    });

var app =
{
    appID : 4509664,
    appSecret: 'OmP8REoS6fVjnRW8wZ92',
    access_token: null
}

var VK = function(_app)
{
    var app = _app;

    return {
        req: function()
        {
            var def = Q.defer();

            var uri = "https://api.vk.com/method/getProfiles?uid=66748&access_token="+app.access_token;

            request(uri, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body) // Print the google web page.
                }
            });

            return def.promise;
        }
    }
};



var connect = function()
{
    /*
     https://oauth.vk.com/authorize?
     client_id=APP_ID&
     scope=PERMISSIONS&
     redirect_uri=REDIRECT_URI&
     display=DISPLAY&
     v=API_VERSION&
     response_type=token
     */

    var page = "https://oauth.vk.com/authorize?";
    page += "client_id="+app.appID;
    page += "&scope=4096";
    page += "&redirect_uri=https://oauth.vk.com/blank.html";
    page += "&display=popup";
    page += "&v=5.24";
    page += "&response_type=token";

    open(page, function(err, a, b)
    {
        if (err) throw err;
    });

    rl.question("Please, copy URI of opened page and paste: ", function(login)
    {
        var reg = /access_token=(.+)&expires_in=(.+)&user_id=(.+)$/i;
        var a = login.match(reg);

        app.access_token = a[1];
        config.set('access_token', app.access_token);
        config.save(function(err)
        {
            if (err) throw err;
        });
        console.log(a);
        console.log('Your page: ', login);

        var vk = VK(app);
        vk.req();
    });
};

rl.on('line', function(cmd)
{
   console.log(cmd);
});

if (typeof config.get('access_token') == "undefined")
{
    connect();
}

