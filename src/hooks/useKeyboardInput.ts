import { useEffect } from "react";
import type { PadHandle } from "@/components/controller/Pad";
import type { NotePadDef } from "@/components/controller/config";

export function useKeyboardInput(
    notePadDefs: NotePadDef[],
    padRefs: React.RefObject<(PadHandle | null)[]>
) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const defIndex = notePadDefs.findIndex(
                (pad) => pad.key.toLowerCase() === e.key.toLowerCase()
            );
            if (defIndex !== -1) {
                padRefs.current[defIndex]?.pressPad();
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [notePadDefs, padRefs]);
}
