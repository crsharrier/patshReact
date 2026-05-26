import type { ViewModel } from "@/lib/patsh/view/viewModel";
import { drawTopBar } from "./drawTopbar";
import { drawPads } from "./drawPads";

export const drawPadGrid = (
    ctx: CanvasRenderingContext2D,
    viewModel: ViewModel
) => {
    drawTopBar(ctx, viewModel);
    drawPads(ctx, viewModel);
};
