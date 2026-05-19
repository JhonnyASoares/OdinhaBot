import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Omg olha o bot funfando.");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply("hihihaha!");
}