import { Message } from "discord.js";
import { getOnly as getGuild } from "../models/guild";
import { getOnly as getCommand } from "../models/rpg_sheet";
import { getFicha } from "../models/user";
import { handleRolls } from "../services/dice.service";
import { insult } from "../services/insult.service";
import { getCellValue } from "../services/sheets.service";
import { randomNumber } from "../utils/utils";

export async function handleMessage(message: Message) {
  try {
    if (message.author.bot) return; //Ignora mensagem de outros bots

    if (!message.guildId) return; //Retorna caso seja DM
    const guild = await getGuild(message.guildId);

    if (guild?.insults) {
      if (randomNumber(100) <= 5) {
        message.reply(insult());
      }
    }

    if (!guild?.rolls_channel || guild.rolls_channel === message.channelId) {
      var msg = message.content;
      //Prefixo para ver se é uma rolagem de dados
      const dicePrefixRegex = /(\d*)[#]?(\d*)?[dD](?=\d*[1-9])\d+/i;
      const diceTest = dicePrefixRegex.test(msg);

      if (message.content.startsWith(">")) {
        rpgSets(message);
      }

      //Caso seja rolagem tenta chamar o service de rollagens
      if (diceTest) {
        console.log(msg);
        msg = handleRolls(msg);
        await message.reply(msg);
      }
    }
  } catch (error) {
    console.error("Erro ao processar mensagem:", error);

    await message.reply(
      `❌ Ocorreu um erro ao processar sua mensagem.\n\`\`\`${String(error)}\`\`\``,
    );
  }
}

async function rpgSets(message: Message) {
  try {
    const ficha = await getFicha(message.author.id, message.guildId!);
    if (!ficha) {
      return await message.reply("❌ Ficha não registrada");
    }
    const msgCont = message.content;
    const command = msgCont.match(/^>(\S+)/)?.[1];
    //const [, command, args] = msgCont.match(/^>(\S+)\s*(.*)?$/) ?? [];
    if (command) {
      const cmd = await getCommand(command, message.guildId!);
      if (cmd) {
        const cell = await getCellValue(ficha, cmd.cell);
        const msg = `${cmd.dice} + ${cell} ${cmd.alias ?? ""}`;
        return await message.reply(handleRolls(msg));
      }
      return await message.reply("❌ Comando não registrado");
    } else {
      //await getAllCommands(message.guildId!);
    }
  } catch (error) {
    return `❌ Ocorreu um erro nos commands sets.\n\`\`\`${String(error)}\`\`\``;
  }
}
