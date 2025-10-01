import { useState, useImperativeHandle, forwardRef } from "react";

interface PadProps {
    id: string;
    label: string;
}

export interface PadHandle {
    pressPad: () => void;
}

const Pad = forwardRef<PadHandle, PadProps>((props, ref) => {
    const [isFlashing, setIsFlashing] = useState(false);

    // Expose `pressPad` to the parent
    useImperativeHandle(ref, () => ({
        pressPad() {
            setIsFlashing(true);
            setTimeout(() => setIsFlashing(false), 150); // flash for 150ms
        },
    }));

    // Local click handler that calls pressPad
    const handleClick = () => {
        setIsFlashing(true);
        setTimeout(() => setIsFlashing(false), 150);
    };

    return (
        <div
            id={props.id}
            className={`size-20 p-1 ${
                isFlashing ? "bg-pad-flash" : "bg-pad-base"
            } cursor-pointer`}
            onClick={handleClick}
        >
            {props.label}
        </div>
    );
});

export default Pad;
