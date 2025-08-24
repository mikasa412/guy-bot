import { SlashCommandBuilder, Client, CommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");
const templatePath = path.join(__dirname, "../../../template.json");

export const data = new SlashCommandBuilder()
  .setName("register")
  .setDescription("registers server in config file");

export async function execute(
  client: Client,
  interaction: CommandInteraction
) {
  const serverId = interaction.guildId;
  if (!serverId) {
    await interaction.reply("get in a server?? why are you using this command in dms");
    return;
  }

  // Read config
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const template = JSON.parse(fs.readFileSync(templatePath, "utf-8")).ID;

  // Check if server already exists
  if (config.servers[serverId]) {
    await interaction.reply("it's already registered");
    return;
  }

  // Add server to config
  config.servers[serverId] = {};
  const serverConfig = config.servers[serverId];

  // Add template
  for (const key in template) {
    serverConfig[key] = template[key];
  }

  // Save config
  fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
  await interaction.reply("server registered!");
}
