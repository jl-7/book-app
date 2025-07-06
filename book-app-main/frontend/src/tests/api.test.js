import {
  fetchBooks,
  fetchBooksWithFilters,
  postBook,
  deleteBookApi,
  updateAuthorApi,
} from "../api";
import { book_properties } from "../constants/BookProperties";
import { beforeEach, describe, expect, it, vi } from "vitest";

global.fetch = vi.fn();

describe("API functions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("fetchBooks: returns data on success", async () => {
    const mockData = [{ id: 1, title: "Book A" }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const data = await fetchBooks();
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/books?sortBy=created_at&sortOrder=desc"
    );
    expect(data).toEqual(mockData);
  });

  it("fetchBooks: throws error on failure", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Error occurred" }),
    });

    await expect(fetchBooks()).rejects.toThrow("Error occurred");
  });

  it("fetchBooksWithFilters: passes correct query params", async () => {
    const mockData = [{ id: 1, title: "Filtered Book" }];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const result = await fetchBooksWithFilters(
      "A",
      book_properties.TITLE,
      "title",
      "asc"
    );

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/books?searchTitle=A&sortBy=title&sortOrder=asc"
    );
    expect(result).toEqual(mockData);
  });

  it("postBook: sends correct request and returns response", async () => {
    const newBook = { title: "New Book", author: "Author A" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => newBook,
    });

    const result = await postBook(newBook);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newBook),
    });
    expect(result).toEqual(newBook);
  });

  it("deleteBookApi: sends DELETE and returns response", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => 1,
    });

    const result = await deleteBookApi(5);
    expect(fetch).toHaveBeenCalledWith("http://localhost:8000/api/books/5", {
      method: "DELETE",
      headers: { Accept: "application/json" },
    });
    expect(result).toBe(1);
  });

  it("updateAuthorApi: sends PUT request and returns response", async () => {
    const update = { author: "Updated Author" };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => 1,
    });

    const result = await updateAuthorApi(3, update);
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/books/author/3",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(update),
      }
    );
    expect(result).toBe(1);
  });
});
