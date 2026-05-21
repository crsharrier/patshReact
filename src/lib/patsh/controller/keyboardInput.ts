import { useEffect } from "react";
import type { Controller } from "./controller";

const notePadKeys: Record<string, number> = {
    "1": 1,
    "2": 2,
    "3": 3,
    "4": 4,
    q: 5,
    w: 6,
    e: 7,
    r: 8,
    a: 9,
    s: 10,
    d: 11,
    f: 12,
    z: 13,
    x: 14,
    c: 15,
    v: 16,
};

export function useKeyboardInput(controller: Controller) {
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const key = e.key.toLowerCase();
            const padNumber = notePadKeys[key];
            if (padNumber) {
                controller.pressPad(padNumber);
            } else if (key === "shift") {
                controller.shiftMode = true;
            }
        }

        function handleKeyUp(e: KeyboardEvent) {
            if (e.key.toLowerCase() === "shift") {
                controller.shiftMode = false;
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [controller]);
}
