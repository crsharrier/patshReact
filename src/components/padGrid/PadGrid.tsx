import { useEffect, useRef, type RefObject } from "react";
import { ViewModel } from "@/lib/patsh/view/viewModel";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/lib/patsh/config";
import { drawPadGrid } from "../../lib/patsh/view/draw";
import { usePatshState } from "@/lib/patsh/usePatshState";
import { Button } from "../ui/button";
import { Play, StopCircle } from "lucide-react";
import { Input } from "../ui/input";

export type PadGridProps = {
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
export function PadGrid({ viewModel }: PadGridProps) {
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

    const patshState = usePatshState(viewModel);

    // const [bpm, setBpm] = useState(viewModel.patsh.bpm);

    const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newBpm = parseInt(e.target.value, 10);
        if (!isNaN(newBpm)) {
            patshState.setBpm(newBpm);
        }
    };

    const handlePressPlayPause = async () => {
        await patshState.playPause();
    };

    return (
        <div className="canvas-container">
            <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ background: "#1e293b", borderRadius: "8px" }}
            />

            <div className="mt-4 flex space-x-4">
                <Button onClick={handlePressPlayPause}>
                    {patshState.playbackState === "started" ? (
                        <Play />
                    ) : (
                        <StopCircle />
                    )}
                </Button>

                <Input
                    type="number"
                    className="w-min"
                    step="5"
                    value={patshState.bpm}
                    onChange={handleBpmChange}
                ></Input>
            </div>
        </div>
    );
}
