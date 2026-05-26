import { PadGrid } from "./components/padGrid/PadGrid";
import { ToneInitGuard } from "./components/padGrid/ToneInitGuard";
import { useKeyboardInput } from "./lib/patsh/controller/keyboardInput";
import { ViewModel } from "./lib/patsh/view/viewModel";

export type AppProps = {
    viewModel: ViewModel;
};

function App({ viewModel }: AppProps) {
    useKeyboardInput(viewModel.controller);

    return (
        <div className="h-screen w-screen flex flex-col">
            {/* main area */}
            <div className="flex-1 flex justify-center items-center border">
                <ToneInitGuard patsh={viewModel.patsh}>
                    <PadGrid viewModel={viewModel} />
                </ToneInitGuard>
            </div>
        </div>
    );
}

export default App;
