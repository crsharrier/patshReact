import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import type { ViewModel } from "./view/viewModel";
import type { PadMode } from "./controller/controllerConstants";
import type { TrackStates } from "./core/coreConstants";

export type RecallState = {
    currentMode: PadMode["name"];
    sequencer: TrackStates;
};

export type PatshState = {
    currentStep: number;
    isToneInitialized: boolean;
    bpm: number;
    playbackState: string;
    currentTrack: number;
    padMode: PadMode["name"];
    recallState: RecallState;
    playPause: () => void;
    setBpm: (bpm: number) => void;
};

const getState = (viewModel: ViewModel): PatshState => ({
    currentStep: viewModel.patsh.currentStep,
    isToneInitialized: viewModel.patsh.isToneInitialized,
    bpm: viewModel.patsh.bpm,
    playbackState: viewModel.patsh.playbackState,
    currentTrack: viewModel.controller.currentTrack,
    padMode: viewModel.controller.padMode.name,
    recallState: {
        currentMode: viewModel.controller.padMode.name,
        sequencer: viewModel.patsh.tracks,
    },
    playPause: () => viewModel.patsh.playPause(),
    setBpm: (bpm: number) => {
        viewModel.patsh.bpm = bpm;
    },
});

const PATSH_STATE_KEY = "patshState";

const loadRecallState = (): RecallState | null => {
    const rawState = localStorage.getItem(PATSH_STATE_KEY);
    // const rawState = null; // Disable recall state for now
    if (!rawState) return null;

    try {
        const parsed = JSON.parse(rawState);
        if (parsed && typeof parsed === "object") {
            return parsed as RecallState;
        }
    } catch {
        return null;
    }

    return null;
};

// =============================================================================
// localStorage util
// =============================================================================
const useRecallStateLocalStorage = (viewModel: ViewModel) => {
    useEffect(() => {
        const restoredState = loadRecallState();
        if (restoredState) {
            viewModel.patsh.tracks = restoredState;
        }

        const save = () => {
            localStorage.setItem(
                PATSH_STATE_KEY,
                JSON.stringify(viewModel.patsh.tracks)
            );
        };

        viewModel.controller.addEventListener("updateStep", save);

        return () => {
            viewModel.controller.removeEventListener("updateStep", save);
        };
    }, [viewModel]);
};

// =============================================================================
// SyncExternalStore Hook
// =============================================================================
export const usePatshState = (viewModel: ViewModel) => {
    const lastSnapshotRef = useRef<PatshState | null>(null);

    useRecallStateLocalStorage(viewModel);

    // =========================================================================
    const subscribeToPatshState = useCallback((callback: () => void) => {
        let frameId = 0;

        const tick = () => {
            callback();
            frameId = requestAnimationFrame(tick);
        };

        frameId = requestAnimationFrame(tick);

        return () => {
            cancelAnimationFrame(frameId);
        };
    }, []);

    // =========================================================================
    const getSnapshot = useCallback((): PatshState => {
        const nextSnapshot: PatshState = getState(viewModel);
        const previousSnapshot = lastSnapshotRef.current;
        if (
            previousSnapshot &&
            previousSnapshot.currentStep === nextSnapshot.currentStep &&
            previousSnapshot.isToneInitialized ===
                nextSnapshot.isToneInitialized &&
            previousSnapshot.bpm === nextSnapshot.bpm &&
            previousSnapshot.playbackState === nextSnapshot.playbackState &&
            previousSnapshot.currentTrack === nextSnapshot.currentTrack &&
            previousSnapshot.padMode === nextSnapshot.padMode
        ) {
            return previousSnapshot;
        }

        lastSnapshotRef.current = nextSnapshot;
        return nextSnapshot;
    }, [viewModel]);

    // =========================================================================
    return useSyncExternalStore<PatshState>(subscribeToPatshState, getSnapshot);
};
