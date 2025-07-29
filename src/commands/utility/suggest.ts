import { SlashCommandBuilder, Client, ChatInputCommandInteraction } from "discord.js";
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
  if (!serverConfig) {
    interaction.reply("This server is not registered. Use /register first.");
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
  const cooldown = serverConfig.cooldown;
  if (votingChannel && votingChannel.isTextBased()) {
      const sentMsg = await votingChannel.send({ embeds: [embed] });
      await sentMsg.react("✅");
      await sentMsg.react("❌");
      await interaction.reply("suggestion sent to the voting channel!");
      setTimeout(async () => {
          if (todoChannel && todoChannel.isTextBased()) {
              // Fetch the message again to get updated reactions
              const pollMsg = await votingChannel.messages.fetch(sentMsg.id);
              const checkCount = pollMsg.reactions.cache.get("✅")?.count || 0;
              const xCount = pollMsg.reactions.cache.get("❌")?.count || 0;
              if (checkCount > xCount) {
                  const todoEmbed = new EmbedBuilder()
                      .setDescription(`Suggestion: ${suggestion}`)
                      .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
                      .setTimestamp();
                  await todoChannel.send({ embeds: [todoEmbed] });
              }
          }
      }, cooldown);
  } else await interaction.reply("voting channel not found or is not a text channel.");
}
