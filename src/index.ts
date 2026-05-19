
import { Client, Message } from "discord.js";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";
import { config } from "./config";
import { evaluate } from 'mathjs';
import { getGuildSettings } from "./utils/guildSettings";

const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", async () => {
    //Atualizando os comandos em todos os servidores
    for (const guild of client.guilds.cache.values()) {
        await deployCommands({
            guildId: guild.id
        });
    }
    console.log("Ta robotizado! 🤖");
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on('messageCreate', async (message: Message) => {
    try {
        if (message.author.bot) return; //Ignora mensagem de outros bots

        const settings = getGuildSettings(
            message.guildId!
        );
        console.log("==============================")
        if (settings.insults) {
            if ((Math.floor(Math.random() * 20) + 1) === 1) {
                insult(message);
            }
        }

        if (settings.channelId && message.channelId !== settings.channelId) {
            return;
        }


        const prefixRegex = /(\d*)[#]?(\d*)?[dD](?=\d*[1-9])\d+/i; //Prefico para ver se é uma rolagem de dados

        if (!prefixRegex.test(message.content)) return; //Caso não seja rolagem retorna

        let msg = message.content;

        msg = msg.replace(/([\+\-\*\/\(\)])\s+([0-9])/g, '$1$2');//Remove espaços entre operadores matemáticos e números a direita.

        let vezes = msg.match(/(\d*)?[#]/i); //Procura se existe um # na mensagem e, opcionalmente, um número antes dele.

        let times = 1;

        if (vezes) {
            times = vezes[1] ? parseInt(vezes[1], 10) : 1;
            msg = msg.replace(/(\d*)?[#]/i, ''); //Remove da mensagem a parte usada para definir quantas vezes o dado será rolado.
        }

        const rollAndMessage =
            msg.match(/(?:\s+((?:\d+\s*)?[^0-9dD\+\-\*\/\(\)].*))?$/) ?? [];

        let aditionalMessage =
            rollAndMessage[1] ? rollAndMessage[1].trim() : '';

        msg = msg.replace(aditionalMessage, '');

        msg = msg.replace(/\b(?<!\d)d/g, '1d');
        msg = msg.replace(/\s/g, ''); //Remove todos os espaços
        console.log(msg)

        const matches = msg.match(/\b[0-9]+d[0-9]+\b/g) ?? [];

        let finalMessage = aditionalMessage
            ? `**${aditionalMessage}**\n`
            : '';

        for (let t = 0; t < times; t++) {
            finalMessage += responseDice(msg, matches);
        }

        await message.reply(finalMessage);

    } catch (error) {
        console.error('Erro ao processar mensagem:', error);

        await message.reply(
            `❌ Ocorreu um erro ao processar sua rolagem.\n\`\`\`${String(error)}\`\`\``
        );
    }
});

function responseDice(message: string, matches: string[]) {
    try {
        console.log("initial msg", message)
        let resultFinal = message;
        
        message = message.replace(/\s*([\+\-\*\/])\s*/g, ' $1 '); //Deixando operadores matematicos com 1 espaço antes e 1 depois ex: " * "
        
        for (const match of matches) {
            
            const [rolls, dice] = match.split('d');
            
            const rollsReps = parseInt(rolls, 10);
            const diceMaxValue = parseInt(dice, 10);
            if (rollsReps > 200) {
                throw new Error('Quer rolar os dados da sessão inteira de uma vez? vá com calma calabreso.');
            }
            if (diceMaxValue > 1000) {
                throw new Error('Um dado com mais de mil faces? sou pago pra isso não!');
            }
            
            let replace = '[';
            
            for (let r = 0; r < rollsReps; r++) {
                const result = randomNumber(diceMaxValue);
                const v = (r + 1 < rollsReps) ? ', ' : '';
                replace += result + v;
            }
            
            replace += ']';
            resultFinal = resultFinal.replace(match, replace);
            replace = replace.replace(
                diceMaxValue.toString(),
                `**${diceMaxValue}**`
            );
            console.log("msg", message)
            message = message.replace(new RegExp(`(?<!\\] )${match}`), replace + ` ${match}`);
        }
        
        resultFinal = resultFinal.replace(/\[|\]/g, '');
        resultFinal = resultFinal.replace(/, /g, '+');
        resultFinal = resultFinal.replace(/,/g, '.');

        const total = evaluate(resultFinal);
        return '` ' + total + ' ` ⟵ ' + message + '\n';

    } catch (error) {

        if (error instanceof Error) {
            return `❌ ${error.message}\n`;
        }

        return `❌ Erro ao processar expressão: \`${message}\`\n`;
    }
}

function randomNumber(max: number) {
    return Math.floor(Math.random() * max) + 1
}

function insult(message: Message) {
            const xingamentos = [
            "Cala boca, seu preto de merda!",
            "Vai se ferrar, seu desgraçado!",
            "Você é uma piada ambulante!",
            "Nem sua mãe te aguenta, otário!",
            "Para de falar merda, imbecil!",
            "Tua existência já é um erro!",
            "Não é pq tu é obesa que o mundo gira em torno de você!",
            "Ninguém te chamou, palhaço!",
            "Sai daqui, seu abacaxi estragado!",
            "Cala essa boca cheia de bosta!",
            "Se eu quisesse ouvir merda, ia no esgoto!",
            "Se fosse pra ouvir besteira, eu falava com um pombo!",
            "Fala menos e pensa mais, anta!",
            "Falaria o mesmo se tivesse pai ausente!",
            "Nem o Google te aguenta mais!",
            "Se burrice fosse crime, tu pegava perpétua!",
            "Alguém te perguntou alguma coisa, idiota?",
            "Volta pro buraco de onde saiu, infeliz!",
            "Fala menos e some mais!",
            "Parabéns, conseguiu ser a vergonha da humanidade!",
            "Disse ele após beber água do ar-condicionado!",
            "E é assim que se farma aura de neandertal!",
            "Se eu quisesse ficar escutando mimimi eu comprava um gato gago"
        ];
        const insultRandom = xingamentos[Math.floor(Math.random() * xingamentos.length)];
        message.reply(insultRandom);
}

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.login(config.DISCORD_TOKEN);


/*
client.on('messageCreate', (message) => {

    if (message.author.bot) return;

    console.log("Usuário:",
        message.author.username
    );

    console.log("ID:",
        message.author.id
    );

    console.log("Servidor:",
        message.guild?.name
    );

    console.log("Canal:",
        message.channelId
    );

    console.log("Mensagem:",
        message.content
    );
});

*/