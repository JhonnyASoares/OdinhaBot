import prisma from "../prisma";

type UpdateOrCreateUserProps = {
  id: string;
  guildId: string;
  ficha?: string;
};

export async function updateOrCreate({
  id,
  guildId,
  ficha,
}: UpdateOrCreateUserProps) {
  try {
    return await prisma.user.upsert({
      where: {
        id_guildId: {
          id,
          guildId,
        },
      },

      update: {
        ficha,
      },

      create: {
        id,
        guildId,
        ficha,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao salvar usuário.");
  }
}

export async function getFicha(id: string, guildId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id_guildId: {
          id,
          guildId,
        },
      },

      select: {
        ficha: true,
      },
    });

    return user?.ficha ?? null;
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao buscar ficha.");
  }
}
