var vksdk = require('vksdk');

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

