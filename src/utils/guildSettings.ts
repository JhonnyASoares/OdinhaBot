import fs from "fs";
import path from "path";

const settingsPath = path.join(
    __dirname,
    "../storage/guildSettings.json"
);

export type GuildSettings = {
    [guildId: string]: {
        channelId?: string;
        insults?: boolean;
    };
};

export function loadSettings(): GuildSettings {

    if (!fs.existsSync(settingsPath)) {
        fs.writeFileSync(settingsPath, "{}");
    }

    const raw = fs.readFileSync(
        settingsPath,
        "utf8"
    );

    if (!raw.trim()) {
        return {};
    }

    try {

        return JSON.parse(raw);

    } catch (error) {

        console.error(
            "Erro ao carregar settings:",
            error
        );

        return {};
    }
}

export function saveSettings(
    settings: GuildSettings
) {

    fs.writeFileSync(
        settingsPath,
        JSON.stringify(settings, null, 4)
    );
}

export function getGuildSettings(
    guildId: string
) {

    const settings = loadSettings();

    return settings[guildId] ?? {};
}