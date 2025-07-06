import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function BookForm({ onSubmit, handleError }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !author.trim()) {
      handleError("Please enter both title and author.");
      return;
    }

    const newBook = { title, author };
    onSubmit(newBook);
    setTitle("");
    setAuthor("");
  };

  return (
    <div>
      <Form
        onSubmit={handleSubmit}
        className="p-3 border rounded bg-light shadow-sm"
      >
        <Form.Group className="mb-3 row align-items-center">
          <Form.Label column sm="2" className="mb-0">
            Title <span className="text-danger">*</span>
          </Form.Label>
          <div className="col-sm-10">
            <Form.Control
              aria-label="titleInput"
              type="text"
              placeholder="Enter book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3 row align-items-center">
          <Form.Label column sm="2" className="mb-0">
            Author <span className="text-danger">*</span>
          </Form.Label>
          <div className="col-sm-10">
            <Form.Control
              aria-label="authorInput"
              type="text"
              placeholder="Enter author name"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
        </Form.Group>
        <Button aria-label="addButton" type="submit" variant="outline-primary">
          Add
        </Button>
      </Form>
    </div>
  );
}

export default BookForm;
