import { SlashCommandBuilder, Client, CommandInteraction } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Replies with pong");

export async function execute(
  client: Client,
  interaction: CommandInteraction
) {
  await interaction.reply(`pong (${client.ws.ping}ms)`);
}
