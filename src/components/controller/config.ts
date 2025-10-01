export type NotePadDef = {
    id: string;
    label: string;
    key: string;
};

const NOTE_PAD_PREFIX = "pad";

export const notePadDefs: NotePadDef[] = [
    { id: `${NOTE_PAD_PREFIX}1`, label: "1", key: "1" },
    { id: `${NOTE_PAD_PREFIX}2`, label: "2", key: "2" },
    { id: `${NOTE_PAD_PREFIX}3`, label: "3", key: "3" },
    { id: `${NOTE_PAD_PREFIX}4`, label: "4", key: "4" },
    { id: `${NOTE_PAD_PREFIX}5`, label: "5", key: "q" },
    { id: `${NOTE_PAD_PREFIX}6`, label: "6", key: "w" },
    { id: `${NOTE_PAD_PREFIX}7`, label: "7", key: "e" },
    { id: `${NOTE_PAD_PREFIX}8`, label: "8", key: "r" },
    { id: `${NOTE_PAD_PREFIX}9`, label: "9", key: "a" },
    { id: `${NOTE_PAD_PREFIX}10`, label: "10", key: "s" },
    { id: `${NOTE_PAD_PREFIX}11`, label: "11", key: "d" },
    { id: `${NOTE_PAD_PREFIX}12`, label: "12", key: "f" },
    { id: `${NOTE_PAD_PREFIX}13`, label: "13", key: "z" },
    { id: `${NOTE_PAD_PREFIX}14`, label: "14", key: "x" },
    { id: `${NOTE_PAD_PREFIX}15`, label: "15", key: "c" },
    { id: `${NOTE_PAD_PREFIX}16`, label: "16", key: "v" },
];
