import { useState } from "react";
import { Upload, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";

const PDFUploadForm = ({ onUploadSuccess }) => {
  const { authUser } = useAuthStore();
  const [title, setTitle] = useState("");
  const [courseName, setCourseName] = useState("");
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("note");
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    { value: "note", label: "Note" },
    { value: "slide", label: "Slide" },
    { value: "chowtha", label: "Chowtha" },
    { value: "lab_report", label: "Lab Report" },
    { value: "prev_question", label: "prev_question" },
    { value: "book", label: "Book" },
    { value: "other", label: "other" },
  ];

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("title", title || file.name);
    formData.append("courseName", courseName);
    formData.append("pdf", file);
    formData.append("category", category);
    formData.append("instituteName", authUser?.instituteName || "University");
    // formData.append("userId", authUser?._id);

    try {
      setIsUploading(true);
      const { data } = await axiosInstance.post("/uploads/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onUploadSuccess(data.data);
      setTitle("");
      setCourseName("");
      setFile(null);
      setCategory("note");
      toast.success("PDF uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload PDF");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-3">
        Upload Your PDF
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Title Input */}
          <div className="flex-1">
            <label
              className="block text-gray-700 text-xs font-medium mb-1"
              htmlFor="title"
            >
              Title (optional)
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="PDF title"
            />
          </div>

          {/* Course Name Input */}
          <div className="flex-1">
            <label
              className="block text-gray-700 text-xs font-medium mb-1"
              htmlFor="courseName"
            >
              Full Course Name
            </label>
            <input
              id="courseName"
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter course name"
              required
            />
          </div>

          {/* Category Select */}
          <div className="w-full sm:w-40">
            <label
              className="block text-gray-700 text-xs font-medium mb-1"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* File Input */}
          <div className="w-full sm:w-40">
            <label
              className="block text-gray-700 text-xs font-medium mb-1"
              htmlFor="pdf"
            >
              PDF File
            </label>
            <label
              htmlFor="pdf"
              className={`flex items-center justify-center w-full h-10 border-2 border-dashed rounded-lg cursor-pointer ${
                file
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              {file ? (
                <div className="flex items-center px-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-xs truncate max-w-[100px]">
                    {file.name}
                  </span>
                </div>
              ) : (
                <div className="flex items-center px-2">
                  <Upload className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-xs">Choose file</span>
                </div>
              )}
              <input
                id="pdf"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!file || isUploading}
            className={`w-30 bg-blue-600 text-white py-1.5 px-3 text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
              !file || isUploading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isUploading ? (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin w-4 h-4 mr-1.5" />
                Uploading...
              </div>
            ) : (
              "Upload PDF"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PDFUploadForm;
