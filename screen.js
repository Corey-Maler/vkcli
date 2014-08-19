var blessed = require('blessed'),
    util    = require('util');

var screen = blessed.screen();
var program = blessed.program();



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
    }
    else
    {
        message += ch;
        redraw();
    }
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