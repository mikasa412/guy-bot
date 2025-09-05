import type { Client, GuildMember, Interaction } from "discord.js";
import { TextChannel } from "discord.js";
import * as fs from "fs";
import * as path from "path";

// Execute slash commands
export default async function sendLog(
  client: Client,
  interaction: Interaction,
  format: string,
  argument?: string,
  property?: any
) {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guild) return;
  if (!interaction.guildId) return;

  const configPath = path.join(__dirname, "../../../config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const serverConfig = config.servers[interaction.guild.id];
  const logChannel = await client.channels.fetch(serverConfig.logchannel);
  const logs = serverConfig.logs;
    if (!logs) return;

  if (logChannel && logChannel.isTextBased() && logChannel instanceof TextChannel) {
    var message = ""
    switch (format){
        case ("none"): message = `<@${interaction.user.id}> used /${interaction.commandName} in ${interaction.channel}`;
        case ("simple"): message = `<@${interaction.user.id}> used /${interaction.commandName}\n(with value: ${property})\nin ${interaction.channel}`;
        case ("channel"): message = `<@${interaction.user.id}> used /${interaction.commandName}:\n(set ${argument} to <#${property}>)\nin ${interaction.channel}`;
        case ("role"): message = `<@${interaction.user.id}> used /${interaction.commandName}\n(set ${argument} to <@${property}>) in ${interaction.channel}`;
    }
    await logChannel.send({
        content: message,
        flags: [4096] // silences ping
    });
  }
}
/*
formats: 
> none
	- /ping, /register, /update, /viewconfig
	- argument: N/A
	- property: N/A
> simple
	- /setlogs, /settimer, /suggest
	- argument: N/A
	- property: any (boolean for setlogs, int for settimer, str for suggest)
> channel
	- /setchannel
	- argument: channeltype (ex: voting)
	- property: ID of channel
> role
	- /setrole
	- argument: roletype (ex: banrole)
	- property: ID of role
*/