import {
    PAD_ACTIVE_COLOR,
    PAD_GAP,
    PAD_HEIGHT,
    PAD_INACTIVE_COLOR,
    PAD_WIDTH,
    PADDING,
    TOPBAR_HEIGHT,
    TOTAL_STEPS,
} from "../config";
import type { Controller } from "../controller/controller";
import type { PatshCore } from "../core/patshCore";

type PadState = {
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isHighlighted: boolean;
};

// =============================================================================
// ViewModel
// =============================================================================
export class ViewModel {
    controller: Controller;
    patsh: PatshCore;
    notePads: Record<number, PadState>;
    currentStep: number;
    private highlightedPads: Set<number>;

    constructor(controller: Controller, patsh: PatshCore) {
        this.controller = controller;
        this.controller.registerPadListener(this.flashPad.bind(this));
        this.patsh = patsh;
        this.highlightedPads = new Set();
        this.notePads = this.computePads();
        this.currentStep = this.computeCurrentStep();
    }

    private computePads(): Record<number, PadState> {
        const pads: Record<number, PadState> = {};
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const stepNum = i * 4 + j + 1; // Calculate step number (1-16)
                const trackNum = this.controller.currentTrack;
                const stepState = this.patsh.tracks[trackNum].steps[stepNum];
                const color = stepState.active
                    ? PAD_ACTIVE_COLOR
                    : PAD_INACTIVE_COLOR;
                pads[stepNum] = {
                    color,
                    x: PADDING + j * (PAD_WIDTH + PAD_GAP),
                    y: PADDING + TOPBAR_HEIGHT + i * (PAD_HEIGHT + PAD_GAP),
                    width: PAD_WIDTH,
                    height: PAD_HEIGHT,
                    isHighlighted: this.highlightedPads.has(stepNum),
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

    flashPad(stepNum: number) {
        if (this.notePads[stepNum]) {
            this.highlightedPads.add(stepNum);
            setTimeout(() => {
                this.highlightedPads.delete(stepNum);
            }, 100); // Highlight for 100ms
        }
    }

    update() {
        this.notePads = this.computePads();
        this.currentStep = this.computeCurrentStep();
    }
}
