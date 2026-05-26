import { useCallback, useRef, useSyncExternalStore } from "react";
import type { ViewModel } from "./view/viewModel";
import type { PadMode } from "./controller/controllerConstants";

export type PatshState = {
    currentStep: number;
    isToneInitialized: boolean;
    bpm: number;
    playbackState: string;
    currentTrack: number;
    padMode: PadMode["name"];
    // sequencer:
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
    playPause: () => viewModel.patsh.playPause(),
    setBpm: (bpm: number) => {
        viewModel.patsh.bpm = bpm;
    },
});

// =============================================================================
// SyncExternalStore Hook
// =============================================================================
export const usePatshState = (viewModel: ViewModel) => {
    const lastSnapshotRef = useRef<PatshState | null>(null);

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
