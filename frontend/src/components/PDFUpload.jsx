import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";
import PDFList from "./PDFList";
import PDFUploadForm from "./PDFUploadForm";
import { useAuthStore } from "../stores/useAuthStore";
import { Link } from "react-router-dom";

const PDFUpload = () => {
  const [pdfs, setPdfs] = useState([]);
  const [expandedPdf, setExpandedPdf] = useState(null);
  const { authUser } = useAuthStore();

  if (!authUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <p className="text-gray-600 mb-6">
          This page is available only for registered user!
        </p>
        <div className="flex space-x-4"></div>
      </div>
    );
  }

  // Fetch all PDFs
  const fetchPDFs = async () => {
    try {
      const response = await axiosInstance.get("/uploads/pdfs");
      setPdfs(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch PDFs");
    }
  };

  useEffect(() => {
    fetchPDFs();
  }, []);

  // Handle file delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/uploads/pdfs/${id}`);
      setPdfs(pdfs.filter((pdf) => pdf._id !== id));
      toast.success("PDF deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete PDF");
    }
  };

  // Toggle PDF view
  const togglePdfView = (id) => {
    setExpandedPdf(expandedPdf === id ? null : id);
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
  };

  // Handle upload success
  const handleUploadSuccess = (newPdf) => {
    setPdfs([newPdf, ...pdfs]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Upload</h1>

        {/* Upload Form */}
        <PDFUploadForm onUploadSuccess={handleUploadSuccess} />

        {/* PDF List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Uploaded PDFs
          </h2>
          <PDFList
            pdfs={pdfs}
            expandedPdf={expandedPdf}
            togglePdfView={togglePdfView}
            handleDelete={handleDelete}
            formatFileSize={formatFileSize}
          />
        </div>
      </div>
    </div>
  );
};

export default PDFUpload;
