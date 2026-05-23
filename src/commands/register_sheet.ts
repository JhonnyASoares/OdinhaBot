import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { updateOrCreate as getUser } from "../models/user";

export const data = new SlashCommandBuilder()
  .setName("register_sheet")
  .setDescription("Registrar planilha do RPG.")
  .addStringOption((option) =>
    option.setName("url").setDescription("URL da planilha").setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const url = interaction.options.getString("url", true);
  const guildId = interaction.guildId;

  if (!guildId) {
    return interaction.reply({
      content: "Esse comando só funciona em servidores.",
      ephemeral: true,
    });
  }

  const spreadsheetId = extractSpreadsheetId(url);

  if (!spreadsheetId) {
    return interaction.reply({
      content: "Link inválido.",
      ephemeral: true,
    });
  }

  const userId = interaction.user.id;

  getUser({ id: userId, guildId, ficha: spreadsheetId });

  await interaction.reply({
    content: "Planilha registrada com sucesso!",
  });
}

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);

  return match ? match[1] : null;
}
