// 1. Аргументы командной строки
// 2. Переменные среды
// 3. Наш собственный файл с конфигурацией

var fs = require('fs');
var path = require('path');
var homedir = require('homedir');

var conf_file = path.resolve(homedir(), '.vkclirs')

fs.existsSync(conf_file, function (exists) {
   if (!exists)
   {
       fs.writeFileSync(conf_file, '{}', function (err) {
           if (err) throw err;
           console.log('It\'s saved!');
       });
   };
});

var nconf = require('nconf');
nconf.argv()
    .env()
    .file({ file: conf_file });

module.exports = nconf;