import {
    PAD_LUMINANCE_0,
    PAD_LUMINANCE_1,
    PAD_LUMINANCE_2,
    PAD_LUMINANCE_4,
    PAD_SATURATION,
} from "../config";
import { type PadMode } from "../controller/controllerConstants";
import type { ViewModel } from "./viewModel";

type LuminanceFn = (viewModel: ViewModel, padNum: number) => number;

// =============================================================================
const otherLuminance: LuminanceFn = (viewModel: ViewModel, padNum: number) => {
    if (viewModel.patsh.isNotePadPlaying(padNum)) return PAD_LUMINANCE_1;
    return PAD_LUMINANCE_0;
};

const noteEditLuminance: LuminanceFn = (
    viewModel: ViewModel,
    padNum: number
) => {
    const trackNum = viewModel.controller.currentTrack;
    const track = viewModel.controller.patsh.tracks[trackNum];
    const stepState = track.steps[padNum];
    if (stepState.active) return PAD_LUMINANCE_2;
    if (trackNum === padNum) return PAD_LUMINANCE_1;
    return PAD_LUMINANCE_0;
};

const trackSelectLuminance: LuminanceFn = (
    viewModel: ViewModel,
    padNum: number
) => {
    const currentTrack = viewModel.controller.currentTrack;
    if (currentTrack === padNum) return PAD_LUMINANCE_2;
    return PAD_LUMINANCE_0;
};

const muteLuminance: LuminanceFn = (viewModel: ViewModel, padNum: number) => {
    const track = viewModel.controller.patsh.tracks[padNum];
    if (viewModel.patsh.isNotePadPlaying(padNum)) return PAD_LUMINANCE_2;
    if (track.muted && !track.soloed) return PAD_LUMINANCE_0;
    return PAD_LUMINANCE_1;
};

const soloLuminance: LuminanceFn = (viewModel: ViewModel, padNum: number) => {
    const track = viewModel.controller.patsh.tracks[padNum];
    if (viewModel.patsh.isNotePadPlaying(padNum)) return PAD_LUMINANCE_2;
    if (track.soloed) return PAD_LUMINANCE_1;
    return PAD_LUMINANCE_0;
};

const LUMINANCE_FNS: Record<PadMode["name"], LuminanceFn> = {
    notePlay: otherLuminance,
    noteEdit: noteEditLuminance,
    fx: otherLuminance,
    perf: otherLuminance,
    patternSelect: otherLuminance,
    trackSelect: trackSelectLuminance,
    mute: muteLuminance,
    solo: soloLuminance,
};

// =============================================================================
const computeLuminance = (viewModel: ViewModel, padNum: number) => {
    if (viewModel.isNotePadStruck(padNum)) return PAD_LUMINANCE_4;

    const padMode = viewModel.controller.padMode.name;
    const luminanceFn = LUMINANCE_FNS[padMode];
    if (!luminanceFn) {
        console.warn(`No luminance function defined for pad mode: ${padMode}`);
        return PAD_LUMINANCE_0;
    }
    return luminanceFn(viewModel, padNum);
};

// =============================================================================
// Pad Color Computation
// =============================================================================
export const computeNotePadColor = (viewModel: ViewModel, padNum: number) => {
    const hue = viewModel.controller.padMode.hue;
    const luminance = computeLuminance(viewModel, padNum);
    return `hsl(${hue}, ${PAD_SATURATION}%, ${luminance}%)`;
};
