import { useEffect } from "react";
import useMidiStore from "@/stores/midiStore";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogHeader,
} from "./ui/dialog";

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
        <Dialog>
            <DialogTrigger asChild>
                <Settings />
            </DialogTrigger>

            <DialogContent>
                {/* header  */}
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription>
                        Choose your MIDI input and output devices.
                    </DialogDescription>
                </DialogHeader>

                {/* select input  */}
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

                {/* select output */}
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

                {/* footer  */}
                <DialogFooter>
                    <Button
                        onClick={() => sendNote()}
                        disabled={!selectedOutputId}
                    >
                        Send Test Note
                    </Button>

                    <div>
                        <h2>Log</h2>
                        <pre>{log.join("\n")}</pre>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default MidiSetup;
