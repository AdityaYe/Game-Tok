import { screen } from "@testing-library/react";

import UserLogin from "../../../../pages/auth/UserLogin";

import { renderWithProviders } from "../../../../test/utils.jsx";

describe("UserLogin", () => {
  it("renders login form", () => {
    renderWithProviders(<UserLogin />);

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });
});
