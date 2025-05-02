import {
  FileText,
  Trash2,
  Download,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import PDFViewer from "./PDFViewer";

const PDFListItem = ({
  pdf,
  expandedPdf,
  togglePdfView,
  handleDelete,
  formatFileSize,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* PDF Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50">
        <div className="flex items-center">
          <FileText className="w-5 h-5 text-blue-500 mr-3" />
          <div>
            <h3 className="text-blue-600 font-medium">{pdf.title}</h3>
            <p className="text-xs text-gray-500">
              {formatFileSize(pdf.size)} •{" "}
              {new Date(pdf.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => togglePdfView(pdf._id)}
            className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
            title={expandedPdf === pdf._id ? "Collapse PDF" : "View PDF"}
          >
            {expandedPdf === pdf._id ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          <a
            href={pdf.url}
            download
            className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50"
            title="Download PDF"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={() => handleDelete(pdf._id)}
            className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
            title="Delete PDF"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      {expandedPdf === pdf._id && <PDFViewer pdf={pdf} />}
    </div>
  );
};

export default PDFListItem;
