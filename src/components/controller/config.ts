export type NotePadDef = {
    stepNumber: number;
    midiNote: number;
    label1: string;
    label2?: string;
    key: string;
};

export const notePadDefs: NotePadDef[] = [
    {
        stepNumber: 1,
        midiNote: 75,
        label1: "1",
        label2: "",
        key: "1",
    },
    {
        stepNumber: 2,
        midiNote: 74,
        label1: "2",
        label2: "",
        key: "2",
    },
    {
        stepNumber: 3,
        midiNote: 73,
        label1: "3",
        label2: "",
        key: "3",
    },
    {
        stepNumber: 4,
        midiNote: 72,
        label1: "4",
        label2: "",
        key: "4",
    },
    {
        stepNumber: 5,
        midiNote: 71,
        label1: "5",
        label2: "",
        key: "q",
    },
    {
        stepNumber: 6,
        midiNote: 70,
        label1: "6",
        label2: "",
        key: "w",
    },
    {
        stepNumber: 7,
        midiNote: 69,
        label1: "7",
        label2: "",
        key: "e",
    },
    {
        stepNumber: 8,
        midiNote: 68,
        label1: "8",
        label2: "",
        key: "r",
    },
    {
        stepNumber: 9,
        midiNote: 67,
        label1: "9",
        label2: "",
        key: "a",
    },
    {
        stepNumber: 10,
        midiNote: 66,
        label1: "10",
        label2: "",
        key: "s",
    },
    {
        stepNumber: 11,
        midiNote: 65,
        label1: "11",
        label2: "",
        key: "d",
    },
    {
        stepNumber: 12,
        midiNote: 64,
        label1: "12",
        label2: "",
        key: "f",
    },
    {
        stepNumber: 13,
        midiNote: 60,
        label1: "13",
        label2: "Kik",
        key: "z",
    },
    {
        stepNumber: 14,
        midiNote: 61,
        label1: "14",
        label2: "Snr",
        key: "x",
    },
    {
        stepNumber: 15,
        midiNote: 62,
        label1: "15",
        label2: "Clp",
        key: "c",
    },
    {
        stepNumber: 16,
        midiNote: 63,
        label1: "16",
        label2: "Hat",
        key: "v",
    },
];
