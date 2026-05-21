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
