import { SlashCommandBuilder, Client, CommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");
const templatePath = path.join(__dirname, "../../../template.json");

export const data = new SlashCommandBuilder()
  .setName("update")
  .setDescription("updates server config in config file (use when bot gets updated)");

export async function execute(
  client: Client,
  interaction: CommandInteraction
) {
  const serverId = interaction.guildId;
  if (!serverId) {
    await interaction.reply("why are you using this in dms... get in a server");
    return;
  }

  // Read config
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const template = JSON.parse(fs.readFileSync(templatePath, "utf-8")).ID;

  // Check if server already exists
  if (config.servers[serverId]) {
    const serverConfig = config.servers[serverId];
    let updated = false;

    // Add missing keys from template
    for (const key in template) {
      if (!(key in serverConfig)) {
        serverConfig[key] = template[key];
        updated = true;
      }
    }

    // Remove outdated keys not in template
    for (const key in serverConfig) {
      if (!(key in template)) {
        delete serverConfig[key];
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
      await interaction.reply({
        content: "updated to template!",
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content:"already matching template... you could ask for new features if you want",
        ephemeral: true
      });
    }
    return;
  } else {
    await interaction.reply({
      content: "/register the server first",
      ephemeral: true
    });
    return;
  };
}