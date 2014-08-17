var open = require('open');

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

    /*
    open(page, function(err, a, b)
    {
        if (err) throw err;
    });
    */
};

rl.on('line', function(cmd)
{
   console.log(cmd);
});

connect();
rl.question("Please, copy URI of opened page and paste: ", function(login)
{
    var reg = /access_token=(.+)&expires_in=(.+)&user_id=(.+)$/i;
    var a = login.match(reg);
    console.log(a);
    console.log('Your page: ', login);
});

