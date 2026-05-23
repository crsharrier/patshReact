import { useEffect } from "react";
import type { Controller } from "./controller";

export const notePadCodes: Record<string, number> = {
    Digit1: 1,
    Digit2: 2,
    Digit3: 3,
    Digit4: 4,
    KeyQ: 5,
    KeyW: 6,
    KeyE: 7,
    KeyR: 8,
    KeyA: 9,
    KeyS: 10,
    KeyD: 11,
    KeyF: 12,
    KeyZ: 13,
    KeyX: 14,
    KeyC: 15,
    KeyV: 16,
};

export const modePadCodes: Record<string, number> = {
    Digit8: 1,
    KeyI: 2,
    KeyK: 3,
    Comma: 4,
    Digit9: 5,
    KeyO: 6,
    KeyL: 7,
    Period: 8,
};

export function useKeyboardInput(controller: Controller) {
    useEffect(() => {
        const activeCodes = new Set<string>();

        function handleKeyDown(e: KeyboardEvent) {
            const code = e.code;

            if (e.repeat || activeCodes.has(code)) {
                return;
            }

            activeCodes.add(code);

            if (code in notePadCodes) {
                controller.pressNotePad(notePadCodes[code]);
            } else if (code in modePadCodes) {
                controller.pressFnPad(modePadCodes[code]);
            }
        }

        function handleKeyUp(e: KeyboardEvent) {
            const code = e.code;
            activeCodes.delete(code);
            if (code in notePadCodes) {
                controller.releaseNotePad(notePadCodes[code]);
            } else if (code in modePadCodes) {
                controller.releaseFnPad(modePadCodes[code]);
            }
        }

        function handleWindowBlur() {
            activeCodes.clear();
            controller.shiftMode = false;
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("blur", handleWindowBlur);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
            window.removeEventListener("blur", handleWindowBlur);
        };
    }, [controller]);
}
