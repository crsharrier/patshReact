import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Settings } from "lucide-react";

interface MidiDevice {
    id: string;
    name: string;
}

function MidiSetup() {
    const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
    const [inputs, setInputs] = useState<MidiDevice[]>([]);
    const [outputs, setOutputs] = useState<MidiDevice[]>([]);
    const [selectedInputId, setSelectedInputId] = useState<string | null>(null);
    const [selectedOutputId, setSelectedOutputId] = useState<string | null>(
        null
    );
    const [log, setLog] = useState<string[]>([]);

    // Initialize Web MIDI
    useEffect(() => {
        if (!("requestMIDIAccess" in navigator)) {
            console.error(
                "Web MIDI API not supported in this browser/Electron"
            );
            return;
        }

        navigator.requestMIDIAccess().then((access) => {
            setMidiAccess(access);

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

                setInputs(inDevs);
                setOutputs(outDevs);
            };

            refreshDevices();

            // Watch for device changes (e.g. plugging/unplugging JUCE app)
            access.onstatechange = () => refreshDevices();
        });
    }, []);

    // Handle incoming MIDI when input is selected
    useEffect(() => {
        if (!midiAccess || !selectedInputId) return;

        // Clear old listeners
        midiAccess.inputs.forEach((input) => (input.onmidimessage = null));

        const input = midiAccess.inputs.get(selectedInputId);
        if (input) {
            input.onmidimessage = (msg) => {
                if (
                    msg.data &&
                    typeof msg.data[Symbol.iterator] === "function"
                ) {
                    const [status, data1, data2] = Array.from(
                        msg.data as Iterable<number>
                    );
                    setLog((prev) => [
                        `IN ⟶ status:${status} note:${data1} vel:${data2}`,
                        ...prev,
                    ]);
                }
            };
        }
    }, [midiAccess, selectedInputId]);

    // Send a note when output is selected
    const sendNote = () => {
        if (!midiAccess || !selectedOutputId) return;

        const output = midiAccess.outputs.get(selectedOutputId);
        if (output) {
            output.send([0x90, 60, 100]); // Note On (C4)
            setLog((prev) => ["OUT ⟶ Note On 60", ...prev]);

            setTimeout(() => {
                output.send([0x80, 60, 0]); // Note Off
                setLog((prev) => ["OUT ⟶ Note Off 60", ...prev]);
            }, 500);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Settings className="size-5 cursor-pointer" />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Midi Setup</DialogTitle>
                </DialogHeader>

                <div>
                    <h2>Select MIDI Input</h2>
                    <select
                        value={selectedInputId || ""}
                        onChange={(e) => setSelectedInputId(e.target.value)}
                    >
                        <option value="">-- None --</option>
                        {inputs.map((inp) => (
                            <option key={inp.id} value={inp.id}>
                                {inp.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <h2>Select MIDI Output</h2>
                    <select
                        value={selectedOutputId || ""}
                        onChange={(e) => setSelectedOutputId(e.target.value)}
                    >
                        <option value="">-- None --</option>
                        {outputs.map((out) => (
                            <option key={out.id} value={out.id}>
                                {out.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Button
                    onClick={sendNote}
                    disabled={!selectedOutputId}
                    style={{ marginTop: "1rem" }}
                >
                    Send Test Note
                </Button>

                <div style={{ marginTop: "1rem" }}>
                    <h2>Log</h2>
                    <pre>{log.join("\n")}</pre>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default MidiSetup;
