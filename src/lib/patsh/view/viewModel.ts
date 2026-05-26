import {
    PAD_GAP,
    PAD_HEIGHT,
    PAD_LUMINANCE_4,
    PAD_LUMINANCE_0,
    PAD_SATURATION,
    PAD_WIDTH,
    PADDING,
    TOPBAR_HEIGHT,
    TOTAL_STEPS,
    PAD_LUMINANCE_2,
} from "../config";
import type { Controller } from "../controller/controller";
import { fnPadDefs } from "../controller/controllerConstants";
import type { PatshCore } from "../core/patshCore";

type PadState = {
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text1?: string;
    text2?: string;
};

// =============================================================================
// ViewModel
// =============================================================================
export class ViewModel {
    controller: Controller;
    patsh: PatshCore;
    notePads: Record<number, PadState>;
    modePads: Record<number, PadState>;
    currentStep: number;
    private highlightedNotePads: Set<number>;
    private highlightedModePads: Set<number>;

    constructor(controller: Controller) {
        this.controller = controller;
        this.controller.registerNotePadListener({
            press: (num: number) => {
                this.flashPad(num, "note");
            },
        });
        this.controller.registerFnPadListener({
            press: (num: number) => {
                this.flashPad(num, "fn");
            },
        });
        this.patsh = controller.patsh;
        this.highlightedNotePads = new Set();
        this.highlightedModePads = new Set();
        this.notePads = this.computeNotePads();
        this.modePads = this.computeModePads();
        this.currentStep = this.computeCurrentStep();
    }

    private computeNotePadColor(stepNum: number): string {
        const trackNum = this.controller.currentTrack;
        const stepState = this.patsh.tracks[trackNum].steps[stepNum];
        const isHighlighted = this.highlightedNotePads.has(stepNum);
        const hue = this.controller.padMode.hue;
        const luminance = isHighlighted
            ? PAD_LUMINANCE_4
            : stepState.active
              ? PAD_LUMINANCE_2
              : PAD_LUMINANCE_0;
        return `hsl(${hue}, ${PAD_SATURATION}%, ${luminance}%)`;
    }

    private computeNotePads(): Record<number, PadState> {
        const pads: Record<number, PadState> = {};
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const stepNum = i * 4 + j + 1; // Calculate step number (1-16)
                const color = this.computeNotePadColor(stepNum);
                pads[stepNum] = {
                    color,
                    x: PADDING + j * (PAD_WIDTH + PAD_GAP),
                    y: PADDING + TOPBAR_HEIGHT + i * (PAD_HEIGHT + PAD_GAP),
                    width: PAD_WIDTH,
                    height: PAD_HEIGHT,
                };
            }
        }
        return pads;
    }

    private computeModePadColor(modeIndex: number): string {
        const fnPad = fnPadDefs[modeIndex as keyof typeof fnPadDefs];
        const mode = this.controller.shiftMode ? fnPad.shiftFn : fnPad.fn;
        const isActive = this.controller.padMode.name === mode?.name;
        const isHighlighted = this.highlightedModePads.has(modeIndex);
        const luminance = isHighlighted
            ? PAD_LUMINANCE_4
            : isActive
              ? PAD_LUMINANCE_2
              : PAD_LUMINANCE_0;
        return `hsl(${mode?.hue}, ${PAD_SATURATION}%, ${luminance}%)`;
    }

    private computeModePads(): Record<number, PadState> {
        const pads: Record<number, PadState> = {};
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 4; j++) {
                const modeIndex = (i * 4 + j + 1) as keyof typeof fnPadDefs;
                const mode = fnPadDefs[modeIndex].fn.name;
                const gridWidth = PADDING + 4 * (PAD_WIDTH + PAD_GAP);
                const xOffset = PADDING + i * (PAD_WIDTH + PAD_GAP) + gridWidth;
                const yOffset =
                    PADDING + TOPBAR_HEIGHT + j * (PAD_HEIGHT + PAD_GAP);
                pads[modeIndex] = {
                    color: this.computeModePadColor(modeIndex),
                    x: xOffset,
                    y: yOffset,
                    width: PAD_WIDTH,
                    height: PAD_HEIGHT,
                    text1: mode,
                    text2: fnPadDefs[modeIndex].shiftFn?.name,
                };
            }
        }
        return pads;
    }

    private computeCurrentStep(): number {
        const secondsPerStep = 60 / this.patsh.transport.bpm.value / 4; // 16th-note step
        const loopDuration = TOTAL_STEPS * secondsPerStep;
        const elapsedInLoop =
            loopDuration > 0 ? this.patsh.transport.seconds % loopDuration : 0;
        return (Math.floor(elapsedInLoop / secondsPerStep) % TOTAL_STEPS) + 1; // Steps are 1-indexed
    }

    flashPad(num: number, noteOrMode: "note" | "fn") {
        if (noteOrMode === "note" && this.notePads[num]) {
            this.highlightedNotePads.add(num);
            setTimeout(() => {
                this.highlightedNotePads.delete(num);
            }, 100); // Highlight for 100ms
        } else if (noteOrMode === "fn" && this.modePads[num]) {
            this.highlightedModePads.add(num);
            setTimeout(() => {
                this.highlightedModePads.delete(num);
            }, 100); // Highlight for 100ms
        }
    }

    update() {
        this.notePads = this.computeNotePads();
        this.modePads = this.computeModePads();
        this.currentStep = this.computeCurrentStep();
    }
}
