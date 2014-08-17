#!/usr/bin/env node
var open = require('open');
var Q = require('q');
var config = require('./lib/config');

var readline = require('readline');

var VK = require('./lib/vk');

var rl = readline.createInterface(
    {
     input: process.stdin,
        output: process.stdout,
        terminal: false
    });

var app =
{
    appID : 4509664,
    access_token: config.get('access_token')
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
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
    var print = require('./lib/print')(vk);
    vk.req('getProfiles', {uid: "66748"});

    vk.getUsersFromDialogs().then(vk.formatUserList).then(vk.printDialogs).then(print.arr);

    setInterval(function()
    {
        vk.getUnread().then(print.arr);
    }, 1000);


    var com = /([0-9a-zA-Z]+): (.+)/i;
    var ifargs = /^:\b([a-zA-Z0-9]+)\b/gi;
    var args = /\b([a-zA-Z0-9]+)\b/gi;

    var sendMes = function(str)
    {
        var a = cmd.match(com);
        var to = a[1];
        var body = a[2];

        vk.sendMessage(to, body);
    }

    var commands =
    {
        chats: function(args)
        {
            print.status('Conversation list:');
            vk.getDialogs(args[1]).then(print.arr);
        }
    }

    var command = function(str)
    {
        var a = str.match(args);
        console.log('You command: ', a[0]);
        console.log('args: ', a[2], a[3]);

        console.log(a);

        if (typeof commands[a[0]] == "function")
        {
            commands[a[0]](a);
        }

    }

    rl.on('line', function(cmd)
    {
        if (com.test(cmd))
        {
            sendMes(cmd);
        }
        else
        {
            if (cmd.charAt(0) == ":")
                command(cmd);
            else
                print.error('Unknown symbol. Print :h for help')
        }

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
