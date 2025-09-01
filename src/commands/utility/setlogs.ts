import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("setlogs")
  .setDescription("(mod) turns logs on/off (channel must be set first)")
  .addStringOption(option =>
    option.setName("option")
      .setDescription("on/off")
      .setRequired(true)
      .addChoices(
        { name: "on", value: "1" },
        { name: "off", value: "0" },
      )
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

    const option = parseInt(interaction.options.getString("option")) ? true : false;
    
    // Update the channel type
    config.servers[serverId].logs = option;

    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    await interaction.reply({
      content: (option ? `logs turned on` : `logs turned off`),
      ephemeral: true
    });
}
