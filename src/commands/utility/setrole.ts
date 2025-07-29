import { SlashCommandBuilder, Client, CommandInteraction, ChatInputCommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("setrole")
  .setDescription("updates mod role in config file")
  .addStringOption(option =>
    option.setName("role_type")
      .setDescription("Which role to set (only mod role currently)")
      .setRequired(true)
      .addChoices(
        { name: "mod role", value: "modrole" }
      )
  )
  .addStringOption(option =>
    option.setName("role")
      .setDescription("The role to set (ID)")
      .setRequired(true)
  );
export async function execute(
  client: Client,
  interaction: ChatInputCommandInteraction
) {
  const serverId = interaction.guildId;
    if (!serverId) {
      await interaction.reply("This command must be used in a server.");
      return;
    }

    // Get options
    const roleType = interaction.options.getString("role_type", true);
    const role = interaction.options.getString("role", true);

    // Read config
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // Check if server was registered
    if (!config.servers[serverId]) {
      await interaction.reply("Register the server first using /register.");
      return;
    }

    // Update only the specified channel type
    config.servers[serverId][roleType] = role;

    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    await interaction.reply(`Role for ${roleType} updated to <@&${role}>.`);
}
