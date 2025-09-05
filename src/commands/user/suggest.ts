import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction } from "discord.js";
import { EmbedBuilder } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const configPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("suggest")
  .setDescription("suggest a feature for the server")
  .addStringOption(option =>
    option.setName("suggestion")
      .setDescription("the thing to add/improve")
      .setRequired(true)
  );
export async function execute(
  client: Client,
  interaction: ChatInputCommandInteraction
) {
  // Load config
  const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
  const serverConfig = config.servers[interaction.guild.id];
  const suggestion = interaction.options.getString("suggestion", true);
  const member = interaction.member as GuildMember;

  // edge cases
  if (!serverConfig) {
    interaction.reply({
      content: "/register the server first",
      ephemeral: true
    });
    return;
  } else if (!serverConfig.voting || !serverConfig.todo) {
    interaction.reply({
      content: "/setchannel the voting/todo channels",
      ephemeral: true
    });
    return;
  } else if (!config.servers[interaction.guildId].modrole) {
    interaction.reply({
      content: "/setrole the mod role first",
      ephemeral: true
    });
    return;
  } else if (member.roles.cache.has(serverConfig.banrole)) {
    interaction.reply({
      content: "suggestion ban? <:smirk:1408967157106217051>",
      ephemeral: true
    });
    return;
  }
  // Create embed
  const embed = new EmbedBuilder()
      .setDescription(suggestion + "\nvote ends in 24 hours")
      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

  // Send to voting channel
  const votingChannel = await interaction.guild.channels.fetch(serverConfig.voting);
  const todoChannel = await interaction.guild.channels.fetch(serverConfig.todo);
  const timer = serverConfig.timer * 1000;
  if (votingChannel && votingChannel.isTextBased()) {
    const sentMsg = await votingChannel.send({ embeds: [embed] });
    await sentMsg.react("✅");
    await sentMsg.react("❌");
    await interaction.reply({
      content: "suggestion sent to the voting channel!",
      ephemeral: true
    });
    setTimeout(async () => {
      if (todoChannel && todoChannel.isTextBased()) {
        // Fetch the message again to get updated reactions
        const pollMsg = await votingChannel.messages.fetch(sentMsg.id);
        const checkCount = pollMsg.reactions.cache.get("✅")?.count || 0;
        const xCount = pollMsg.reactions.cache.get("❌")?.count || 0;
        if (checkCount > xCount) {
            const todoEmbed = new EmbedBuilder()
              .setDescription(`Suggestion: ${suggestion}\nVotes: ✅ ${checkCount-1} ❌ ${xCount-1}`)
              .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
              .setTimestamp();
            await todoChannel.send({ embeds: [todoEmbed] });
        } else {
            await todoChannel.send(`Suggestion: ${suggestion} was rejected with ${checkCount-1} votes for and ${xCount-1} votes against.`);
        }
      }
    }, timer);
  } else await interaction.reply({
    content: "voting channel not found... maybe add it? <smirk:1408967157106217051>",
    ephemeral: true
  });
}
