import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TodoProvider } from "./context/TodoContext.tsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TodoProvider>
      <App />
    </TodoProvider>
    <Toaster />
  </React.StrictMode>
);
