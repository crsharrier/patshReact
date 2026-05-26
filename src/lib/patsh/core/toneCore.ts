import * as Tone from "tone";
import { TRACK_SAMPLE_URLS } from "./coreConstants";
import type { PatshCore } from "./patshCore";

const initPlayers = () =>
    new Tone.Players({
        urls: Object.fromEntries(
            TRACK_SAMPLE_URLS.map((url, i) => [(i + 1).toString(), url])
        ),
        fadeOut: "64n",
        baseUrl: "/assets/",
    }).toDestination();

export class ToneCore {
    private patsh: PatshCore;
    private static isInitialized: boolean = false;
    private trackPlayers?: Tone.Players;

    constructor(patsh: PatshCore) {
        this.patsh = patsh;
    }

    private async ensureInitialized() {
        if (ToneCore.isInitialized) return;
        await Tone.start();
        this.trackPlayers = initPlayers();
        await Tone.loaded();
        Tone.getTransport().scheduleRepeat(this.playStep, "16n");
        ToneCore.isInitialized = true;
    }

    private playStep = (time: number) => {
        for (const [trackNum, trackState] of Object.entries(
            this.patsh.tracks
        )) {
            if (trackState.muted) continue;
            const stepState = trackState.steps[this.currentStep];
            if (stepState.active) {
                const player = this.trackPlayers?.player(trackNum);
                if (player) {
                    player.start(time);
                    this.patsh.playNotePad(Number(trackNum));
                }
            }
        }
    };

    get currentStep(): number {
        if (!ToneCore.isInitialized) return 1; // Default to step 1 if not initialized
        const secondsPerStep = 60 / Tone.getTransport().bpm.value / 4;
        const elapsedInLoop = Tone.getTransport().seconds;
        return (Math.floor(elapsedInLoop / secondsPerStep) % 16) + 1;
    }

    get bpm() {
        if (!ToneCore.isInitialized) return 120; // Default BPM
        return Tone.getTransport().bpm.value;
    }

    set bpm(value: number) {
        if (!ToneCore.isInitialized) return;
        Tone.getTransport().bpm.value = value;
    }

    get playbackState() {
        if (!ToneCore.isInitialized) return "stopped";
        return Tone.getTransport().state;
    }

    get seconds() {
        if (!ToneCore.isInitialized) return 0;
        return Tone.getTransport().seconds;
    }

    async stop() {
        await this.ensureInitialized();
        Tone.getTransport().stop();
        if (this.trackPlayers) {
            this.trackPlayers.stopAll();
        }
    }

    async playPause() {
        await this.ensureInitialized();
        if (Tone.getTransport().state === "started") {
            Tone.getTransport().pause();
        } else {
            Tone.getTransport().start();
        }
    }

    async previewSound(trackNum: number) {
        await this.ensureInitialized();
        const player = this.trackPlayers?.player(trackNum.toString());
        if (player) {
            player.start();
        }
    }
}
