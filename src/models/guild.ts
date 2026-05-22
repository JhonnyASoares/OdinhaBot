import prisma from "../prisma";

type UpdateGuildProps = {
  guildId: string;
  insults?: boolean;
  rolls_channel?: string;
};

export async function getOrCreate(guildId: string) {
  try {
    return await prisma.guild.upsert({
      where: {
        id: guildId,
      },
      update: {},
      create: {
        id: guildId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao registrar servidor.");
  }
}

export async function update({
  guildId,
  insults,
  rolls_channel,
}: UpdateGuildProps) {
  try {
    return await prisma.guild.update({
      where: {
        id: guildId,
      },

      data: {
        insults,
        rolls_channel,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao atualizar servidor.");
  }
}

export async function getOnly(guildId: string) {
  try {
    return await prisma.guild.findUnique({
      where: {
        id: guildId,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao buscar servidor.");
  }
}

export async function getAll() {
  try {
    const guilds = await prisma.guild.findMany({
      select: {
        id: true,
      },
    });

    return guilds;
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao buscar servidores.");
  }
}

export async function getAllIds() {
  const guilds = await prisma.guild.findMany({
    select: {
      id: true,
    },
  });

  return guilds.map((guild) => guild.id);
}
