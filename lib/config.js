// 1. Аргументы командной строки
// 2. Переменные среды
// 3. Наш собственный файл с конфигурацией

var fs = require('fs');

fs.existsSync('./config/main.json', function (exists) {
   if (!exists)
   {
       fs.writeFileSync('./config/main.json', '{}', function (err) {
           if (err) throw err;
           console.log('It\'s saved!');
       });
   };
});

var nconf = require('nconf');
nconf.argv()
    .env()
    .file({ file: './config/main.json' });

module.exports = nconf;