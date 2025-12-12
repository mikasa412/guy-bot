import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction, Colors } from "discord.js";
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
  const suggestion = interaction.options.getString("suggestion", true);
  const member = interaction.member as GuildMember;

  // edge cases
  if (!config.settings.voting || !config.settings.todo) {
    interaction.reply({
      content: "/setchannel the voting/todo channels",
      ephemeral: true
    });
    return;
  } else if (!config.settings.modrole) {
    interaction.reply({
      content: "/setrole the mod role first",
      ephemeral: true
    });
    return;
  } else if (member.roles.cache.has(config.settings.banrole)) {
    interaction.reply({
      content: "suggestion ban? <:smirk:1408967157106217051>",
      ephemeral: true
    });
    return;
  } else if (config.settings.lockpolls) {
    interaction.reply({
      content: "polls are locked... ask a mod to unlock them",
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
  const votingChannel = await interaction.guild.channels.fetch(config.settings.voting.replace(/[<@#>]/g, ""));
  const todoChannel = await interaction.guild.channels.fetch(config.settings.todo.replace(/[<@#>]/g, ""));
  const timer = config.settings.timer * 1000;
  if (votingChannel && votingChannel.isTextBased()) {
    const sentMsg = await votingChannel.send({ embeds: [embed] });
    await sentMsg.react("<:yes:1430633436355498014>");
    await sentMsg.react("<:cabbit:1430633387642716181>");
    await sentMsg.react("<:no:1430633462989193287>");
    await interaction.reply({
      content: "suggestion sent to the voting channel!",
      ephemeral: true
    });
    setTimeout(async () => {
      if (todoChannel && todoChannel.isTextBased()) {
        // Fetch the message again to get updated reactions
        const pollMsg = await votingChannel.messages.fetch(sentMsg.id);
        const checkCount = pollMsg.reactions.cache.get("1430633436355498014")?.count || 0;
        const cabbitCount = pollMsg.reactions.cache.get("1430633387642716181")?.count || 0;
        const xCount = pollMsg.reactions.cache.get("1430633462989193287")?.count || 0;
        const cabbitWins = cabbitCount > checkCount && cabbitCount > xCount;
        const yesWins = checkCount > cabbitCount && checkCount > xCount;
        const noWins = xCount > cabbitCount && xCount > checkCount;
        const color = cabbitWins ? Colors.Fuchsia : yesWins ? Colors.Green : noWins ? Colors.Red : Colors.Yellow;
        const cabbitMessage = cabbitWins ? `\nCabbit has spoken! This suggestion ${Math.random() > 0.5 ? "will" : "will NOT"} be added!!` : "";
        const todoEmbed = new EmbedBuilder()
          .setDescription(`Suggestion: ${suggestion}\nVotes: <:yes:1430633436355498014> ${checkCount-1} <:cabbit:1430633387642716181> ${cabbitCount-1} <:no:1430633462989193287> ${xCount-1} ${cabbitMessage}`)
          .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
          .setTimestamp()
          .setColor(color);
        await todoChannel.send({ embeds: [todoEmbed] });
      }
    }, timer);
  } else await interaction.reply({
    content: "voting channel not found... maybe add it? <smirk:1408967157106217051>",
    ephemeral: true
  });
}
