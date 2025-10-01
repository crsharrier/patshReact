import Controller from "./components/controller/Controller";
import MidiSetup from "./components/MidiSetup";

function App() {
    return (
        <div className="h-screen w-screen flex flex-col">
            {/* status bar  */}
            <div className="flex justify-start p-2">
                <MidiSetup />
            </div>

            {/* main area */}
            <div className="flex-1 flex justify-center items-center border">
                <Controller />
            </div>
        </div>
    );
}

export default App;
