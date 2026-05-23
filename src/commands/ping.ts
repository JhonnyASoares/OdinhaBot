import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getOrCreate } from "../models/guild";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Responde com pong e testa o banco");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    if (!interaction.guildId) {
      return interaction.editReply("Esse comando só funciona em servidores.");
    }

    await getOrCreate(interaction.guildId, interaction.guild!.name);

    await interaction.editReply("Moshi Moshi!");
  } catch (error) {
    console.error(error);
    await interaction.editReply("Erro ao acessar o banco de dados.");
  }
}
