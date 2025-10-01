import { useRef } from "react";
import { notePadDefs } from "./config";
import Pad, { type PadHandle } from "./Pad";
import { useKeyboardInput } from "@/hooks/useKeyboardInput";

function Controller() {
    const padRefs = useRef<(PadHandle | null)[]>([]);
    useKeyboardInput(notePadDefs, padRefs);

    return (
        <div className="grid grid-cols-4 gap-3">
            {notePadDefs.map((pad, i) => (
                <Pad
                    key={pad.id}
                    id={pad.id}
                    label={pad.label}
                    ref={(el) => {
                        padRefs.current[i] = el;
                    }}
                />
            ))}
        </div>
    );
}

export default Controller;
