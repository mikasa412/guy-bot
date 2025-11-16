import type { Client, GuildMember, Interaction } from "discord.js";
import { EmbedBuilder, TextChannel } from "discord.js";
import * as fs from "fs";
import * as path from "path";

// Execute slash commands
export default async function handleInteraction(
  client: Client,
  interaction: Interaction
) {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guild) return;
  if (!interaction.guildId) return;

  const configPath = path.join(__dirname, "../../../config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const logChannel = await client.channels.fetch(config.settings.logchannel.replace(/[<@#>]/g, ""));
  const logs = config.settings.logs;
    if (!logs) return;
    
  if (logChannel && logChannel.isTextBased() && logChannel instanceof TextChannel) {
    const embed = new EmbedBuilder()
      .setDescription(`<@${interaction.user.id}> used /${interaction.commandName} in <#${interaction.channel?.id}>`)
      .setTimestamp();
    await logChannel.send({ embeds: [embed] });
  }
}