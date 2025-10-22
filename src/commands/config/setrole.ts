import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("setrole")
  .setDescription("(mod) updates role types in config file (set mod role first)")
  .addStringOption(option =>
    option.setName("type")
      .setDescription("which role to set")
      .setRequired(true)
      .addChoices(
        { name: "mod", value: "modrole" },
        { name: "suggestion ban", value: "banrole" }
      )
  )
  .addRoleOption(option =>
    option.setName("role")
      .setDescription("The role to set")
      .setRequired(true)
  );
export async function execute(
  client: Client,
  interaction: ChatInputCommandInteraction
) {
  const serverId = interaction.guildId;
    if (!serverId) {
      await interaction.reply("??? get out of dms");
      return;
    }

    // Get options
    const roleType = interaction.options.getString("type", true);
    const role = interaction.options.getRole("role", true);

    // Read config
    const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));

    // Check if server was registered
    if (!config.servers[serverId]) {
      await interaction.reply({
        content: "/register the server first",
        ephemeral: true
      });
      return;
    }

    // Check if user has mod role
    if (config.servers[serverId].modrole != "modRoleID") {
      const member = interaction.member as GuildMember;
      if (!member.roles.cache.has(config.servers[serverId].modrole.replace(/[<@&>]/g, ""))) {
        await interaction.reply({
          content: "no mod role? <:smirk:1408967157106217051>",
          ephemeral: true
        });
        return;
      }
    } else if (!interaction.memberPermissions?.has("Administrator")) {
      await interaction.reply({
        content: "administrator required!!!!! get outta here",
        ephemeral: true
      });
      return;
    }

    // If role exists in server config, update it
    if (config.servers[serverId][roleType]) {
      config.servers[serverId][roleType] = `<@&${role.id}>`;
    } else {
      await interaction.reply({
        content: "role type not in config file, try /update",
        ephemeral: true
      });
      return;
    }

    // Save config
    fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
    await interaction.reply({
      content: `${roleType} updated to ${role}!`,
      ephemeral: true
    });
}
