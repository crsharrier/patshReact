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

    isRecording: boolean;
    tracks: TrackStates;
    fxs: FxState[];

    constructor() {
        this.isRecording = false;
        this.tracks = createEmptyTracks();
        this.fxs = [];

        this.toneCore = new ToneCore(this);
        this.bpm = DEFAULT_BPM;
    }

    get currentStep(): number {
        return this.toneCore.currentStep;
    }

    // private playStep(time: number, trackNum: string) {
    //     if (!this.trackPlayers?.has(trackNum)) {
    //         if (!this.warnedTrackPlayers.has(trackNum)) {
    //             console.warn(
    //                 `No player found for track ${trackNum}. Check TRACK_SAMPLE_URLS mapping.`
    //             );
    //             this.warnedTrackPlayers.add(trackNum);
    //         }
    //         return;
    //     }

    //     const player = this.trackPlayers.player(trackNum);
    //     if (!player.loaded) {
    //         if (!this.warnedTrackPlayers.has(trackNum)) {
    //             console.warn(
    //                 `Player for track ${trackNum} is not loaded yet. Skipping trigger.`
    //             );
    //             this.warnedTrackPlayers.add(trackNum);
    //         }
    //         return;
    //     }

    //     console.log(`Triggering track ${trackNum} at time ${time.toFixed(2)}s`);
    //     player.start(time);
    // }

    // private advanceSequencer = (time: number) => {
    //     for (const trackNum in this.tracks) {
    //         const track = this.tracks[trackNum];
    //         if (track.muted) continue;
    //         if (
    //             Object.values(this.tracks).some((t) => t.soloed) &&
    //             !track.soloed
    //         )
    //             continue;

    //         const stepState = track.steps[this.currentStep];
    //         if (stepState?.active) {
    //             this.playStep(time, trackNum);
    //         }
    //     }
    // };

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
}
