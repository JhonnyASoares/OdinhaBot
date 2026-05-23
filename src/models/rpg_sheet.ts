import prisma from "../prisma";

import { RpgSheetAction } from "../generated/client";

type UpdateOrCreateProps = {
  name: string;
  guildId: string;
  cell: string;
  alias?: string;
  dice?: string;
  action?: RpgSheetAction;
};

export async function updateOrCreate({
  name,
  guildId,
  cell,
  dice,
  alias,
  action,
}: UpdateOrCreateProps) {
  try {
    return await prisma.rpgSheetSet.upsert({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },

      update: {
        cell,
        dice,
        alias,
        action,
      },

      create: {
        name,
        guildId,
        cell,
        dice,
        alias,
        action,
      },
    });
  } catch (error) {
    console.error(error);

    throw new Error("Erro ao salvar sheet set.");
  }
}

export async function getOnly(name: string, guildId: string) {
  try {
    return await prisma.rpgSheetSet.findUnique({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar sheet set.");
  }
}

export async function get(guildId: string) {
  try {
    return await prisma.rpgSheetSet.findMany({
      where: {
        guildId: guildId,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao buscar sheet set.");
  }
}

export async function remove(name: string, guildId: string) {
  try {
    return await prisma.rpgSheetSet.delete({
      where: {
        name_guildId: {
          name,
          guildId,
        },
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao deletar sheet set.");
  }
}
