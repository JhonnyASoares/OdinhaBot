import { Message } from "discord.js";
import { getOnly as getGuild } from "../models/guild";
import { getFicha } from "../models/user";
import { handleRolls } from "../services/dice.service";
import { insult } from "../services/insult.service";
import { getCellValue } from "../services/sheets.service";
import { randomNumber } from "../utils/utils";

export async function handleMessage(message: Message) {
  try {
    if (message.author.bot) return; //Ignora mensagem de outros bots

    if (!message.guildId) return; //Retorna caso seja DM
    const guildId = message.guildId;
    const guild = await getGuild(guildId);

    if (guild?.insults) {
      if (randomNumber(100) <= 5) {
        message.reply(insult());
      }
    }

    if (!guild?.rolls_channel || guild.rolls_channel === message.channelId) {
      var msg = message.content;
      if (message.content.startsWith(">")) {
        const ficha = await getFicha(message.author.id, guildId);

        msg = await getInitiative(ficha);
      }
      //Prefixo para ver se é uma rolagem de dados
      const dicePrefixRegex = /(\d*)[#]?(\d*)?[dD](?=\d*[1-9])\d+/i;
      //Caso seja rolagem tenta chamar o service de rollagens
      if (dicePrefixRegex.test(msg)) {
        console.log(msg);
        msg = handleRolls(msg);
      }
      await message.reply(msg);
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);

    await message.reply(
      `❌ Ocorreu um erro ao processar sua mensagem.\n\`\`\`${String(error)}\`\`\``,
    );
  }
}

async function getInitiative(ficha: string | null) {
  if (!ficha) {
    return "❌ ficha não registrada.";
  }

  return (
    "1d12 + " + (await getCellValue(ficha, "Character!AE24")) + " iniciativa"
  );
}
