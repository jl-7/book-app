import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookTable from "../components/BookTable";

describe("BookTable", () => {
  const books = [
    { id: 1, title: "Book A", author: "Author A" },
    { id: 2, title: "Book B", author: "Author B" },
  ];

  let onDelete, onUpdate, handleError;

  beforeEach(() => {
    onDelete = vi.fn();
    onUpdate = vi.fn();
    handleError = vi.fn();
    render(
      <BookTable
        books={books}
        onDelete={onDelete}
        onUpdate={onUpdate}
        handleError={handleError}
      />
    );
  });

  it("renders book titles and authors", () => {
    expect(screen.getByText("Book A")).toBeInTheDocument();
    expect(screen.getByText("Author A")).toBeInTheDocument();
    expect(screen.getByText("Book B")).toBeInTheDocument();
    expect(screen.getByText("Author B")).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", async () => {
    const deleteButtons = screen.getAllByLabelText("deleteButton");

    await userEvent.click(deleteButtons[1]);

    expect(onDelete).toHaveBeenCalledWith(2);
  });

  it("enters edit mode when Edit is clicked", async () => {
    const editButtons = screen.getAllByLabelText("editButton");

    await userEvent.click(editButtons[0]);

    expect(screen.getByLabelText("editForm")).toBeInTheDocument();
  });

  it("saves author and calls onUpdate", async () => {
    const editButton = screen.getAllByLabelText("editButton")[0];
    await userEvent.click(editButton);

    const input = screen.getByDisplayValue("Author A");
    await userEvent.clear(input);
    await userEvent.type(input, "New Author");

    const saveButton = screen.getByLabelText("saveButton");
    await userEvent.click(saveButton);

    expect(onUpdate).toHaveBeenCalledWith(1, { author: "New Author" });
  });

  it("shows alert if author is empty on save", async () => {
    const editButton = screen.getAllByLabelText("editButton")[0];
    await userEvent.click(editButton);

    const input = screen.getByDisplayValue("Author A");
    await userEvent.clear(input);

    const saveButton = screen.getByLabelText("saveButton");
    await userEvent.click(saveButton);

    expect(handleError).toHaveBeenCalledWith("Please enter an author.");
    expect(onUpdate).not.toHaveBeenCalled();
  });

  it("cancels edit mode when Cancel is clicked", async () => {
    const editButton = screen.getAllByLabelText("editButton")[0];
    await userEvent.click(editButton);

    const input = screen.getByDisplayValue("Author A");
    await userEvent.clear(input);
    await userEvent.type(input, "New Author");

    expect(screen.getByDisplayValue("New Author")).toBeInTheDocument();

    const cancelButton = screen.getByLabelText("cancelButton");
    await userEvent.click(cancelButton);

    expect(screen.queryByDisplayValue("New Author")).not.toBeInTheDocument();
    expect(screen.getByText("Author A")).toBeInTheDocument();
    expect(onUpdate).not.toHaveBeenCalled();
  });
});
