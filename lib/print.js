var util    = require('util'),
    clc     = require('cli-color');

var print = function(vk)
{
    var printMessage = function(ms)
    {
        //console.log(clc.reset);
        var u = vk.userById(ms.user_id);

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

    var status = function(str)
    {
        console.log(clc.green(str));
    }

    var error = function(str)
    {
        console.log(clc.red(str));
    }

    var c = {line: line, arr: arr, status: status, error: error};

    vk.setPrint(c);

    return c;
};

module.exports = print;