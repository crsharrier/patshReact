import { CANVAS_WIDTH, TOPBAR_HEIGHT } from "@/lib/patsh/config";
import type { ViewModel } from "@/lib/patsh/view/viewModel";

// =============================================================================
// play state
// =============================================================================
const drawPlay = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 20, y + 10);
    ctx.lineTo(x, y + 20);
    ctx.closePath();
    ctx.fill();
};

const drawStop = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, 20, 20);
};

const drawPause = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(x, y, 8, 20);
    ctx.fillRect(x + 12, y, 8, 20);
};

const drawPlayState = (
    ctx: CanvasRenderingContext2D,
    viewModel: ViewModel,
    x: number,
    y: number
) => {
    if (viewModel.patsh.playbackState === "started") {
        drawPlay(ctx, x, y);
    } else if (viewModel.patsh.playbackState === "paused") {
        drawPause(ctx, x, y);
    } else {
        drawStop(ctx, x, y);
    }
};

// =============================================================================
const writeText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number
) => {
    ctx.fillStyle = "#f1f5f9";
    ctx.font = "16px Arial";
    ctx.fillText(text, x, y);
};

// =============================================================================
// topbar
// =============================================================================
export const drawTopBar = (
    ctx: CanvasRenderingContext2D,
    viewModel: ViewModel
) => {
    ctx.fillStyle = "#334155";
    ctx.fillRect(0, 0, CANVAS_WIDTH, TOPBAR_HEIGHT);
    drawPlayState(ctx, viewModel, 20, 10);
    writeText(ctx, `Step: ${viewModel.patsh.currentStep}`, 60, 25);
    writeText(ctx, `BPM: ${viewModel.patsh.bpm}`, 60, 50);
    writeText(ctx, `Track: ${viewModel.controller.currentTrack}`, 150, 25);
    writeText(ctx, `Mode: ${viewModel.controller.padMode.name}`, 150, 50);
};
