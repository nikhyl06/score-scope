import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot instead of ReactDOM
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "./index.css";

// Get the root element
const rootElement = document.getElementById("root");
// Create a root
const root = createRoot(rootElement);
// Render the app
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
