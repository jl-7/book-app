import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookForm from "../components/BookForm";

describe("BookForm", () => {
  let mockOnSubmit, mockHandleError;

  beforeEach(() => {
    mockOnSubmit = vi.fn();
    mockHandleError = vi.fn();
    render(<BookForm onSubmit={mockOnSubmit} handleError={mockHandleError} />);
  });

  it("renders the form fields and button", () => {
    expect(screen.getByLabelText("titleInput")).toBeInTheDocument();
    expect(screen.getByLabelText("authorInput")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
  });

  it("calls onSubmit with valid data", async () => {
    const titleInput = screen.getByLabelText("titleInput");
    const authorInput = screen.getByLabelText("authorInput");
    const submitButton = screen.getByLabelText("addButton");

    await userEvent.type(titleInput, "1984");
    await userEvent.type(authorInput, "George Orwell");
    await userEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      title: "1984",
      author: "George Orwell",
    });
    expect(mockHandleError).not.toHaveBeenCalled();
  });

  it("shows error if both fields are empty", async () => {
    const submitButton = screen.getByLabelText("addButton");

    await userEvent.click(submitButton);

    expect(mockHandleError).toHaveBeenCalledWith(
      "Please enter both title and author."
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows error if title is empty or whitespace", async () => {
    const titleInput = screen.getByLabelText("titleInput");
    const submitButton = screen.getByLabelText("addButton");

    await userEvent.click(submitButton);

    expect(mockHandleError).toHaveBeenCalledWith(
      "Please enter both title and author."
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();

    await userEvent.type(titleInput, " ");
    await userEvent.click(submitButton);

    expect(mockHandleError).toHaveBeenCalledWith(
      "Please enter both title and author."
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("shows error if author is empty or whitespace", async () => {
    const authorInput = screen.getByLabelText("authorInput");
    const submitButton = screen.getByLabelText("addButton");

    await userEvent.click(submitButton);

    expect(mockHandleError).toHaveBeenCalledWith(
      "Please enter both title and author."
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();

    await userEvent.type(authorInput, " ");
    await userEvent.click(submitButton);

    expect(mockHandleError).toHaveBeenCalledWith(
      "Please enter both title and author."
    );
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it("clears the form after successful submission", async () => {
    const titleInput = screen.getByLabelText("titleInput");
    const authorInput = screen.getByLabelText("authorInput");
    const submitButton = screen.getByLabelText("addButton");

    await userEvent.type(titleInput, "Clean Code");
    await userEvent.type(authorInput, "Robert C. Martin");
    await userEvent.click(submitButton);

    expect(titleInput.value).toBe("");
    expect(authorInput.value).toBe("");
  });
});
