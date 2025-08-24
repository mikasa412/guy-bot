import { SlashCommandBuilder, Client, CommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

export const data = new SlashCommandBuilder()
  .setName("viewconfig")
  .setDescription("outputs current server config");

export async function execute(
  client: Client,
  interaction: CommandInteraction
) {
  const serverId = interaction.guildId;
  if (!serverId) {
    await interaction.reply("yep, viewing server config in dms makes sense");
    return;
  }
  const configPath = path.join(__dirname, "../../../config.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

  if (!config.servers[serverId]) {
    await interaction.reply({
      content: "use /register first",
      ephemeral: true
    });
    return;
  }

  await interaction.reply(`Current server config:\n\`\`\`json\n${JSON.stringify(config.servers[serverId], null, 4)}\n\`\`\``);
}
