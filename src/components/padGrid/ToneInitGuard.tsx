import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { PatshCore } from "@/lib/patsh/core/patshCore";

type ToneInitGuardProps = {
    patsh: PatshCore;
    children: ReactNode;
};

export function ToneInitGuard({ patsh, children }: ToneInitGuardProps) {
    const [isInitialized, setIsInitialized] = useState(patsh.isToneInitialized);

    useEffect(() => {
        if (isInitialized) return;

        let isCancelled = false;

        const handleUserGesture = async () => {
            await patsh.initializeTone();
            if (!isCancelled) {
                setIsInitialized(true);
            }
        };

        window.addEventListener("pointerdown", handleUserGesture, {
            once: true,
        });
        window.addEventListener("keydown", handleUserGesture, { once: true });

        return () => {
            isCancelled = true;
            window.removeEventListener("pointerdown", handleUserGesture);
            window.removeEventListener("keydown", handleUserGesture);
        };
    }, [isInitialized, patsh]);

    return (
        <div className="relative">
            {children}

            {!isInitialized && (
                <div className="absolute inset-0 z-20 flex items-center justify-center rounded-md bg-slate-950/75 backdrop-blur-sm">
                    <div className="rounded-lg border border-slate-200/20 bg-slate-900/90 px-6 py-4 text-center text-slate-100 shadow-xl">
                        <p className="text-base font-semibold">Enable audio</p>
                        <p className="mt-1 text-sm text-slate-300">
                            Click anywhere or press any key to initialize Tone.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// =============================================================================
