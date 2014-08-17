var vksdk = require('vksdk');

var readline = require('readline');

var rl = readline.createInterface(
    {
     input: process.stdin,
        output: process.stdout,
        terminal: false
    });

rl.on('line', function(cmd)
{
   console.log(cmd);
});