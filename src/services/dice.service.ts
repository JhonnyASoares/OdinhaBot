import { evaluate } from "mathjs";
import { randomNumber } from "../utils/utils";

export function handleRolls(msgContent: string) {
  try {
    let msg = msgContent;

    msg = msg.replace(/([\+\-\*\/\(\)])\s+([0-9])/g, "$1$2"); //Remove espaços entre operadores matemáticos e números a direita.
    let vezes = msg.match(/(\d*)?[#]/i); //Procura se existe um # na mensagem e, opcionalmente, um número antes dele.

    let times = 1;

    if (vezes) {
      times = vezes[1] ? parseInt(vezes[1], 10) : 1;
      msg = msg.replace(/(\d*)?[#]/i, ""); //Remove da mensagem a parte usada para definir quantas vezes o dado será rolado.
    }

    if (times > 100) {
      return "❌ Parcela essas rolagens ai meu mano.";
    }

    const rollAndMessage =
      msg.match(/(?:\s+([a-zA-Z]+(?:\s+[a-zA-Z]+)*))?$/) ?? [];

    let aditionalMessage = rollAndMessage[1] ? rollAndMessage[1].trim() : "";

    msg = msg.replace(aditionalMessage, "");

    msg = msg.replace(/\b(?<!\d)d/g, "1d");
    msg = msg.replace(/\s/g, ""); //Remove todos os espaços
    msg = msg.replace(/D/g, "d");
    const matches = msg.match(/\b[0-9]+d[0-9]+\b/g) ?? [];

    let finalMessage = aditionalMessage ? `**${aditionalMessage}**\n` : "";

    for (let t = 0; t < times; t++) {
      finalMessage += responseDice(msg, matches);
    }

    return finalMessage;
  } catch (error) {
    return `❌ Ocorreu um erro ao processar sua rolagem.\n\`\`\`${String(error)}\`\`\``;
  }
}

function responseDice(message: string, matches: string[]) {
  try {
    let resultFinal = message;

    message = message.replace(/\s*([\+\-\*\/])\s*/g, " $1 "); //Deixando operadores matematicos com 1 espaço antes e 1 depois ex: " * "

    for (const match of matches) {
      const [rolls, dice] = match.split("d");

      const rollsReps = parseInt(rolls, 10);
      const diceMaxValue = parseInt(dice, 10);
      if (rollsReps > 200) {
        throw new Error(
          "Quer rolar os dados da sessão inteira de uma vez? vá com calma calabreso.",
        );
      }
      if (diceMaxValue > 1000) {
        throw new Error(
          "Um dado com mais de mil faces? sou pago pra isso não!",
        );
      }

      let replace = "[";

      for (let r = 0; r < rollsReps; r++) {
        const result = randomNumber(diceMaxValue);
        const v = r + 1 < rollsReps ? ", " : "";
        replace += result + v;
      }

      replace += "]";
      replace = sortDiceResults(replace);

      resultFinal = resultFinal.replace(match, replace);
      replace = replace.replace(diceMaxValue.toString(), `**${diceMaxValue}**`); //Deixa o valor maximo do dado em negrito ex: dado = 1d20, diceMaxValue = 20, o resultado 20 se torna **20**, e fica em negrito no discord
      message = message.replace(
        new RegExp(`(?<!\\] )${match}`),
        replace + ` ${match}`,
      );
    }

    resultFinal = resultFinal.replace(/\[|\]/g, "");
    resultFinal = resultFinal.replace(/, /g, "+");
    resultFinal = resultFinal.replace(/,/g, ".");

    const total = parseFloat(evaluate(resultFinal).toFixed(2)); // toFixed fixa casas decimais, parsefloat remove .00

    return "` " + total + " ` ⟵ " + message + "\n";
  } catch (error) {
    if (error instanceof Error) {
      return `❌ ${error.message}\n`;
    }

    return `❌ Erro ao processar expressão: \`${message}\`\n`;
  }
}

function sortDiceResults(text: string) {
  const values = text
    .replace(/\[|\]/g, "")
    .split(",")
    .map((v) => Number(v.trim()));

  values.sort((a, b) => b - a);

  return `[${values.join(", ")}]`;
}
