var util    = require('util'),
    clc     = require('cli-color');

var print = function(vk)
{
    var printMessage = function(ms)
    {
        var u = vk.userById(ms.user_id);

        var str = "\e[34m%s %s {%s}:\e[0m %s";

        var str  = clc.blue("%s %s ");
            str += clc.blue.bold("{%s}");
            str += clc.red(" %s ");
            str += "%s"

        var mode = (ms.out == 1? ">>" : "<<");

        var out = util.format(str, u.first_name, u.last_name, u.alias, mode, ms.body);

        console.log(out);
    };

    var line = function(obj)
    {
        if (obj.type == "message")
            printMessage(obj);
    };

    var arr = function(objs)
    {
        for (var i in objs)
        {
            line(objs[i]);
        }
    };

    return {line: line, arr: arr};
};

module.exports = print;