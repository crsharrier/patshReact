import { PAD_WIDTH, PLAYHEAD_COLOR } from "@/lib/patsh/config";
import {
    modePadCodes,
    notePadCodes,
} from "@/lib/patsh/controller/keyboardInput";
import type { ViewModel } from "@/lib/patsh/view/viewModel";

function formatKeyLabel(code: string) {
    if (code.startsWith("Key")) {
        return code.slice(3);
    }

    if (code.startsWith("Digit")) {
        return code.slice(5);
    }

    if (code === "Comma") {
        return ",";
    }

    if (code === "Period") {
        return ".";
    }

    return code;
}

const notePadKeysMap = Object.fromEntries(
    Object.entries(notePadCodes).map(([code, value]) => [
        value,
        formatKeyLabel(code),
    ])
);

const drawNotePads = (ctx: CanvasRenderingContext2D, viewModel: ViewModel) => {
    for (const padKey in viewModel.notePads) {
        const pad = viewModel.notePads[padKey];
        const padInputKey = notePadKeysMap[padKey] || "";
        ctx.fillStyle = pad.color;
        ctx.fillRect(pad.x, pad.y, pad.width, pad.height);

        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(
            `${padInputKey || ""}`,
            pad.x + PAD_WIDTH - 15,
            pad.y + 15
        );
        ctx.fillText(`${pad.text1 || ""}`, pad.x + 5, pad.y + 15);
        ctx.fillText(`${pad.text2 || ""}`, pad.x + 5, pad.y + 30);
        if (Number(padKey) === viewModel.currentStep) {
            ctx.strokeStyle = PLAYHEAD_COLOR;
            ctx.lineWidth = 3;
            ctx.strokeRect(pad.x, pad.y, pad.width, pad.height);
        }
    }
};

const modePadKeysMap = Object.fromEntries(
    Object.entries(modePadCodes).map(([code, value]) => [
        value,
        formatKeyLabel(code),
    ])
);

const drawModePads = (ctx: CanvasRenderingContext2D, viewModel: ViewModel) => {
    for (const padKey in viewModel.modePads) {
        const pad = viewModel.modePads[padKey];
        const padInputKey = modePadKeysMap[padKey] || "";
        ctx.fillStyle = pad.color;
        ctx.fillRect(pad.x, pad.y, pad.width, pad.height);

        ctx.font = "12px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(
            `${padInputKey || ""}`,
            pad.x + PAD_WIDTH - 15,
            pad.y + 15
        );
        ctx.fillText(`${pad.text1 || ""}`, pad.x + 5, pad.y + 50);
        ctx.fillText(`${pad.text2 || ""}`, pad.x + 5, pad.y + 15);
    }
};

export const drawPads = (
    ctx: CanvasRenderingContext2D,
    viewModel: ViewModel
) => {
    drawNotePads(ctx, viewModel);
    drawModePads(ctx, viewModel);
};
