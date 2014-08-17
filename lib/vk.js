var Q       = require('Q'),
    request = require('request');

var VK = function(_app)
{
    var app = _app;

    var users = {};

    var nextAlias = 0;

    var dialogs = [];

    var printed = [];

    var c = {
        req: function(method, data)
        {
            var def = Q.defer();


            var path = "";

            for (var i in data)
            {
                path += i + "=" + encodeURIComponent(data[i]) + "&";
            }

            var uri = "https://api.vk.com/method/"+method+"?"+path+"access_token="+app.access_token+"&v=5.24";
            //console.log('request uri: ', uri);

            request(uri, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    def.resolve(JSON.parse(body));
                }
            });

            return def.promise;
        },
        formatUserList: function(ids)
        {
            var def = Q.defer();
            var uids = ids.join(',');
            c.req('users.get', {user_ids: uids}).then(function(data)
            {
                for (var i in data.response)
                {
                    var u = data.response[i];
                    u.alias = nextAlias ++;
                    users[u.id] = u;
                }
                def.resolve();
            });

            return def.promise;
        },
        user: function(alias)
        {
            for (var i in users)
            {
                if (users[i].alias == alias)
                {
                    return i;
                }
            }
        },
        printDialogs: function(data)
        {
            for (var i in dialogs)
            {
                if (typeof dialogs[i].body == "undefined") continue;
                var ms = dialogs[i];
                var u = users[ms.user_id];
                console.log(u.first_name + " " + u.last_name + " {"+ u.alias + "}:");
                console.log(ms.body);
            }
        },
        getDialogs: function()
        {
            var def = Q.defer();
            c.req('messages.getDialogs', {count: 10}).then(function(data)
            {
                var ulist = [];
                var d = data.response.items;
                for (var i = 0; i < d.length; i++)
                {
                    var mess = d[i].message;
                    if (typeof mess.user_id != "undefined") ulist.push(mess.user_id);
                    dialogs.push(mess);
                }

                def.resolve(ulist);
            });

            return def.promise;
        },
        getUnread: function()
        {
            c.req('messages.getDialogs', {count: 10, unread: 1}).then(function(data)
            {
                var ulist = [];
                var d = data.response.items;
                for (var i = 0; i < d.length; i++)
                {
                    var mess = d[i].message;

                    if (printed.contains(mess.id)) continue;

                    printed.push(mess.id);

                    var unread = d[i].unread;
                    var u = users[mess.user_id];

                    console.log(u.first_name + " " + u.last_name + " {"+ u.alias + "}, unread "+unread+":");
                    console.log(mess.body);
                }

            });
        },
        sendMessage: function(to, body)
        {

            c.req('messages.send', {user_id: c.user(to), message: body}).then(function(data)
            {
            });
        }

    }

    return c;
};

module.exports = VK;