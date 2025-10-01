import { useEffect } from "react";
import useMidiStore from "@/stores/midiStore";
import { Button } from "./ui/button";

function MidiSetup() {
    const {
        inputs,
        outputs,
        selectedInputId,
        selectedOutputId,
        setSelectedInput,
        setSelectedOutput,
        initMidi,
        sendNote,
        log,
    } = useMidiStore();

    useEffect(() => {
        initMidi();
    }, [initMidi]);

    return (
        <div>
            <h2>Select MIDI Input</h2>
            <select
                value={selectedInputId || ""}
                onChange={(e) => setSelectedInput(e.target.value)}
            >
                <option value="">-- None --</option>
                {inputs.map((inp) => (
                    <option key={inp.id} value={inp.id}>
                        {inp.name}
                    </option>
                ))}
            </select>

            <h2>Select MIDI Output</h2>
            <select
                value={selectedOutputId || ""}
                onChange={(e) => setSelectedOutput(e.target.value)}
            >
                <option value="">-- None --</option>
                {outputs.map((out) => (
                    <option key={out.id} value={out.id}>
                        {out.name}
                    </option>
                ))}
            </select>

            <Button onClick={() => sendNote()} disabled={!selectedOutputId}>
                Send Test Note
            </Button>

            <div>
                <h2>Log</h2>
                <pre>{log.join("\n")}</pre>
            </div>
        </div>
    );
}

export default MidiSetup;
