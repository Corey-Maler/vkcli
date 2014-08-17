var print = function(vk)
{
    var printMessage = function(ms)
    {
        console.log(ms);
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