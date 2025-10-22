import { SlashCommandBuilder, EmbedBuilder, Client, CommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

export const data = new SlashCommandBuilder()
  .setName("viewreactions")
  .setDescription("grabs all the reactions from the list");

export async function execute(
  client: Client,
  interaction: CommandInteraction
) {
  const serverId = interaction.guildId;
  if (!serverId) {
    await interaction.reply("server! child");
    return;
  }
  const reactPath = path.join(__dirname, "../../../config.json");
  const config = JSON.parse(fs.readFileSync(reactPath, "utf-8"));

  if (!config.servers[serverId]) {
    await interaction.reply({
      content: "use /register first",
      ephemeral: true
    });
    return;
  }

  var serverConfig = JSON.stringify(config.reactions[serverId], null, 4);
  serverConfig = serverConfig.replace(/[{\[\]}]/g, "");
  serverConfig = serverConfig.replace(/"|,/g, "");
  serverConfig = serverConfig.trimEnd();

  const embed = new EmbedBuilder()
        .setDescription(serverConfig)
        .setTimestamp();

  await interaction.reply({
    content: "all reactions:",
    embeds: [embed],
    ephemeral: true
  });
}
