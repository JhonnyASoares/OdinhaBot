import { Client, Message } from "discord.js";
import { commands } from "./commands";
import { config } from "./config";
import { deployCommands } from "./deploy";
import { handleMessage } from "./events/messageCreate";
import { getOrCreate } from "./models/guild";
import prisma from "./prisma";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", async () => {
  await prisma.$connect();
  //Atualizando os comandos em todos os servidores
  for (const guild of client.guilds.cache.values()) {
    await deployCommands({
      guildId: guild.id,
    });
  }
  console.log("Ta robotizado! 🤖");
});

client.on("guildCreate", async (guild) => {
  await getOrCreate(guild.id, guild.name);
  await deployCommands({ guildId: guild.id });
});

client.on("messageCreate", async (message: Message) => {
  await handleMessage(message);
});

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

import { TextChannel } from "discord.js";

const channel = client.channels.cache.get(
    "ID_DO_CANAL"
);

if (channel instanceof TextChannel) {

    await channel.send("Olá!");
}
*/
