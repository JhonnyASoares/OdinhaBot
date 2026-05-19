import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Pegar o avatar do usuário.");

export async function execute(interaction: CommandInteraction) {
    const user = interaction.user; 
    const avatarURL = user.displayAvatarURL();
    const number = Math.floor(Math.random() * 1000000000) + 100000000;

    
  return interaction.reply({
    files: [{ attachment: avatarURL, name: number + '.png' }]
  });
}