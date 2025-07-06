import { useState } from "react";
import { Button, ButtonGroup, FormControl, Table } from "react-bootstrap";

function BookTable({ books = [], onDelete, onUpdate, handleError }) {
  const [editingId, setEditingId] = useState(null);
  const [authorEdit, setAuthorEdit] = useState("");

  const startEditing = (book) => {
    setEditingId(book.id);
    setAuthorEdit(book.author);
  };

  const saveAuthor = (book) => {
    if (authorEdit.trim() === "") {
      handleError("Please enter an author.");
      return;
    }
    onUpdate(book.id, { author: authorEdit });
    setEditingId(null);
  };

  return (
    <Table bordered className="bg-white rounded shadow-sm">
      <thead>
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th style={{ width: 140 }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {books.map((book) => (
          <tr key={book.id}>
            <td>{book.title}</td>
            <td>
              {editingId === book.id ? (
                <FormControl
                  aria-label="editForm"
                  type="text"
                  value={authorEdit}
                  onChange={(e) => setAuthorEdit(e.target.value)}
                  autoFocus
                />
              ) : (
                book.author
              )}
            </td>
            <td>
              {editingId === book.id ? (
                <ButtonGroup>
                  <Button
                    aria-label="saveButton"
                    variant="outline-primary"
                    onClick={() => saveAuthor(book)}
                  >
                    Save
                  </Button>
                  <Button
                    aria-label="cancelButton"
                    variant="outline-danger"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </Button>
                </ButtonGroup>
              ) : (
                <ButtonGroup>
                  <Button
                    aria-label="editButton"
                    variant="outline-primary"
                    onClick={() => startEditing(book)}
                  >
                    Edit
                  </Button>
                  <Button
                    aria-label="deleteButton"
                    variant="outline-danger"
                    onClick={() => onDelete(book.id)}
                  >
                    <i className="bi bi-trash" />
                  </Button>
                </ButtonGroup>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default BookTable;
