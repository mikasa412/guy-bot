discord bot for my server!
has suggestions, reactbot, and more planned!

### current functionality:
- **/ping**: pings the api. mainly used for debug.
- **/suggest**: makes a poll in the voting channel. if passed, sends it to the to do list.
- **/react**: grabs a random reaction from your server's list.
- **/setchannel**, **/setlogs**, **/setrole**, **/settimer**: sets things in the config, the tips in discord tell you more about each.
- **/register** and **/update**: adds/updates your server in the config file.
- **/viewconfig** and **/viewreactions**: just outputs the current server's chunk of the json file. (split in half, servers to viewconfig and reactions to viewreactions)

**if for some reason you want to use this bot, make a config.json file before running!**
then paste this into it:
```
{
    "servers": {},
    "reactions": []
}
```
there are a few custom emojis you need to change if you want to use this for yourself (this is just for my server, I'm fine if you use my code but the github is only up for archival)

## legal
made from @nullpointerexceptionkek's [Discord.js TypeScript Bot Template](https://github.com/nullpointerexceptionkek/Discord.js-TypeScript-Bot-Template)

This project is licensed under the MIT License - see [LICENSE.md](LICENSE.md) for details.
