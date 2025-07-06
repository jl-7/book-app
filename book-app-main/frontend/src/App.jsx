import { useEffect, useState } from "react";
import BookForm from "./components/BookForm";
import BookTable from "./components/BookTable";
import ExportForm from "./components/ExportForm";
import Filters from "./components/Filters";
import "./App.css";
import {
  fetchBooks,
  postBook,
  deleteBookApi,
  updateAuthorApi,
  fetchBooksWithFilters,
} from "./api";
import ErrorModal from "./components/ErrorModal";

function App() {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshBooks, setRefreshBooks] = useState(true);

  useEffect(() => {
    fetchBooks()
      .then((res) => {
        setBooks(res);
      })
      .catch((err) => {
        console.error(err);
        handleError(err.message);
      });
  }, []);

  const submitFilters = async (search, searchField, sortBy, sortOrder) => {
    try {
      const result = await fetchBooksWithFilters(
        search,
        searchField,
        sortBy,
        sortOrder
      );
      setBooks(result);
    } catch (err) {
      console.error(err);
      handleError(err.message);
    }
  };

  const addBook = async (book) => {
    try {
      await postBook(book);
      setRefreshBooks(!refreshBooks);
    } catch (err) {
      console.error(err);
      handleError(err.message);
    }
  };

  const deleteBook = async (id) => {
    try {
      const res = await deleteBookApi(id);
      if (res > 0) {
        setBooks((prev) => prev.filter((b) => b.id !== id));
      } else {
        handleError("No books were updated");
      }
    } catch (err) {
      console.error(err);
      handleError(err.message);
    }
  };

  const updateAuthor = async (id, updateData) => {
    try {
      const res = await updateAuthorApi(id, updateData);
      if (res > 0) {
        setBooks((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, author: updateData.author } : b
          )
        );
        setRefreshBooks(!refreshBooks);
      } else {
        handleError("No books were updated");
      }
    } catch (err) {
      console.error(err);
      handleError(err.message);
    }
  };

  const handleError = (message) => {
    setErrorMessage(message);
    setShowModal(true);
  };

  return (
    <div className="w-150 p-3">
      <ErrorModal
        message={errorMessage}
        show={showModal}
        handleClose={(e) => setShowModal(false)}
      />
      <BookForm onSubmit={addBook} handleError={handleError} />
      <div className="p-4 border rounded bg-light shadow-sm">
        <Filters onSubmit={submitFilters} refreshBooks={refreshBooks} />
        <ExportForm books={books} />
      </div>
      <BookTable
        books={books}
        onDelete={deleteBook}
        onUpdate={updateAuthor}
        handleError={handleError}
      />
    </div>
  );
}

export default App;
