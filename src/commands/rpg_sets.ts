import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { RpgSheetAction } from "../generated/client";
import { updateOrCreate } from "../models/rpg_sheet";

export const data = new SlashCommandBuilder()
  .setName("rpg_sets")
  .setDescription(
    "Define rolagens automaticas. Ex: define >iniciativa 1d20 Character!AE24 player: >iniciativa",
  )
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("Nome do comando, sera utilizado como >nome")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("dice")
      .setDescription("Dado que o bot irá rolar ex: 1d20, 2d10, 5#d20")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("cell")
      .setDescription(
        "Planilha!Celula ex: Character!AB11 (Obs: é possivel colocar range)",
      )
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("alias")
      .setDescription(
        "Define o nome que o bot falará junto a rolagem, ex: >in bot: iniciativa 1d20",
      ),
  )
  .addStringOption((option) =>
    option
      .setName("action")
      .setDescription("Se vai pegar ou atribuir valor da/na celula")
      .addChoices({ name: "GET", value: "get" }, { name: "SET", value: "set" }),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.deferReply();

  try {
    if (!interaction.guildId) {
      return interaction.editReply("Esse comando só funciona em servidores.");
    }

    const action = interaction.options.getString(
      "action",
    ) as RpgSheetAction | null;

    const alias = interaction.options.getString("alias") as string | null;

    await updateOrCreate({
      name: interaction.options.getString("name")!,
      guildId: interaction.guildId,
      cell: interaction.options.getString("cell")!,
      dice: interaction.options.getString("dice")!,
      alias: alias ?? undefined,
      action: action ?? undefined,
    });

    await interaction.editReply(
      `Criado comando >${interaction.options.getString("name")!}`,
    );
  } catch (error) {
    console.error(error);
    await interaction.editReply("Erro ao acessar o banco de dados.");
  }
}
