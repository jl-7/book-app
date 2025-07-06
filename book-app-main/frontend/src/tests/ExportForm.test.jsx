import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExportForm from "../components/ExportForm";
import { book_properties } from "../constants/BookProperties";

vi.mock("export-from-json", () => {
  const mockExport = vi.fn();
  mockExport.types = { csv: "csv", xml: "xml" };

  return {
    __esModule: true,
    default: mockExport,
  };
});
import exportFromJSON from "export-from-json";

const mockBooks = [
  { id: 1, title: "Book A", author: "Author A" },
  { id: 2, title: "Book B", author: "Author B" },
];

describe("ExportForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders export dropdown and buttons", () => {
    render(<ExportForm books={mockBooks} />);

    expect(screen.getByLabelText("exportSelect")).toBeInTheDocument();
    expect(screen.getByLabelText("exportCsvButton")).toBeInTheDocument();
    expect(screen.getByLabelText("exportXmlButton")).toBeInTheDocument();
  });

  it("exports all fields as csv", async () => {
    render(<ExportForm books={mockBooks} />);

    const exportCsvBtn = screen.getByLabelText("exportCsvButton");
    await userEvent.click(exportCsvBtn);

    expect(exportFromJSON).toHaveBeenCalledWith({
      data: [
        { title: "Book A", author: "Author A" },
        { title: "Book B", author: "Author B" },
      ],
      fileName: "books",
      exportType: "csv",
    });
  });

  it("exports all fields as xml", async () => {
    render(<ExportForm books={mockBooks} />);

    const exportXmlBtn = screen.getByLabelText("exportXmlButton");
    await userEvent.click(exportXmlBtn);

    expect(exportFromJSON).toHaveBeenCalledWith({
      data: [
        { title: "Book A", author: "Author A" },
        { title: "Book B", author: "Author B" },
      ],
      fileName: "books",
      exportType: "xml",
    });
  });

  it("exports only titles to csv", async () => {
    render(<ExportForm books={mockBooks} />);

    const select = screen.getByLabelText("exportSelect");
    await userEvent.selectOptions(select, book_properties.TITLE);

    const exportCsvBtn = screen.getByLabelText("exportCsvButton");
    await userEvent.click(exportCsvBtn);

    expect(exportFromJSON).toHaveBeenCalledWith({
      data: [{ title: "Book A" }, { title: "Book B" }],
      fileName: "books",
      exportType: "csv",
    });
  });

  it("exports only titles to xml", async () => {
    render(<ExportForm books={mockBooks} />);

    const select = screen.getByLabelText("exportSelect");
    await userEvent.selectOptions(select, book_properties.TITLE);

    const exportXmlBtn = screen.getByLabelText("exportXmlButton");
    await userEvent.click(exportXmlBtn);

    expect(exportFromJSON).toHaveBeenCalledWith({
      data: [{ title: "Book A" }, { title: "Book B" }],
      fileName: "books",
      exportType: "xml",
    });
  });

  it("exports only authors to csv", async () => {
    render(<ExportForm books={mockBooks} />);

    const select = screen.getByLabelText("exportSelect");
    await userEvent.selectOptions(select, book_properties.AUTHOR);

    const exportCsvBtn = screen.getByLabelText("exportCsvButton");

    await userEvent.click(exportCsvBtn);

    expect(exportFromJSON).toHaveBeenCalledWith({
      data: [{ author: "Author A" }, { author: "Author B" }],
      fileName: "books",
      exportType: "csv",
    });
  });

  it("exports only authors to xml", async () => {
    render(<ExportForm books={mockBooks} />);

    const select = screen.getByLabelText("exportSelect");
    await userEvent.selectOptions(select, book_properties.AUTHOR);

    const exportXmlBtn = screen.getByLabelText("exportXmlButton");

    await userEvent.click(exportXmlBtn);

    expect(exportFromJSON).toHaveBeenCalledWith({
      data: [{ author: "Author A" }, { author: "Author B" }],
      fileName: "books",
      exportType: "xml",
    });
  });
});
