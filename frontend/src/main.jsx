import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SocketProvider } from "../providers/SocketProvider.jsx";
import ErrorBoundary from "./components/system/ErrorBoundary.jsx";

import App from "./App.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/QueryClient.js";

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <SocketProvider>
        <App />
      </SocketProvider>
    </ErrorBoundary>
  </QueryClientProvider>,
);
