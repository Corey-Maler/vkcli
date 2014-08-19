var blessed = require('blessed'),
    util    = require('util');

var screen = blessed.screen();
var program = blessed.program();



var box = blessed.list(
    {
        top: 0,
        left: 0,
        width: 30,
        height: screen.height - 1,
        tags: true,
        selectedBg: "white",
        selectedFg: "black",
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
            fg: "white",
            border:
            {
                fg: "#f0f0f0"
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
            fg: "white",
            border:
            {
                fg: "#f0f0f0"
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

var message = "";
var selected = 0;

// modes: 0 - normal, 1 - insert, 2 - command
var mode = 0;

var command = "";
var commands =
{
    'q': function()
    {
        return process.exit(0);
    }
}
var showUnknownCommand = null;

var hotkeys =
{
    'i': function()
    {
        mode = 1;
    },
    ':': function()
    {
        mode = 2;
    },
    'up': function()
    {
        selected --;
        if (selected < 0)
            selected = contactList.length - 1;
    },
    'down': function()
    {
        selected ++;
        if (selected > contactList.length - 1)
            selected = 0;
    }

}

program.on('keypress', function(ch, key)
{
    switch (mode)
    {
        case 0:
            if (typeof ch != "undefined" && typeof hotkeys[ch] == "function")
            {
                showUnknownCommand = null;
                hotkeys[ch]();
            }
            else
            {
                if (typeof hotkeys[key.name] == "function")
                {
                    showUnknownCommand = null;
                    hotkeys[key.name]();
                }
            }
            break;
        case 1:
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
                    if (typeof ch == "undefined") break;
                    message += ch;
                    break;
            }
            break;
        case 2:
            switch (key.name)
            {
                case 'escape':
                    mode = 0;
                    command = 0;
                    break;
                case 'enter':
                    mode = 0;
                    // todo: parse args
                    if (command.length > 0)
                    {
                        if (typeof commands[command] != "undefined")
                        {
                            commands[command]();
                        }
                        else
                        {
                            showUnknownCommand = util.format("{red-fg}Unknown command: %s{/red-fg}", command);
                        }
                    }
                    command = "";
                    break;
                default :
                    if (typeof ch == "undefined") break;
                    command += ch;
                    break;
            }
            break;
    }
    redraw();
});

screen.key(['C-c'], function(ch, key) {
    return process.exit(0);
});

box.focus();

var contactList = [];
var vk = null;

var redraw = function()
{
    if (mode == 2)
    {
        status.setContent(':'+command);
    }
    else
    {
        if (showUnknownCommand != null)
        {
            status.setContent(showUnknownCommand);
        }
        else
        {
            status.setContent('Mode: '+(mode == 0? "{green-fg}normal{/green-fg}":"{red-fg}insert{/red-fg}"));
        }
    }
    box.clearItems();
    //box.setContent('{bold}Contacts:{/bold}');
    for (var i in contactList)
    {
        if (!contactList.hasOwnProperty(i)) break;
        var contact = contactList[i];
        var str = util.format('%s %s %s %s',
            (contact.online == 1? "{green-fg}o{/green-fg}":"f"),
            contact.first_name,
            contact.last_name,
            (contact.unread > 0? contact.unread: " "));
        box.addItem(str);

    }

    box.select(selected);

    input.setContent(message);
    screen.render();
}

redraw();

var c =
{
    setVK: function(_vk)
    {
        vk = _vk;
        redraw();
    },
    setContactList: function(cl)
    {
        contactList = cl;
        redraw();
    }
}

module.exports = c;