import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    ChannelType,
    PermissionFlagsBits
} from "discord.js";

import {
    loadSettings,
    saveSettings
} from "../utils/guildSettings";

export const data = new SlashCommandBuilder()
    .setName("server_settings")
    .setDescription("Definições do servidor")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

    // /server_settings channel
    .addSubcommand(sub =>
        sub
            .setName("dice_channel")
            .setDescription("Define o canal de dados")
            .addChannelOption(option =>
                option
                    .setName("chat")
                    .setDescription("Canal onde o bot fará rolagens")
                    .addChannelTypes(ChannelType.GuildText)
                    .setRequired(true)
            )
    )

    // /server_settings insult
    .addSubcommand(sub =>
        sub
            .setName("insult")
            .setDescription("Liga ou desliga insultos")
            .addStringOption(option =>
                option
                    .setName("status")
                    .setDescription("Ativar ou desativar")
                    .setRequired(true)
                    .addChoices(
                        { name: "ON", value: "on" },
                        { name: "OFF", value: "off" }
                    )
            )
    );

export async function execute(
    interaction: ChatInputCommandInteraction
) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
        return interaction.reply({
            content: "❌ Você não é administrador.",
            ephemeral: true
        });
    }

    if (!interaction.guildId) {
        return interaction.reply({
            content: "Esse comando só funciona em servidores.",
            ephemeral: true
        });
    }

    const settings = loadSettings();

    if (!settings[interaction.guildId]) {
        settings[interaction.guildId] = {};
    }

    const subcommand = interaction.options.getSubcommand();

    // =========================
    // CHANNEL
    // =========================

    if (subcommand === "dice_channel") {

        const channel =
            interaction.options.getChannel("chat", true);

        settings[interaction.guildId].channelId = channel.id;

        saveSettings(settings);

        return interaction.reply({
            content:
                `✅ Canal de rolagens configurado para ${channel}`,
            ephemeral: true
        });
    }

    // =========================
    // INSULT
    // =========================

    if (subcommand === "insult") {

        const status =
            interaction.options.getString("status", true);

        settings[interaction.guildId].insults =
            status === "on";

        saveSettings(settings);

        return interaction.reply({
            content:
                `✅ Insultos foram ${status === "on"
                    ? "ativados"
                    : "desativados"
                }.`,
            ephemeral: true
        });
    }
}