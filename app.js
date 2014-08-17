var vksdk = require('vksdk');
var vk = new vksdk({appID: 4509664, appSecret: 'OmP8REoS6fVjnRW8wZ92', 'mode': "oauth"});

var readline = require('readline');

var rl = readline.createInterface(
    {
     input: process.stdin,
        output: process.stdout,
        terminal: false
    });

var acc = {login: null, pass: null};
var connect = function(acc)
{
    vk.acquireToken(acc.login, acc.pass);
    vk.on('appServerTokenReady', function() {
        vk.request('acquireTokenReady');
        // etc

        console.log('connected');


    });

    vk.request('getProfiles', {'uids' : '29894'});
    vk.on('done:getProfiles', function(_o) {
        console.log(_o);
    });
    vk.on('acquireTokenNotReady', function(_error) {
        // error handler
    });
};

rl.on('line', function(cmd)
{
   console.log(cmd);
});

rl.question("Enter you vk login: ", function(login)
{
    console.log('You login: ', login);
    acc.login = login;
    rl.question("Your password: ", function(pass)
    {
        console.log('Your password: ', pass);
        acc.pass = pass;

        console.log('Trying to connect...');
        connect(acc);

    });
});

