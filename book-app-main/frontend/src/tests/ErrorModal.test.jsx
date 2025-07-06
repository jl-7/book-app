import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ErrorModal from "../components/ErrorModal";

describe("ErrorModal", () => {
  it("renders the error message when show is true", () => {
    render(
      <ErrorModal
        show={true}
        message="Something went wrong"
        handleClose={() => {}}
      />
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("does not render when show is false", () => {
    const { queryByText } = render(
      <ErrorModal show={false} message="Hidden error" handleClose={() => {}} />
    );

    expect(queryByText("Hidden error")).not.toBeInTheDocument();
    expect(queryByText("Error")).not.toBeInTheDocument();
  });

  it("calls handleClose when close button is clicked", async () => {
    const handleClose = vi.fn();

    render(
      <ErrorModal
        show={true}
        message="Closing test"
        handleClose={handleClose}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeBtn);

    expect(handleClose).toHaveBeenCalled();
  });
});
