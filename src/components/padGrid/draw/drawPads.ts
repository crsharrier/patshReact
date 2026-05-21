import { PAD_HIGHLIGHT_COLOR, PLAYHEAD_COLOR } from "@/lib/patsh/config";
import type { ViewModel } from "@/lib/patsh/view/viewModel";

const drawNotePads = (ctx: CanvasRenderingContext2D, viewModel: ViewModel) => {
    for (const padKey in viewModel.notePads) {
        const pad = viewModel.notePads[padKey];
        ctx.fillStyle = pad.isHighlighted ? PAD_HIGHLIGHT_COLOR : pad.color;
        ctx.fillRect(pad.x, pad.y, pad.width, pad.height);

        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(`${padKey}`, pad.x + 5, pad.y + 15);
        if (Number(padKey) === viewModel.currentStep) {
            ctx.strokeStyle = PLAYHEAD_COLOR;
            ctx.lineWidth = 3;
            ctx.strokeRect(pad.x, pad.y, pad.width, pad.height);
        }
    }
};

export const drawPads = (
    ctx: CanvasRenderingContext2D,
    viewModel: ViewModel
) => {
    drawNotePads(ctx, viewModel);
};
