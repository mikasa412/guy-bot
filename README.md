discord bot with a suggestion system for your users to vote on things!
make a suggestion using the command /suggest, and hook up voting and to do list channels to see successful votes

### current functionality:
- **/ping**: pings the api. mainly used for debug.
- **/suggest**: makes a poll in the voting channel. if passed, sends it to the to do list.
- **/setchannel**: sets those voting and to do list channels, as well as a log channel for command logging.
- **/setlogs**: sets command logging on or off. only works if the log channel is set.
- **/setrole**: sets roles! currently there is a mod role for editing the config and a suggestion ban role.
- **/settime**: sets how much time votes have to run. only used for testing at the moment.
- **/viewconfig**: just outputs the current server's chunk of the json file.

**if for some reason you want to use this bot, remove the ".template" from ["config.json.template"](config.json.template) before running! **

## legal
made from @nullpointerexceptionkek's [Discord.js TypeScript Bot Template](https://github.com/nullpointerexceptionkek/Discord.js-TypeScript-Bot-Template)

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.
