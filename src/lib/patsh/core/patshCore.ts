import type { FxState, StepStates, TrackStates } from "./types";
import * as Tone from "tone";

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
            { muted: false, soloed: false, steps: createEmptySteps() },
        ])
    ) as TrackStates;
}

// =============================================================================
// PatshCore
// =============================================================================
export class PatshCore {
    transport: ReturnType<typeof Tone.getTransport>;
    isRecording: boolean;
    tracks: TrackStates;
    fxs: FxState[];

    constructor() {
        this.transport = Tone.getTransport();
        this.bpm = 20;
        this.isRecording = false;
        this.tracks = createEmptyTracks();
        this.fxs = [];
    }

    get playbackState() {
        return this.transport.state;
    }

    get bpm() {
        return this.transport.bpm.value;
    }

    set bpm(value: number) {
        this.transport.bpm.value = value;
    }

    async playPause() {
        if (this.transport.state === "started") {
            this.transport.pause();
        } else {
            await Tone.start();
            this.transport.start();
        }
    }
}
