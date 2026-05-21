type PadModeDef = {
    colorHex: string;
};

export const padModeDefs = {
    notePlay: {
        colorHex: "#ff0000",
    },
    noteEdit: {
        colorHex: "#00ff00",
    },
    trackSelect: {
        colorHex: "#0000ff",
    },
    patternSelect: {
        colorHex: "#ffff00",
    },
    mute: {
        colorHex: "#ff00ff",
    },
    solo: {
        colorHex: "#00ffff",
    },
    fx: {
        colorHex: "#ff8800",
    },
    perf: {
        colorHex: "#888888",
    },
} as const satisfies Record<string, PadModeDef>;

export type PadMode = keyof typeof padModeDefs;
