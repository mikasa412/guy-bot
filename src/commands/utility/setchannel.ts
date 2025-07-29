import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("setchannel")
  .setDescription("updates set channel in config file")
  .addStringOption(option =>
    option.setName("channel_type")
      .setDescription("Which channel to set")
      .setRequired(true)
      .addChoices(
        { name: "voting", value: "voting" },
        { name: "todo", value: "todo" }
      )
  )
  .addChannelOption(option =>
    option.setName("channel")
      .setDescription("The channel to set")
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
    const channelType = interaction.options.getString("channel_type", true);
    const channel = interaction.options.getChannel("channel", true);

    // Read config
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // Check if server was registered
    if (!config.servers[serverId]) {
      await interaction.reply("Register the server first using /register.");
      return;
    }

    // Check if modrole exists
    if (!config.servers[serverId].modrole) {
      await interaction.reply("Mod role not set. Use /setrole to set it first.");
      return;
    }
    const modRoleId = config.servers[serverId].modrole;

    // Check if user has mod role
    const member = interaction.member as GuildMember;
    if (!member || !member.roles.cache.has(modRoleId)) {
      await interaction.reply("You do not have permission to use this command.");
      return;
    }

    
    // Update the channel type
    config.servers[serverId][channelType] = channel.id;

    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    await interaction.reply(`Channel for ${channelType} updated to <#${channel.id}>.`);
}
