// stores/midiStore.ts
import { create } from "zustand";

export interface MidiDevice {
    id: string;
    name: string;
}

interface MidiState {
    midiAccess: MIDIAccess | null;
    inputs: MidiDevice[];
    outputs: MidiDevice[];
    selectedInputId: string | null;
    selectedOutputId: string | null;
    log: string[];

    setSelectedInput: (id: string | null) => void;
    setSelectedOutput: (id: string | null) => void;
    sendNote: (note?: number, velocity?: number) => void;
    addLog: (entry: string) => void;
    initMidi: () => void;
}

const useMidiStore = create<MidiState>((set, get) => ({
    midiAccess: null,
    inputs: [],
    outputs: [],
    selectedInputId: null,
    selectedOutputId: null,
    log: [],

    setSelectedInput: (id) => set({ selectedInputId: id }),
    setSelectedOutput: (id) => set({ selectedOutputId: id }),
    addLog: (entry) => set((state) => ({ log: [entry, ...state.log] })),

    sendNote: (note = 60, velocity = 100) => {
        const { midiAccess, selectedOutputId, addLog } = get();
        if (!midiAccess || !selectedOutputId) return;

        const output = midiAccess.outputs.get(selectedOutputId);
        if (!output) return;

        output.send([0x90, note, velocity]); // Note On
        addLog(`OUT ⟶ Note On ${note}`);

        setTimeout(() => {
            output.send([0x80, note, 0]); // Note Off
            addLog(`OUT ⟶ Note Off ${note}`);
        }, 500);
    },

    initMidi: () => {
        if (!("requestMIDIAccess" in navigator)) {
            console.error("Web MIDI API not supported");
            return;
        }

        navigator.requestMIDIAccess().then((access) => {
            set({ midiAccess: access });

            const refreshDevices = () => {
                const inDevs: MidiDevice[] = [];
                const outDevs: MidiDevice[] = [];

                access.inputs.forEach((input) =>
                    inDevs.push({
                        id: input.id,
                        name: input.name || "Unknown Input",
                    })
                );
                access.outputs.forEach((output) =>
                    outDevs.push({
                        id: output.id,
                        name: output.name || "Unknown Output",
                    })
                );

                set({ inputs: inDevs, outputs: outDevs });
            };

            refreshDevices();
            access.onstatechange = refreshDevices;

            // Attach listener to selected input
            access.inputs.forEach((input) => (input.onmidimessage = null));
            const inputId = get().selectedInputId;
            if (inputId) {
                const input = access.inputs.get(inputId);
                if (input) {
                    input.onmidimessage = (msg) => {
                        if (
                            msg.data &&
                            typeof msg.data[Symbol.iterator] === "function"
                        ) {
                            const [status, data1, data2] = Array.from(msg.data);
                            get().addLog(
                                `IN ⟶ status:${status} note:${data1} vel:${data2}`
                            );
                        }
                    };
                }
            }
        });
    },
}));

export default useMidiStore;
