import { DEFAULT_BPM } from "../config";
import type { FxState, StepStates, TrackStates } from "./coreConstants";
import * as Tone from "tone";

const TRACK_1_SAMPLE_URL = new URL(
    "../../../assets/MaxV - Kick 1.wav",
    import.meta.url
).href;

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
                sampleUrl: i === 0 ? TRACK_1_SAMPLE_URL : undefined,
            },
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
    private track1Player: Tone.Player;

    constructor() {
        this.transport = Tone.getTransport();
        this.bpm = DEFAULT_BPM;
        this.isRecording = false;
        this.tracks = createEmptyTracks();
        this.fxs = [];
        this.track1Player = new Tone.Player(
            this.tracks[1].sampleUrl
        ).toDestination();

        this.transport.scheduleRepeat(this.triggerTrack1Step, "16n");
    }

    private getCurrentStep() {
        const secondsPerStep = 60 / this.transport.bpm.value / 4;
        const elapsedInLoop = this.transport.seconds;
        return (Math.floor(elapsedInLoop / secondsPerStep) % 16) + 1;
    }

    private triggerTrack1Step = (time: number) => {
        const currentStep = this.getCurrentStep();
        const stepState = this.tracks[1].steps[currentStep];

        if (stepState?.active) {
            this.track1Player.start(time);
        }
    };

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
            await Tone.loaded();
            await Tone.start();
            this.transport.start();
        }
    }
}
