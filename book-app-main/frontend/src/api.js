import { book_properties } from "./constants/BookProperties";

const URL = "http://localhost:8000";
export async function fetchBooks() {
  const res = await fetch(`${URL}/api/books?sortBy=created_at&sortOrder=desc`);
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to get book");
  }
  return res.json();
}

export async function fetchBooksWithFilters(
  search,
  searchField,
  sortBy,
  sortOrder
) {
  const params = new URLSearchParams();

  if (search) {
    if (searchField === book_properties.TITLE) {
      params.append("searchTitle", search);
    } else if (searchField === book_properties.AUTHOR) {
      params.append("searchAuthor", search);
    } else {
      params.append("search", search);
    }
  }

  if (sortBy) {
    params.append("sortBy", sortBy);
  }

  if (sortOrder) {
    params.append("sortOrder", sortOrder);
  }

  const res = await fetch(`${URL}/api/books?${params.toString()}`);

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to get books");
  }

  return res.json();
}
export async function postBook(book) {
  const res = await fetch(`${URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to add book");
  }
  return res.json();
}
export async function deleteBookApi(id) {
  const res = await fetch(`${URL}/api/books/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete book");
  }
  return res.json();
}
export async function updateAuthorApi(id, updateData) {
  const res = await fetch(`${URL}/api/books/author/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update author");
  }
  return res.json();
}
