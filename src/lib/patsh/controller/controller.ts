import type { PatshCore } from "../core/patshCore";
import {
    fnPadDefs,
    type PadMode,
    type FnPadDef,
    DEFAULT_PAD_MODE,
} from "./controllerConstants";

class NotePad {
    id: number;
    controller: Controller;
    patsh: PatshCore;

    constructor(id: number, controller: Controller) {
        this.id = id;
        this.controller = controller;
        this.patsh = controller.patsh;
    }

    press(padMode: PadMode) {
        const trackNum = this.controller.currentTrack;
        if (padMode.name === "notePlay") {
            this.patsh.previewSound(this.id);
        } else if (padMode.name === "noteEdit") {
            this.controller.updateStep(trackNum, this.id);
        } else if (padMode.name === "trackSelect") {
            this.controller.currentTrack = this.id;
        } else if (padMode.name === "mute") {
            const track = this.patsh.tracks[this.id];
            track.muted = !track.muted;
        } else if (padMode.name === "solo") {
            this.patsh.toggleSoloed(this.id);
        }
    }

    release(padMode: PadMode) {
        void padMode; // No release behavior for note pads currently
    }
}

class FnPad {
    id: number;
    controller: Controller;
    padFn: FnPadDef;
    prevPadMode: PadMode | null = null;

    constructor(id: number, controller: Controller) {
        this.id = id;
        this.controller = controller;
        this.padFn = fnPadDefs[id as keyof typeof fnPadDefs];
    }

    private pressFn() {
        if (this.padFn.fn.name === "playPause") {
            this.controller.patsh.playPause();
        } else if (this.padFn.fn.name === "stop") {
            if (this.controller.patsh.playbackState !== "stopped") {
                this.controller.patsh.stop();
            }
        }
    }

    private pressHoldFn() {
        if (this.padFn.fn.name === "shift") {
            this.controller.shiftMode = true;
        }
    }

    private releaseHoldFn() {
        if (this.padFn.fn.name === "shift") {
            this.controller.shiftMode = false;
        }
    }

    private pressToggleMode() {
        const newMode = this.controller.shiftMode
            ? this.padFn.shiftFn?.name
            : this.padFn.fn.name;
        // const newMode = this.padFn.fn.name as PadMode["name"];
        if (this.controller.padMode.name === newMode) {
            this.controller.padMode = DEFAULT_PAD_MODE;
        } else {
            this.controller.padMode = fnPadDefs[
                this.id as keyof typeof fnPadDefs
            ].fn as PadMode;
        }
    }

    private pressHoldMode() {
        this.prevPadMode = this.controller.padMode;
        const padDef = fnPadDefs[this.id as keyof typeof fnPadDefs];
        this.controller.padMode = this.controller.shiftMode
            ? (padDef.shiftFn as PadMode)
            : (padDef.fn as PadMode);
    }

    private releaseHoldMode() {
        this.controller.padMode = this.prevPadMode || DEFAULT_PAD_MODE;
        this.prevPadMode = null;
    }

    press() {
        if (this.padFn.fn.type === "toggleMode") {
            this.pressToggleMode();
        } else if (this.padFn.fn.type === "holdMode") {
            this.pressHoldMode();
        } else if (this.padFn.fn.type === "fn") {
            this.pressFn();
        } else if (this.padFn.fn.type === "holdFn") {
            this.pressHoldFn();
        }
    }

    release() {
        if (this.padFn.fn.type === "holdMode") {
            this.releaseHoldMode();
        } else if (this.padFn.fn.type === "holdFn") {
            this.releaseHoldFn();
        }
    }
}
type PressReleaseListeners = {
    press: (n: number) => void;
    release?: (n: number) => void;
};

export class Controller extends EventTarget {
    patsh: PatshCore;
    shiftMode: boolean;
    padMode: PadMode;
    currentTrack: number;
    notePads: Record<number, NotePad>;
    fnPads: Record<number, FnPad>;
    notePadListeners: PressReleaseListeners[];
    fnPadListeners: PressReleaseListeners[];

    constructor(patsh: PatshCore) {
        super();
        this.patsh = patsh;
        this.shiftMode = false;
        this.padMode = DEFAULT_PAD_MODE;
        this.currentTrack = 1;
        this.notePads = Object.fromEntries(
            Array.from({ length: 16 }, (_, i) => [
                i + 1,
                new NotePad(i + 1, this),
            ])
        );
        this.fnPads = Object.fromEntries(
            Array.from({ length: 9 }, (_, i) => [i + 1, new FnPad(i + 1, this)])
        );
        this.notePadListeners = [];
        this.fnPadListeners = [];
    }

    updateStep(trackNum: number, stepId: number) {
        this.patsh.tracks[trackNum].steps[stepId].active =
            !this.patsh.tracks[trackNum].steps[stepId].active;
        this.dispatchEvent(new CustomEvent("updateStep"));
    }

    registerNotePadListener(callbacks: PressReleaseListeners) {
        this.notePadListeners.push(callbacks);
    }

    registerFnPadListener(callbacks: PressReleaseListeners) {
        this.fnPadListeners.push(callbacks);
    }

    pressNotePad(padNumber: number) {
        this.notePads[padNumber]?.press(this.padMode);
        this.notePadListeners.forEach((callbacks) =>
            callbacks.press(padNumber)
        );
    }

    releaseNotePad(padNumber: number) {
        this.notePads[padNumber]?.release(this.padMode);
        this.notePadListeners.forEach((callbacks) =>
            callbacks.release?.(padNumber)
        );
    }

    pressFnPad(padNumber: number) {
        this.fnPads[padNumber]?.press();
        this.fnPadListeners.forEach((callbacks) => callbacks.press(padNumber));
    }

    releaseFnPad(padNumber: number) {
        this.fnPads[padNumber]?.release();
        this.fnPadListeners.forEach((callbacks) =>
            callbacks.release?.(padNumber)
        );
    }
}
