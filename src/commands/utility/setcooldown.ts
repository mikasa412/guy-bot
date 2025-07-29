import { SlashCommandBuilder, Client, CommandInteraction, ChatInputCommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("setcooldown")
  .setDescription("updates suggestion cooldown")
  .addIntegerOption(option =>
    option.setName("cooldown")
      .setDescription("Cooldown in seconds, default (0) is 24 hours")
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
    const cooldown = interaction.options.getInteger("cooldown", true);

    // Read config
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // Check if server was registered
    if (!config.servers[serverId]) {
      await interaction.reply("Register the server first using /register.");
      return;
    }

    // Update only the specified channel type
    if (isNaN(cooldown) || cooldown < 0) {
      await interaction.reply("Please provide a valid cooldown in seconds.");
      return;
    }
    if (cooldown === 0) {
      config.servers[serverId].cooldown = 86400;
    }
    config.servers[serverId].cooldown = `${cooldown}000`;

    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    await interaction.reply(`Suggestion cooldown updated to ${cooldown} seconds.`);
}
