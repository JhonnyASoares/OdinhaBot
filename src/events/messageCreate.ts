import { Message } from "discord.js";
import { handleRolls } from "../services/dice.service";
import { insult } from "../services/insult.service";
import { getCellValue } from "../services/sheets.service";
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

    if (
      !settings.channelId ||
      (settings.channelId && message.channelId == settings.channelId)
    ) {
      var msg = message.content;
      if (message.content.startsWith(">")) {
        msg = await getInitiative(settings, message.author.id);
      }
      //Prefixo para ver se é uma rolagem de dados
      const dicePrefixRegex = /(\d*)[#]?(\d*)?[dD](?=\d*[1-9])\d+/i;
      //Caso seja rolagem tenta chamar o service de rollagens
      if (dicePrefixRegex.test(msg)) {
        await message.reply(handleRolls(msg));
      }
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);

    await message.reply(
      `❌ Ocorreu um erro ao processar sua mensagem.\n\`\`\`${String(error)}\`\`\``,
    );
  }
}

async function getInitiative(settings: any, userId: string) {
  const ficha = settings?.users?.[userId]?.ficha;

  if (!ficha) {
    return "❌ ficha não registrada.";
  }

  return "1d12 + " + (await getCellValue(ficha, "Character!AE24"));
}
