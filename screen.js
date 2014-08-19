var blessed = require('blessed'),
    util    = require('util');

var screen = blessed.screen();
var program = blessed.program();



var box = blessed.box(
    {
        top: 0,
        left: 0,
        width: 30,
        height: screen.height - 1,
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
        height: screen.height - 4,
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
        bottom: 1,
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

var status = blessed.box(
    {
        left: 0,
        width: screen.width,
        bottom: 0,
        height: 1,
        content: "status",
        tags: true
    }
)

screen.append(box);
screen.append(chat);
screen.append(input);
screen.append(status);

screen.key([':'], function(ch, key)
{
    box.insertLine(1, 'foo');
    screen.render();
});

var message = "";

// modes: 0 - normal, 1 - insert
var mode = 0;

program.on('keypress', function(ch, key)
{
    if (mode == 0)
    {
        switch (ch)
        {
            case 'i':
                mode = 1;
                break;

        }

        switch (key.name)
        {
            case 'up':
                break;
            case 'down':
                break;
        }
    }
    else
    {
        switch (key.name)
        {
            case 'escape':
                mode = 0;
                break;
            case 'enter':
                mode = 0;
                message = "";
                break;
            default :
                message += ch;
                break;
        }
    }
    redraw();
});

screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
});

box.focus();

screen.render();

var contactList = [];

var redraw = function()
{

    status.setContent('Mode: '+(mode == 0? "{green-fg}normal{/green-fg}":"{red-fg}insert{/red-fg}"));

    box.setContent('{bold}Contacts:{/bold}');
    for (var i in contactList)
    {
        var contact = contactList[i];
        var str = util.format('%s %s %s %s',
            (contact.online == 1? "{green-fg}o{/green-fg}":"f"),
            contact.first_name,
            contact.last_name,
            (contact.unread > 0? contact.unread: " "));
        box.pushLine(str);

        var line = blessed.line({
            content: "sdds"
        })
        box.pushLine(line);
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