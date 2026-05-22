import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getOrCreate } from "../models/guild";

export const data = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Responde com pong e testa o banco");

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    await interaction.deferReply();

    if (!interaction.guildId) {
      return interaction.reply({
        content: "Esse comando só funciona em servidores.",

        ephemeral: true,
      });
    }

    await getOrCreate(interaction.guildId);

    await interaction.reply("Moshi Moshi!");
  } catch (error) {
    console.error(error);
    await interaction.editReply("Erro ao acessar o banco de dados.");
  }
}
