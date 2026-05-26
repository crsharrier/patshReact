import { DEFAULT_BPM } from "../config";
import {
    TRACK_SAMPLE_URLS,
    type FxState,
    type StepStates,
    type TrackStates,
} from "./coreConstants";
import * as Tone from "tone";

const initPlayers = () =>
    new Tone.Players({
        urls: Object.fromEntries(
            TRACK_SAMPLE_URLS.map((url, i) => [(i + 1).toString(), url])
        ),
        fadeOut: "64n",
        baseUrl: "/assets/",
    }).toDestination();

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
    private static isInitialized: boolean = false;
    private trackPlayers?: Tone.Players;

    private playingNotePads: Set<number>;
    isRecording: boolean;
    tracks: TrackStates;
    fxs: FxState[];

    constructor() {
        this.playingNotePads = new Set();
        this.isRecording = false;
        this.tracks = createEmptyTracks();
        this.fxs = [];

        this.bpm = DEFAULT_BPM;
    }

    async initializeTone() {
        await Tone.start();
        this.trackPlayers = initPlayers();
        await Tone.loaded();
        Tone.getTransport().scheduleRepeat(this.playStep, "16n");
        PatshCore.isInitialized = true;
    }

    private playStep = (time: number) => {
        for (const [trackNum, trackState] of Object.entries(this.tracks)) {
            if (
                Object.values(this.tracks).some((t) => t.soloed) &&
                !trackState.soloed
            )
                continue;
            if (trackState.muted && !trackState.soloed) continue;
            const stepState = trackState.steps[this.currentStep];
            if (stepState.active) {
                const player = this.trackPlayers?.player(trackNum);
                if (player) {
                    player.start(time);
                    this.playNotePad(Number(trackNum));
                }
            }
        }
    };

    get currentStep(): number {
        const secondsPerStep = 60 / Tone.getTransport().bpm.value / 4;
        const elapsedInLoop = Tone.getTransport().seconds;
        return (Math.floor(elapsedInLoop / secondsPerStep) % 16) + 1;
    }

    get isToneInitialized(): boolean {
        return PatshCore.isInitialized;
    }

    get bpm() {
        return Tone.getTransport().bpm.value;
    }

    set bpm(value: number) {
        Tone.getTransport().bpm.value = value;
    }

    get playbackState() {
        return Tone.getTransport().state;
    }

    // get seconds() {
    //     return Tone.getTransport().seconds;
    // }

    async stop() {
        Tone.getTransport().stop();
        if (this.trackPlayers) {
            this.trackPlayers.stopAll();
        }
    }

    async playPause() {
        if (Tone.getTransport().state === "started") {
            Tone.getTransport().pause();
        } else {
            Tone.getTransport().start();
        }
    }
    async previewSound(trackNum: number) {
        const player = this.trackPlayers?.player(trackNum.toString());
        if (player) {
            player.start();
        }
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
