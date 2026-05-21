import { screen } from "@testing-library/react";

import Button from "../Button";

import { renderWithProviders } from "../../../../test/utils.jsx";

describe("Button", () => {
  it("renders children", () => {
    renderWithProviders(<Button>Submit</Button>);

    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    renderWithProviders(<Button loading>Submit</Button>);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
