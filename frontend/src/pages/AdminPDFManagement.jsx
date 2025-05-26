import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Edit,
  Trash2,
  User,
  FileText,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";

const AdminPDFManagement = () => {
  const [pdfs, setPdfs] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();

  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllData();
  }, [currentPage, searchTerm]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [pdfsRes, usersRes] = await Promise.all([
        axiosInstance.get(
          `/pdfs/pdfs?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
        ),
        axiosInstance.get("/pdfs/users"),
      ]);

      setPdfs(pdfsRes.data.pdfs);
      setUsers(usersRes.data.users);
      setTotalPages(pdfsRes.data.totalPages);
    } catch (error) {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAllData();
  };

  const handleEdit = (pdf) => {
    setSelectedPdf(pdf);
    setEditedData({
      title: pdf.title,
      category: pdf.category,
      courseName: pdf.courseName,
      instituteName: pdf.instituteName,
    });
    setEditMode(true);
  };

  const handleSave = async () => {
    try {
      await axiosInstance.put(`/pdfs/pdf/${selectedPdf._id}`, editedData);
      toast.success("PDF updated successfully");

      setEditMode(false);
      fetchAllData();
    } catch (error) {
      toast.error("Failed to update PDF");
    }
  };

  const handleDeletePdf = async (pdfId) => {
    if (window.confirm("Are you sure you want to delete this PDF?")) {
      try {
        await axiosInstance.delete(`/pdfs/pdf/${pdfId}`);
        toast.success("PDF deleted successfully");
        fetchAllData();
      } catch (error) {
        toast.error("Failed to delete PDF");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this user and all their PDFs?"
      )
    ) {
      try {
        await axiosInstance.delete(`/pdfs/users/${userId}`);
        toast.success("User deleted successfully");
        fetchAllData();
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const getUserById = (userId) => {
    return users.find((user) => user._id === userId) || {};
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " Bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin PDF Management</h1>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <form onSubmit={handleSearch} className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search PDFs by title, course, or uploader..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button> */}
        </form>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit PDF Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editedData.title}
                  onChange={(e) =>
                    setEditedData({ ...editedData, title: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  value={editedData.category}
                  onChange={(e) =>
                    setEditedData({ ...editedData, category: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="note">Note</option>
                  <option value="slide">Slide</option>
                  <option value="lab_report">Lab Report</option>
                  <option value="prev_question">Previous Question</option>
                  <option value="book">Book</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={editedData.courseName}
                  onChange={(e) =>
                    setEditedData({ ...editedData, courseName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Institute Name
                </label>
                <input
                  type="text"
                  value={editedData.instituteName}
                  onChange={(e) =>
                    setEditedData({
                      ...editedData,
                      instituteName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2">Loading PDFs...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PDF Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pdfs.length > 0 ? (
                    pdfs.map((pdf) => {
                      return (
                        <tr key={pdf._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <FileText className="text-blue-600" size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {pdf.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {pdf.category} • {pdf.courseName} •{" "}
                                  {formatFileSize(pdf.size)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(pdf.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEdit(pdf)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Edit PDF"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleDeletePdf(pdf._id)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete PDF"
                              >
                                <Trash2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(pdf.userId)}
                                className="text-red-600 hover:text-red-900 border-l pl-2 border-gray-200"
                                title="Delete User"
                              >
                                <User size={18} className="inline mr-1" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No PDFs found matching your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pdfs.length > 0 && (
              <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, pdfs.length)}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">
                        {totalPages * itemsPerPage}
                      </span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                      >
                        <ArrowLeft size={16} />
                      </button>
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNum
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                      )}
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium hover:bg-gray-50"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPDFManagement;
