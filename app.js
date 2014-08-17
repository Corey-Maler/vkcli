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
    access_token: config.get('access_token')
}

var VK = function(_app)
{
    var app = _app;

    return {
        req: function(method, data)
        {
            var def = Q.defer();


            var path = "";

            for (var i in data)
            {
                path += i + "=" + encodeURIComponent(data[i]) + "&";
            }

            var uri = "https://api.vk.com/method/"+method+"?"+path+"access_token="+app.access_token;
            console.log('request uri: ', uri);

            request(uri, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    def.resolve(JSON.parse(body));
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

        afterConnect();
    });
};

var afterConnect = function()
{
    var vk = VK(app);
    vk.req('getProfiles', {uid: "66748"});



    rl.on('line', function(cmd)
    {
        vk.req('messages.send', {user_id: 158530417, message: cmd}).then(function(data)
        {
           console.log(data);
        });
        console.log(cmd);
    });
}



if (typeof config.get('access_token') == "undefined")
{
    connect();
}
else
{
   afterConnect();
}
