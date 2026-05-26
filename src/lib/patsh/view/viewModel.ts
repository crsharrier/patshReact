import {
    PAD_GAP,
    PAD_HEIGHT,
    PAD_LUMINANCE_4,
    PAD_LUMINANCE_0,
    PAD_SATURATION,
    PAD_WIDTH,
    PADDING,
    TOPBAR_HEIGHT,
    PAD_LUMINANCE_2,
} from "../config";
import type { Controller } from "../controller/controller";
import { fnPadDefs } from "../controller/controllerConstants";
import { TRACK_SAMPLE_URLS } from "../core/coreConstants";
import type { PatshCore } from "../core/patshCore";
import { computeNotePadColor } from "./padColor";

type PadState = {
    color: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text1?: string;
    text2?: string;
    text3?: string;
};

const getTrackSampleName = (trackNum: number): string => {
    const index = trackNum - 1; // Convert to 0-based index
    const fullName = TRACK_SAMPLE_URLS[index] || "Unknown Sample";
    return fullName.split(".")[0]; // Remove file extension
};

// =============================================================================
// ViewModel
// =============================================================================
export class ViewModel {
    controller: Controller;
    patsh: PatshCore;
    notePads: Record<number, PadState>;
    modePads: Record<number, PadState>;
    private struckNotePads: Set<number>;
    private struckModePads: Set<number>;

    constructor(controller: Controller) {
        this.controller = controller;
        this.controller.registerNotePadListener({
            press: (num: number) => {
                this.strikePad(num, "note");
            },
        });
        this.controller.registerFnPadListener({
            press: (num: number) => {
                this.strikePad(num, "fn");
            },
        });
        this.patsh = controller.patsh;
        this.struckNotePads = new Set();
        this.struckModePads = new Set();
        this.notePads = this.computeNotePads();
        this.modePads = this.computeModePads();
    }

    // =========================================================================
    private computeNotePads(): Record<number, PadState> {
        const pads: Record<number, PadState> = {};
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                const stepNum = i * 4 + j + 1; // Calculate step number (1-16)
                const color = computeNotePadColor(this, stepNum);
                pads[stepNum] = {
                    color,
                    x: PADDING + j * (PAD_WIDTH + PAD_GAP),
                    y: PADDING + TOPBAR_HEIGHT + i * (PAD_HEIGHT + PAD_GAP),
                    width: PAD_WIDTH,
                    height: PAD_HEIGHT,
                    text3: getTrackSampleName(stepNum),
                };
            }
        }
        return pads;
    }

    // =========================================================================
    private computeModePadColor(modeIndex: number): string {
        const fnPad = fnPadDefs[modeIndex as keyof typeof fnPadDefs];
        const mode = this.controller.shiftMode ? fnPad.shiftFn : fnPad.fn;
        const isActive = this.controller.padMode.name === mode?.name;
        const isStruck = this.struckModePads.has(modeIndex);
        const luminance = isStruck
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

    // =========================================================================
    strikePad(num: number, noteOrMode: "note" | "fn") {
        if (noteOrMode === "note" && this.notePads[num]) {
            this.struckNotePads.add(num);
            setTimeout(() => {
                this.struckNotePads.delete(num);
            }, 100); // Highlight for 100ms
        } else if (noteOrMode === "fn" && this.modePads[num]) {
            this.struckModePads.add(num);
            setTimeout(() => {
                this.struckModePads.delete(num);
            }, 100); // Highlight for 100ms
        }
    }

    isNotePadStruck(padNum: number): boolean {
        return this.struckNotePads.has(padNum);
    }

    update() {
        this.notePads = this.computeNotePads();
        this.modePads = this.computeModePads();
    }
}
