import type { PadMode } from "./types";

class Pad {
    press() {}
}

export class Controller {
    shiftMode: boolean;
    padMode: PadMode;
    currentTrack: number;
    pads: Record<number, Pad>;
    padListeners: ((n: number) => void)[];

    constructor() {
        this.shiftMode = false;
        this.padMode = "notePlay";
        this.currentTrack = 1;
        this.pads = Object.fromEntries(
            Array.from({ length: 16 }, (_, i) => [i + 1, new Pad()])
        );
        this.padListeners = [];
    }

    registerPadListener(callback: (n: number) => void) {
        this.padListeners.push(callback);
    }

    pressPad(padNumber: number) {
        this.pads[padNumber]?.press();
        this.padListeners.forEach((callback) => callback(padNumber));
    }
}
