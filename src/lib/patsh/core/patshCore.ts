import { DEFAULT_BPM } from "../config";
import {
    type FxState,
    type StepStates,
    type TrackStates,
} from "./coreConstants";
import { ToneCore } from "./toneCore";

function createEmptySteps(numSteps: number = 16): StepStates {
    return Object.fromEntries(
        Array.from({ length: numSteps }, (_, i) => [
            (i + 1).toString(),
            { active: false, accent: false, ratchet: 0 },
        ])
    ) as StepStates;
}

function createEmptyTracks(numTracks: number = 16): TrackStates {
    return Object.fromEntries(
        Array.from({ length: numTracks }, (_, i) => [
            (i + 1).toString(),
            {
                muted: false,
                soloed: false,
                steps: createEmptySteps(),
            },
        ])
    ) as TrackStates;
}

// =============================================================================
// PatshCore
// =============================================================================
export class PatshCore {
    private toneCore: ToneCore;

    private playingNotePads: Set<number>;
    isRecording: boolean;
    tracks: TrackStates;
    fxs: FxState[];

    constructor() {
        this.playingNotePads = new Set();
        this.isRecording = false;
        this.tracks = createEmptyTracks();
        this.fxs = [];

        this.toneCore = new ToneCore(this);
        this.bpm = DEFAULT_BPM;
    }

    get currentStep(): number {
        return this.toneCore.currentStep;
    }

    get bpm() {
        return this.toneCore.bpm;
    }

    set bpm(value: number) {
        this.toneCore.bpm = value;
    }

    get playbackState() {
        return this.toneCore.playbackState;
    }

    get seconds() {
        return this.toneCore.seconds;
    }

    async playPause() {
        await this.toneCore.playPause();
    }

    async stop() {
        await this.toneCore.stop();
    }

    previewSound(trackNum: number) {
        this.toneCore.previewSound(trackNum);
    }

    // =========================================================================
    playNotePad(num: number) {
        this.playingNotePads.add(num);
        setTimeout(() => {
            this.playingNotePads.delete(num);
        }, 100); // Clear after 100ms (adjust as needed)
    }

    isNotePadPlaying(num: number): boolean {
        return this.playingNotePads.has(num);
    }

    toggleSoloed(trackNum: number) {
        for (const [num, trackState] of Object.entries(this.tracks)) {
            if (num === trackNum.toString()) {
                trackState.soloed = !trackState.soloed;
            } else {
                trackState.soloed = false; // Un-solo all other tracks
            }
        }
    }
}
