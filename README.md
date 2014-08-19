vkcli
=====

CLI vk chat on node.js

Allow you to char from console.

Screenshot:

![ScreenShot](https://raw.githubusercontent.com/Corey-Maler/vkcli/master/screenshot.png)

Installation: ```npm install -g vkcli```

Run: ```vkcli```

Config file: .vkclirs (in json)


Usage:
Send message to user:
```alias: message```

Alias -- user number or alias (displaed as ```{x}``` in list)

message: your message

Commands:

```:chats``` - display chats
```:alias from to``` - change user alias (saving in your .vkclirs)

# Большое обновление
Сейчас работаю над обновлением интерфейса.
Уже поддерживаем vi-style команды и упавление, например, ```:r! ps -ax | grep node``` вставит в окно ввода сообщения все найденные процессы node

Подсмотреть можно на скриншоте:
![Screen V0.2](https://raw.githubusercontent.com/Corey-Maler/vkcli/newUI/docs/screenv02.png)
