import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

vi.mock("../api", async () => {
  const actual = await vi.importActual("../api");
  return {
    ...actual,
    fetchBooks: vi.fn(),
    fetchBooksWithFilters: vi.fn(),
    postBook: vi.fn(),
    deleteBookApi: vi.fn(),
    updateAuthorApi: vi.fn(),
  };
});

import {
  fetchBooks,
  fetchBooksWithFilters,
  postBook,
  deleteBookApi,
  updateAuthorApi,
} from "../api";

const mockBooks = [
  { id: 1, title: "Book A", author: "Author A" },
  { id: 2, title: "Book B", author: "Author B" },
];

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and displays books on mount", async () => {
    fetchBooks.mockResolvedValueOnce(mockBooks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Book A")).toBeInTheDocument();
      expect(screen.getByText("Author A")).toBeInTheDocument();
      expect(screen.getByText("Book B")).toBeInTheDocument();
      expect(screen.getByText("Author B")).toBeInTheDocument();
    });

    expect(fetchBooks).toHaveBeenCalled();
  });

  it("displays error modal on fetchBooks failure", async () => {
    fetchBooks.mockRejectedValueOnce(new Error("Failed to load"));

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText("Failed to load")).toBeInTheDocument()
    );

    expect(screen.getByText("Error")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeBtn);

    expect(screen.queryByText("Error")).not.toBeInTheDocument();
  });

  it("adds a book using BookForm", async () => {
    fetchBooks.mockResolvedValueOnce(mockBooks);
    postBook.mockResolvedValueOnce();
    fetchBooksWithFilters.mockResolvedValueOnce(mockBooks);

    render(<App />);

    await screen.findByText("Book A");

    const titleInput = screen.getByLabelText("titleInput");
    const authorInput = screen.getByLabelText("authorInput");
    const submitButton = screen.getByLabelText("addButton");

    await userEvent.type(titleInput, "Book C");
    await userEvent.type(authorInput, "Author C");
    await userEvent.click(submitButton);

    expect(postBook).toHaveBeenCalledWith({
      title: "Book C",
      author: "Author C",
    });

    expect(fetchBooksWithFilters).toHaveBeenCalledWith("", "", "", "desc");
  });

  it("deletes a book", async () => {
    fetchBooks.mockResolvedValueOnce(mockBooks);
    deleteBookApi.mockResolvedValueOnce(1);

    render(<App />);
    await screen.findByText("Book A");

    const deleteButton = screen.getAllByLabelText("deleteButton")[0];

    await userEvent.click(deleteButton);

    expect(deleteBookApi).toHaveBeenCalledWith(1);
    expect(screen.queryByText("Book A")).not.toBeInTheDocument();
    expect(screen.queryByText("Author A")).not.toBeInTheDocument();
    expect(screen.queryByText("Book B")).toBeInTheDocument();
    expect(screen.queryByText("Author B")).toBeInTheDocument();
  });

  it("updates author on save", async () => {
    fetchBooks.mockResolvedValueOnce(mockBooks);
    updateAuthorApi.mockResolvedValueOnce(1);

    render(<App />);
    await screen.findByText("Book A");

    const editButton = screen.getAllByLabelText("editButton")[0];
    await userEvent.click(editButton);

    const input = screen.getByLabelText("editForm");
    await userEvent.clear(input);
    await userEvent.type(input, "New Author");

    const saveButton = screen.getByLabelText("saveButton");
    await userEvent.click(saveButton);

    expect(updateAuthorApi).toHaveBeenCalledWith(1, { author: "New Author" });
    expect(fetchBooksWithFilters).toHaveBeenCalledWith("", "", "", "desc");
  });

  it("searches for book", async () => {
    fetchBooks.mockResolvedValueOnce(mockBooks);
    fetchBooksWithFilters.mockResolvedValueOnce([
      { id: 2, title: "Book B", author: "Author B" },
    ]);

    render(<App />);
    await screen.findByText("Book A");

    const searchInput = screen.getByLabelText("searchTerm");
    const searchField = screen.getByLabelText("searchField");
    const goButton = screen.getByLabelText("goButton");

    await userEvent.type(searchInput, "Book B");
    await userEvent.selectOptions(searchField, "title");
    await userEvent.click(goButton);

    expect(fetchBooksWithFilters).toHaveBeenCalledWith(
      "Book B",
      "title",
      "",
      "desc"
    );
  });

  it("sorts books", async () => {
    fetchBooks.mockResolvedValueOnce(mockBooks);
    fetchBooksWithFilters.mockResolvedValueOnce([
      { id: 1, title: "Book A", author: "Author A" },
      { id: 2, title: "Book B", author: "Author B" },
    ]);

    render(<App />);
    await screen.findByText("Book A");

    const sortBy = screen.getByLabelText("sortBy");
    const goButton = screen.getByLabelText("goButton");

    await userEvent.selectOptions(sortBy, "author");
    await userEvent.click(goButton);
    expect(fetchBooksWithFilters).toHaveBeenCalledWith("", "", "author", "asc");
  });
});
