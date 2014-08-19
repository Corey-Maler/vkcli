var blessed = require('blessed'),
    util    = require('util');

var screen = blessed.screen();

var box = blessed.box(
    {
        top: 0,
        left: 0,
        width: 30,
        height: screen.height,
        content: "hello {bold}world{/bold}!",
        tags: true,
        border:
        {
            type: 'line'
        },
        style:
        {
            fg: "white",
            border:
            {
                fg: "#f0f0f0"
            },
            hover:
            {
                bg: "green"
            }
        }
    }
);

var chat = blessed.box(
    {
        top: 0,
        left: 30,
        width: screen.width - 30,
        height: screen.height - 3,
        content: "hello {right}{bold}world{/bold}{/right}!",
        tags: true,
        border:
        {
            type: 'line'
        },
        style:
        {
            fg: "red",
            border:
            {
                fg: "#f0f0f0"
            },
            hover:
            {
                bg: "green"
            }
        }
    }
);

var input = blessed.box(
    {
        left: 30,
        //top: 'bottom',
        bottom: 0,
        width: screen.width - 30,
        height: 3,
        content: "input",
        tags: true,
        border:
        {
            type: 'line'
        },
        style:
        {
            fg: "red",
            border:
            {
                fg: "#f0f0f0"
            },
            hover:
            {
                bg: "green"
            }
        }
    }
);

screen.append(box);
screen.append(chat);
screen.append(input);

screen.key([':'], function(ch, key)
{
    box.insertLine(1, 'foo');
    screen.render();
});

var message = "";

screen.key(['i'], function(ch, key)
{
    message += "2";
    redraw();
});

screen.key(['escape', 'C-c'], function(ch, key) {
    return process.exit(0);
});

box.focus();

screen.render();

var contactList = [];

var redraw = function()
{
    box.setContent('{bold}Contacts:{/bold}');
    for (var i in contactList)
    {
        var contact = contactList[i];
        var str = util.format('%s %s %s %s',
            (contact.online == 1? "{green-fg}o{/green-fg}":"f"),
            contact.first_name,
            contact.last_name,
            (contact.unread > 0? contact.unread: " "));
        box.insertLine(1, str);
    }

    input.setContent(message);
    screen.render();
}

var c =
{
    setContactList: function(cl)
    {
        contactList = cl;
        redraw();
    }
}

module.exports = c;