import { PadGrid } from "./components/padGrid/PadGrid";
import { Controller as Controller } from "./lib/patsh/controller/controller";
import { useKeyboardInput } from "./lib/patsh/controller/keyboardInput";
import { PatshCore } from "./lib/patsh/core/patshCore";
import { ViewModel } from "./lib/patsh/view/viewModel";

function App() {
    const patsh = new PatshCore();
    const controller = new Controller();
    const viewModel = new ViewModel(controller, patsh);

    useKeyboardInput(controller);
    
    return (
        <div className="h-screen w-screen flex flex-col">
            {/* main area */}
            <div className="flex-1 flex justify-center items-center border">
                <PadGrid
                    viewModel={viewModel}
                    patsh={patsh}
                    controller={controller}
                />
            </div>
        </div>
    );
}

export default App;
