import PDFListItem from "./PDFListItem";

const PDFList = ({
  pdfs,
  expandedPdf,
  togglePdfView,
  handleDelete,
  formatFileSize,
}) => {
  if (pdfs.length === 0) {
    return (
      <p className="text-gray-500 text-center py-8">No PDFs uploaded yet</p>
    );
  }

  return (
    <div className="space-y-4">
      {pdfs.map((pdf) => (
        <PDFListItem
          key={pdf._id}
          pdf={pdf}
          expandedPdf={expandedPdf}
          togglePdfView={togglePdfView}
          handleDelete={handleDelete}
          formatFileSize={formatFileSize}
        />
      ))}
    </div>
  );
};

export default PDFList;
