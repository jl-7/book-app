import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { book_properties } from "../constants/BookProperties";

function Filters({ onSubmit, refreshBooks }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState("any");
  const [sortBy, setSortBy] = useState("default");

  const handleSubmit = (e) => {
    e.preventDefault();
    submit();
  };

  const submit = () => {
    onSubmit(
      searchTerm,
      searchField === "any" ? "" : searchField,
      sortBy === "default" ? "" : sortBy,
      sortBy === "default" ? "desc" : "asc"
    );
  };

  useEffect(() => {
    submit();
  }, [refreshBooks]);

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Form.Row} className="mb-4">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <Form.Label htmlFor="searchTerm" className="mb-0">
              Search:
            </Form.Label>
            <Form.Control
              aria-label="searchTerm"
              id="searchTerm"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-auto flex-grow-1"
              placeholder="Search books..."
            />

            <Form.Label htmlFor="searchField" className="mb-0">
              Search Field:
            </Form.Label>
            <Form.Select
              aria-label="searchField"
              id="searchField"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-auto"
            >
              <option value="any">Any</option>
              <option value={book_properties.TITLE}>Titles</option>
              <option value={book_properties.AUTHOR}>Authors</option>
            </Form.Select>
            <Form.Label htmlFor="sort" className="mb-0">
              Sort By:
            </Form.Label>
            <Form.Select
              aria-label="sortBy"
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-auto"
            >
              <option value="default">Default</option>
              <option value={book_properties.TITLE}>Titles</option>
              <option value={book_properties.AUTHOR}>Authors</option>
            </Form.Select>
            <Button
              aria-label="goButton"
              variant="outline-primary"
              type="submit"
            >
              Go
            </Button>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default Filters;
