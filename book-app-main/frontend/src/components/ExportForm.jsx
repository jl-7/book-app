import exportFromJSON from "export-from-json";
import { useState } from "react";
import { book_properties } from "../constants/BookProperties";
import { Button, Form } from "react-bootstrap";

function ExportForm({ books }) {
  const [exportFields, setExportFields] = useState("all");

  const exportFile = (exportType) => {
    const data = getExportData();
    const fileName = "books";
    exportFromJSON({ data, fileName, exportType });
  };

  const getExportData = () => {
    switch (exportFields) {
      case book_properties.TITLE:
        return books.map((book) => {
          return { title: book.title };
        });
      case book_properties.AUTHOR:
        return books.map((book) => {
          return { author: book.author };
        });
      default:
        return books.map((book) => {
          return { title: book.title, author: book.author };
        });
    }
  };

  return (
    <div>
      <Form>
        <Form.Group className="mb-3">
          <div className="d-flex flex-wrap align-items-center gap-3">
            <Form.Label htmlFor="export" className="me-3">
              Export results:
            </Form.Label>
            <Form.Select
              aria-label="exportSelect"
              id="export"
              onChange={(e) => setExportFields(e.target.value)}
              className="w-auto"
            >
              <option value="all">All</option>
              <option value={book_properties.TITLE}>Titles</option>
              <option value={book_properties.AUTHOR}>Authors</option>
            </Form.Select>
            <Button
              aria-label="exportCsvButton"
              variant="outline-primary"
              onClick={(e) => {
                exportFile(exportFromJSON.types.csv);
              }}
            >
              Export CSV
            </Button>
            <Button
              aria-label="exportXmlButton"
              variant="outline-secondary"
              onClick={(e) => {
                exportFile(exportFromJSON.types.xml);
              }}
            >
              Export XML
            </Button>
          </div>
        </Form.Group>
      </Form>
    </div>
  );
}

export default ExportForm;
