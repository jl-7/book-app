import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Filters from "../components/Filters";

describe("Filters", () => {
  let onSubmit;

  beforeEach(() => {
    onSubmit = vi.fn();
  });

  it("renders inputs and button", () => {
    render(<Filters onSubmit={onSubmit} refreshBooks={false} />);

    expect(screen.getByLabelText(/searchterm/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/searchfield/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sortby/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/gobutton/i)).toBeInTheDocument();
  });

  it("calls onSubmit with default values on initial render", () => {
    render(<Filters onSubmit={onSubmit} refreshBooks={true} />);

    expect(onSubmit).toHaveBeenCalledWith("", "", "", "desc");
  });

  it("calls onSubmit with user input values when 'Go' button is clicked", async () => {
    render(<Filters onSubmit={onSubmit} refreshBooks={false} />);

    const searchInput = screen.getByLabelText(/searchterm/i);
    const searchField = screen.getByLabelText(/searchfield/i);
    const sortBy = screen.getByLabelText(/sortby/i);
    const goButton = screen.getByLabelText(/gobutton/i);

    await userEvent.type(searchInput, "gatsby");
    await userEvent.selectOptions(searchField, "title");
    await userEvent.selectOptions(sortBy, "author");
    await userEvent.click(goButton);

    expect(onSubmit).toHaveBeenCalledWith("gatsby", "title", "author", "asc");
  });

  it("translates 'any' search field and 'default' sort correctly", async () => {
    render(<Filters onSubmit={onSubmit} refreshBooks={false} />);

    const goButton = screen.getByLabelText(/gobutton/i);
    await userEvent.click(goButton);

    expect(onSubmit).toHaveBeenCalledWith("", "", "", "desc");
  });
});
