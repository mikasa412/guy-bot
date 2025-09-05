import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("setchannel")
  .setDescription("(mod) updates set channel in config file")
  .addStringOption(option =>
    option.setName("channel_type")
      .setDescription("Which channel to set")
      .setRequired(true)
      .addChoices(
        { name: "voting", value: "voting" },
        { name: "todo", value: "todo" },
        { name: "log", value: "logchannel" }
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
      await interaction.reply("get out of dms... what are you doing");
      return;
    }

    // Get options
    const channelType = interaction.options.getString("channel_type", true);
    const channel = interaction.options.getChannel("channel", true);

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

    // Check if modrole exists
    if (!config.servers[serverId].modrole) {
      await interaction.reply({
        content: "use /setrole to make a mod role first",
        ephemeral: true
      });
      return;
    }
    const modRoleId = config.servers[serverId].modrole;

    // Check if user has mod role
    const member = interaction.member as GuildMember;
    if (!member || !member.roles.cache.has(modRoleId)) {
      await interaction.reply({
        content: "no mod role? <smirk:1405976248697749665>",
        ephemeral: true
      });
      return;
    }

    
    // Update the channel type
    config.servers[serverId][channelType] = channel.id;

    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    await interaction.reply({
      content: `${channelType} channel changed to <#${channel.id}>!`,
      ephemeral: true
    });
}
