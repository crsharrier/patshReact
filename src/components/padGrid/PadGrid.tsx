import { useEffect, useRef, type RefObject } from "react";
import { Button } from "../ui/button";
import { Controller } from "@/lib/patsh/controller/controller";
import { ViewModel } from "@/lib/patsh/view/viewModel";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/patsh/config";
import type { PatshCore } from "@/lib/patsh/core/patshCore";
import { drawPadGrid } from "./draw";

export type PadGridProps = {
    patsh: PatshCore;
    controller: Controller;
    viewModel: ViewModel;
};

const buildLoopRenderer = (
    canvas: HTMLCanvasElement,
    viewModel: ViewModel,
    animationRef: RefObject<number | null>
) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error("Failed to get 2D context from canvas");
    }

    const renderLoop = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        viewModel.update();
        drawPadGrid(ctx, viewModel);
        animationRef.current = requestAnimationFrame(renderLoop);
    };

    return renderLoop;
};

// =============================================================================
// Controller Component
// =============================================================================
export function PadGrid({ patsh, viewModel }: PadGridProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Main animation loop
        const renderLoop = buildLoopRenderer(canvas, viewModel, animationRef);

        // Start the loop
        animationRef.current = requestAnimationFrame(renderLoop);

        // Clean up when the component unmounts
        return () => {
            if (animationRef.current !== null) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [viewModel]);

    return (
        <div className="canvas-container">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ background: "#1e293b", borderRadius: "8px" }}
            />
            <Button className="mt-4" onClick={() => void patsh.playPause()}>
                {patsh.playbackState === "started" ? "Stop" : "Play"}
            </Button>
        </div>
    );
}
