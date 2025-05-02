import { Download } from "lucide-react";

const PDFViewer = ({ pdf }) => {
  return (
    <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-100">
      <iframe src={pdf.url} width="100%" height="100%" className="border-none">
        <div className="flex flex-col items-center justify-center p-4">
          <p className="mb-4 text-gray-700">
            PDF preview not available in your browser.
          </p>
          <a
            href={pdf.url}
            download
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Download className="mr-2" />
            Download PDF
          </a>
        </div>
      </iframe>
    </div>
  );
};

export default PDFViewer;
