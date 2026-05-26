export type TransportState = null;

export type StepState = {
    active: boolean;
    accent: boolean;
    ratchet: 0 | 1 | 2 | 3;
};

export type StepStates = Record<number, StepState>;

export type TrackState = {
    muted: boolean;
    soloed: boolean;
    steps: StepStates;
};

export type TrackStates = Record<number, TrackState>;

export type FxState = {
    active: boolean;
};

export const TRACK_SAMPLE_URLS = [
    "Kick 1.wav",
    "Snare 1.wav",
    "Snare 2.wav",
    "Clap 1.wav",
    "Kick 2.wav",
    "Rimshot.wav",
    "Snap.wav",
    "HiHat Mid.wav",
    "Conga.wav",
    "Tom Hi.wav",
    "Tom Lo.wav",
    "Tambourine.wav",
    "Cabasa.wav",
    "Cowbell.wav",
    "Crash.wav",
    "Ride.wav",
] as const;
