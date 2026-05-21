import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { render } from "@testing-library/react";

import { BrowserRouter } from "react-router-dom";

export function renderWithProviders(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </BrowserRouter>,
  );
}
