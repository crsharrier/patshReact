export type PadFnDef = {
    name: string;
    hue: number;
    type: "toggleMode" | "holdMode" | "fn";
};

export const padFnDefs = {
    playPause: {
        name: "playPause",
        hue: 67.5,
        type: "fn",
    },
    stop: {
        name: "stop",
        hue: 157.5,
        type: "fn",
    },
    shift: {
        name: "shift",
        hue: 247.5,
        type: "holdMode",
    },
} as const satisfies Record<string, PadFnDef>;

export const padModeDefs = {
    notePlay: {
        name: "notePlay",
        hue: 0,
        type: "toggleMode",
    },
    noteEdit: {
        name: "noteEdit",
        hue: 22.5,
        type: "toggleMode",
    },
    fx: {
        name: "fx",
        hue: 90,
        type: "toggleMode",
    },
    perf: {
        name: "perf",
        hue: 112.5,
        type: "toggleMode",
    },
    trackSelect: {
        name: "trackSelect",
        hue: 45,
        type: "holdMode",
    },
    mute: {
        name: "mute",
        hue: 135,
        type: "holdMode",
    },
    solo: {
        name: "solo",
        hue: 180,
        type: "holdMode",
    },
} as const satisfies Record<string, PadFnDef>;

export type FnPadDef = {
    fn: PadFnDef;
    shiftFn: PadFnDef | null;
};

export const fnPadDefs = {
    1: {
        fn: padModeDefs["notePlay"],
        shiftFn: null,
    },
    2: {
        fn: padModeDefs["noteEdit"],
        shiftFn: null,
    },
    3: {
        fn: padModeDefs["trackSelect"],
        shiftFn: null,
    },
    4: {
        fn: padFnDefs["playPause"],
        shiftFn: null,
    },
    5: {
        fn: padModeDefs["fx"],
        shiftFn: null,
    },
    6: {
        fn: padModeDefs["perf"],
        shiftFn: null,
    },
    7: {
        fn: padModeDefs["mute"],
        shiftFn: padModeDefs["solo"],
    },
    8: {
        fn: padFnDefs["stop"],
        shiftFn: null,
    },
} as const satisfies Record<number, FnPadDef>;

export type PadMode = (typeof padModeDefs)[keyof typeof padModeDefs];
export const DEFAULT_PAD_MODE = padModeDefs["notePlay"];
