import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { loadSettings, saveSettings } from "../utils/guildSettings";

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

  const settings = loadSettings();
  if (!settings[guildId]) {
    settings[guildId] = {};
  }

  const spreadsheetId = extractSpreadsheetId(url);

  if (!spreadsheetId) {
    return interaction.reply({
      content: "Link inválido.",
      ephemeral: true,
    });
  }

  const userId = interaction.user.id;

  if (!settings[guildId].users) {
    settings[guildId].users = {};
  }

  settings[guildId].users[userId] = {
    ficha: spreadsheetId,
  };

  saveSettings(settings);

  await interaction.reply({
    content: "Planilha registrada com sucesso!",
  });
}

function extractSpreadsheetId(url: string): string | null {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);

  return match ? match[1] : null;
}
