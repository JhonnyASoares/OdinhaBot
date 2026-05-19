import { Message } from "discord.js";
import { handleRolls } from "../services/dice.service";
import { insult } from "../services/insult.service";
import { getGuildSettings } from "../utils/guildSettings";
import { randomNumber } from "../utils/utils";

export async function handleMessage(message: Message) {
  try {
    if (message.author.bot) return; //Ignora mensagem de outros bots

    if (!message.guildId) return; //Retorna caso seja DM
    const settings = getGuildSettings(message.guildId!);

    if (settings.insults) {
      if (randomNumber(100) <= 5) {
        message.reply(insult());
      }
    }

    //Prefixo para ver se é uma rolagem de dados
    const prefixRegex = /(\d*)[#]?(\d*)?[dD](?=\d*[1-9])\d+/i;
    //Caso seja rolagem tenta chamar o service de rollagens
    if (prefixRegex.test(message.content)) {
      //Retorna caso esteja em outro canal
      if (settings.channelId && message.channelId !== settings.channelId) {
        return;
      }
      await message.reply(handleRolls(message.content));
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);

    await message.reply(
      `❌ Ocorreu um erro ao processar sua mensagem.\n\`\`\`${String(error)}\`\`\``,
    );
  }
}
