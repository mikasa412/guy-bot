import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction, TextChannel } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const reactPath = path.join(__dirname, "../../../reactions.json");

export const data = new SlashCommandBuilder()
  .setName("react")
  .setDescription("grabs a reaction from the list");
export async function execute(
  client: Client,
  interaction: ChatInputCommandInteraction
) {
  // Load config
  const config = JSON.parse(fs.readFileSync(reactPath, "utf-8"));
  const serverReactions = config.servers[interaction.guildId];
  const member = interaction.member as GuildMember;

  // edge cases
  if (!serverReactions) {
    interaction.reply({
      content: "/register the server first",
      ephemeral: true
    });
    return;
  }

  //grab reaction
  
  if (serverReactions.length === 0) { return interaction.reply('no reactions yet?'); }

  const msgindex = Math.floor(Math.random() * serverReactions.length);
  const msgtosend = serverReactions[msgindex] as string;

  await interaction.reply(msgtosend.replace(/"/g, ''));
}