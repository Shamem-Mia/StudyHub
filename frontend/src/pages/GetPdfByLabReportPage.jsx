import { useState, useEffect } from "react";
import { BookOpen, Download, Heart, Search, X } from "lucide-react";
import toast from "react-hot-toast";
import PDFViewer from "../components/PDFViewer";
import { axiosInstance } from "../context/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";

const GetPdfByLabReportPage = () => {
  const { handleLike } = useAuthStore();
  const [labReports, setLabReports] = useState([]);
  const [selectedLabReport, setSelectedLabReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLabReports = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/pdfs/lab-report`);
        setLabReports(data.data.labReports);
      } catch (error) {
        toast.error("Failed to load lab reports");
      } finally {
        setLoading(false);
      }
    };

    fetchLabReports();
  }, []);

  const filteredLabReports = labReports.filter((labReport) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      labReport.instituteName.toLowerCase().includes(searchLower) ||
      labReport.courseName.toLowerCase().includes(searchLower) ||
      labReport.title.toLowerCase().includes(searchLower)
    );
  });

  const handleResetSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="text-blue-600 mr-2" size={20} />
            <h2 className="font-semibold text-xl">My Lab Reports</h2>
          </div>

          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <label className="mb-1 text-sm font-medium text-gray-700">
              Search by Institute, Course Name, or Title
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by institute, course, or title..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={handleResetSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="text-gray-400 hover:text-gray-600" size={18} />
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
          {filteredLabReports.length}{" "}
          {filteredLabReports.length === 1 ? "lab report" : "lab reports"} found
          {searchTerm && ` matching "${searchTerm}"`}
        </div>
      </div>

      {selectedLabReport ? (
        <div className="mb-8">
          <button
            onClick={() => setSelectedLabReport(null)}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">← Back to lab reports</span>
          </button>
          <PDFViewer pdf={selectedLabReport} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabReports.length > 0 ? (
            filteredLabReports.map((labReport) => (
              <div
                key={labReport._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <BookOpen className="text-blue-500 mr-2" />
                    <h3 className="font-medium text-lg truncate">
                      {labReport.title}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Institute: {labReport.instituteName}</p>
                    <p>Course: {labReport.courseName}</p>
                    <p>
                      Uploaded:{" "}
                      {new Date(labReport.createdAt).toLocaleDateString()}
                    </p>
                    <p className="flex items-center mt-1">
                      <Heart className="mr-1 text-red-500" size={16} />
                      {labReport.likes || 0} likes
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <a
                      href={labReport.url}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      <Download className="mr-1" size={16} />
                      View
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(labReport._id, setLabReports);
                      }}
                      className="px-3 py-1 flex items-center bg-red-100 text-red-600 hover:bg-red-200 text-sm rounded"
                    >
                      <Heart className="mr-1 text-red-500" size={16} />
                      Like
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">
                {searchTerm
                  ? `No lab reports found matching "${searchTerm}"`
                  : "No lab reports available"}
              </p>
              {searchTerm && (
                <button
                  onClick={handleResetSearch}
                  className="mt-4 text-blue-600 hover:text-blue-800"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GetPdfByLabReportPage;
