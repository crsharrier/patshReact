import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ViewModel } from "./lib/patsh/view/viewModel";
import { Controller } from "./lib/patsh/controller/controller";
import { PatshCore } from "./lib/patsh/core/patshCore";

const rootElement = document.getElementById("root");

if (!rootElement) {
    throw new Error("Failed to find the root element");
}

const patsh = new PatshCore();
const controller = new Controller(patsh);
const viewModel = new ViewModel(controller);

ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <App patsh={patsh} controller={controller} viewModel={viewModel} />
    </React.StrictMode>
);
