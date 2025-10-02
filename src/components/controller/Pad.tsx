import { useState, useImperativeHandle, forwardRef } from "react";
import type { NotePadDef } from "./config";
import useMidiStore from "@/stores/midiStore";

interface PadProps {
    padDef: NotePadDef;
}

export interface PadHandle {
    pressPad: () => void;
}

const Pad = forwardRef<PadHandle, PadProps>((props, ref) => {
    const [isFlashing, setIsFlashing] = useState(false);
    const pad = props.padDef;
    const sendNote = useMidiStore((state) => state.sendNote);

    const pressPad = () => {
        sendNote(pad.midiNote);
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 150); // flash for 150ms
    };

    // Expose `pressPad` to the parent
    useImperativeHandle(ref, () => ({ pressPad }));

    // Local click handler that calls pressPad
    const handleClick = () => pressPad();

    return (
        <div
            id={`pad${pad.stepNumber}`}
            className={`size-20 flex flex-col p-1 ${
                isFlashing ? "bg-pad-flash" : "bg-pad-base"
            } cursor-pointer`}
            onClick={handleClick}
        >
            {/* labels  */}
            <div className="flex justify-between text-xs">
                <span>{pad.label1}</span>
                {pad.label2 && (
                    <span className="text-lg pr-1">{pad.label2}</span>
                )}
            </div>
        </div>
    );
});

export default Pad;
