import {
  ChannelType,
  ChatInputCommandInteraction,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";

import { update as updateGuild } from "../models/guild";

export const data = new SlashCommandBuilder()
  .setName("server_settings")
  .setDescription("Definições do servidor")
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

  // /server_settings channel
  .addSubcommand((sub) =>
    sub
      .setName("dice_channel")
      .setDescription("Define o canal de dados")
      .addChannelOption((option) =>
        option
          .setName("chat")
          .setDescription("Canal onde o bot fará rolagens")
          .addChannelTypes(ChannelType.GuildText)
          .setRequired(true),
      ),
  )

  // /server_settings insult
  .addSubcommand((sub) =>
    sub
      .setName("insult")
      .setDescription("Liga ou desliga insultos")
      .addStringOption((option) =>
        option
          .setName("status")
          .setDescription("Ativar ou desativar")
          .setRequired(true)
          .addChoices(
            { name: "ON", value: "on" },
            { name: "OFF", value: "off" },
          ),
      ),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply({ ephemeral: true });
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return interaction.editReply({
      content: "❌ Você não é administrador.",
    });
  }

  if (!interaction.guildId) {
    return interaction.editReply({
      content: "Esse comando só funciona em servidores.",
    });
  }

  const subcommand = interaction.options.getSubcommand();

  // =========================
  // CHANNEL
  // =========================

  if (subcommand === "dice_channel") {
    try {
      const channel = interaction.options.getChannel("chat", true);

      await updateGuild({
        guildId: interaction.guildId,
        rolls_channel: channel.id,
      });

      return interaction.editReply({
        content: `✅ Canal de rolagens configurado para ${channel}`,
      });
    } catch (error) {
      console.error(error);
      return interaction.editReply({
        content: "❌ Erro ao atualizar canal de rolagens.",
      });
    }
  }

  // =========================
  // INSULT
  // =========================

  if (subcommand === "insult") {
    try {
      const status = interaction.options.getString("status", true);
      const insults = status === "on";

      await updateGuild({ guildId: interaction.guildId, insults });

      return interaction.editReply({
        content: `✅ Insultos foram ${insults ? "ativados" : "desativados"}.`,
      });
    } catch (error) {
      console.error(error);

      return interaction.editReply({
        content: "❌ Erro ao atualizar insultos.",
      });
    }
  }
}
