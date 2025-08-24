discord bot with a suggestion system for your users to vote on things!
make a suggestion using the command /suggest, and hook up voting and to do list channels to see successful votes

### current functionality:
- **/ping**: pings the api. mainly used for debug.
- **/suggest**: makes a poll in the voting channel. if passed, sends it to the to do list.
- **/setchannel**: sets those voting and to do list channels.
- **/setrole**: sets roles! currently there is a mod role for editing the config and a suggestion ban role.
- **/settime**: sets how much time votes have to run. only used for testing at the moment.
- **/register** and */update*: adds/updates your server in the config file. used for keeping track of the last 3 commands.
- **/viewconfig**: just outputs the current server's chunk of the json file. *can someone tell me how to make this look better*

**if for some reason you want to use this bot, make a config.json file before running!**
then paste this in:
```
{
    "servers": {

    }
}
```

## legal
made from the Discord.js TypeScript Bot Template - https://github.com/nullpointerexceptionkek/Discord.js-TypeScript-Bot-Template

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for details.
