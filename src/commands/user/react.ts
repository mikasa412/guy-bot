import { SlashCommandBuilder, Client, GuildMember, ChatInputCommandInteraction, TextChannel } from "discord.js";
import * as fs from "fs";
import * as path from "path";

const reactPath = path.join(__dirname, "../../../config.json");

export const data = new SlashCommandBuilder()
  .setName("react")
  .setDescription("grabs a reaction from the list");
export async function execute(
  client: Client,
  interaction: ChatInputCommandInteraction
) {
  // Load config
  const config = JSON.parse(fs.readFileSync(reactPath, "utf-8"));
  const serverReactions = config.reactions;
  const member = interaction.member as GuildMember;

  //grab reaction
  const msgindex = Math.floor(Math.random() * serverReactions.length);
  const msgtosend = serverReactions[msgindex] as string;

  await interaction.reply(msgtosend.replace(/"/g, ''));
}