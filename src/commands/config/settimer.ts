import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("settimer")
  .setDescription("sets amount of time (seconds) that suggestions can be voted on")
  .addIntegerOption(option =>
    option.setName("time")
      .setDescription("time in seconds, default (0) is 24 hours")
      .setRequired(true)
  );
export async function execute(
  client: Client,
  interaction: ChatInputCommandInteraction
) {
  const serverId = interaction.guildId;
    if (!serverId) {
      await interaction.reply({
        content: "try a server first",
        ephemeral: true
      });
      return;
    }

    // Get options
    const timer = interaction.options.getInteger("time", true);

    // Read config
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // Check if server was registered
    if (!config.servers[serverId]) {
      await interaction.reply({
        content: "use /register first",
        ephemeral: true
      });
      return;
    }

    if (config.servers[serverId].modrole) {
      const member = interaction.member as GuildMember;
      if (!member.roles.cache.has(config.servers[serverId].modrole.replace(/[<@&>]/g, ""))) {
        await interaction.reply({
          content: "no mod role? <smirk:1405976248697749665>",
          ephemeral: true
        });
        return;
      }
    } else {
      await interaction.reply({
        content: "set a mod role first with /setrole",
        ephemeral: true
      });
      return;
    }

    // Update only the specified channel type
    if (timer < 0) {
      await interaction.reply({
        content: "what does negative time even mean",
        ephemeral: true
      });
      return;
    }
    if (timer === 0) {
      config.servers[serverId].timer = 86400;
    }
    config.servers[serverId].timer = timer;

    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    if (timer === 0) {
      await interaction.reply({
        content: "voting time defaulted to 24 hours",
        ephemeral: true
      });
    } else {
      await interaction.reply({
        content: `voting time updated to ${timer} seconds`,
        ephemeral: true
      });
    }
}
