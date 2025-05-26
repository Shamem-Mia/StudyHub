import { useState, useEffect } from "react";
import {
  BookOpen,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";

const CourseHandleByAdmin = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [courseRequests, setCourseRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("courses");
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    category: "web",
    price: 0,
    duration: 4,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: coursesData } = await axiosInstance.get("/courses/admin");
        setCourses(coursesData.data.courses);

        const { data: requestsData } = await axiosInstance.get(
          "/courses/admin/requests"
        );
        setCourseRequests(requestsData.data.requests);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredCourses = courses.filter((course) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.category.toLowerCase().includes(searchLower)
    );
  });

  const filteredRequests = courseRequests.filter((request) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.course?.title?.toLowerCase().includes(searchLower) ||
      request.user?.name?.toLowerCase().includes(searchLower) ||
      request.status.toLowerCase().includes(searchLower)
    );
  });

  const handleResetSearch = () => {
    setSearchTerm("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse({
      ...newCourse,
      [name]: value,
    });
  };

  const handleSubmitCourse = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/courses", newCourse);

      toast.promise(Promise.resolve(response), {
        loading: "Uploading course...",
        success: (res) => {
          setCourses([res.data.data.course, ...courses]);
          setNewCourse({
            title: "",
            description: "",
            category: "web",
            price: 0,
            duration: 4,
          });
          return "Course uploaded successfully!";
        },
        error: "Failed to upload course",
      });
    } catch (error) {
      console.error("Error uploading course:", error);
      toast.error(error.response?.data?.message || "Failed to upload course");
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      const response = await axiosInstance.put(
        `/courses/admin/requests/${requestId}`,
        { action }
      );
      toast.promise(Promise.resolve(response), {
        loading: "Processing request...",
        success: (res) => {
          setCourseRequests(
            courseRequests.map((req) =>
              req._id === requestId ? res.data.data.request : req
            )
          );
          return `Request ${action}d successfully!`;
        },
        error: `Failed to ${action} request`,
      });
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error(
        error.response?.data?.message || `Failed to ${action} request`
      );
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const response = await axiosInstance.delete(`/courses/${courseId}`);
      toast.promise(Promise.resolve(response), {
        loading: "Deleting course...",
        success: () => {
          setCourses(courses.filter((course) => course._id !== courseId));
          return "Course deleted successfully!";
        },
        error: "Failed to delete course",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error.response?.data?.message || "Failed to delete course");
    }
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
            <h2 className="font-semibold text-xl">Course Management</h2>
          </div>

          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${
                activeTab === "courses" ? "courses" : "requests"
              }...`}
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

        <div className="flex border-b mb-4">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "courses"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("courses")}
          >
            Manage Courses
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "requests"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            Course Requests (
            {courseRequests.filter((r) => r.status === "pending").length})
          </button>
        </div>
      </div>

      {activeTab === "courses" ? (
        <>
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="font-medium text-lg mb-4">Add New Course</h3>
            <form
              onSubmit={handleSubmitCourse}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
            >
              <div className="flex flex-col">
                <label htmlFor="title" className="mb-1 font-medium">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Course Title"
                  value={newCourse.title}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="description" className="mb-1 font-medium">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Course Description"
                  value={newCourse.description}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="category" className="mb-1 font-medium">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  placeholder="Enter category (e.g., Web Development)"
                  value={newCourse.category}
                  onChange={handleInputChange}
                  required
                  className="border border-gray-300 p-2 rounded"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Type the category name (e.g., "Web Development", "Data
                  Science")
                </p>
              </div>

              <div className="flex flex-col">
                <label htmlFor="price" className="mb-1 font-medium">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Course Price"
                  value={newCourse.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="duration" className="mb-1 font-medium">
                  Duration (in weeks)
                </label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  placeholder="Course Duration"
                  value={newCourse.duration}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              <div></div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <Upload className="mr-2" size={18} />
                Upload Course
              </button>
            </form>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium text-lg mb-4">All Courses</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                      <tr key={course._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {course.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {course.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${course.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.duration} weeks
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteCourse(course._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No courses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold text-purple-800 mb-6 text-center md:text-left">
            📝 Course Requests
          </h3>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-200">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                    👤 Student
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                    📚 Course
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                    🏷️ Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                    📅 Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-bold text-purple-700 uppercase tracking-wider">
                    ⚡ Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-purple-200">
                {filteredRequests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-purple-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {request.userInfo?.name?.charAt(0) || "?"}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-blue-800">
                            {request.userInfo?.name}
                          </div>
                          <div className="text-xs text-purple-600">
                            {request.user?.email}
                          </div>
                          <div className="text-xs text-purple-500 mt-1">
                            📞 {request.userInfo?.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-purple-800">
                        {request.course?.title}
                      </div>
                      <div className="text-sm text-purple-600">
                        ${request.course?.price}
                      </div>
                      <div className="text-xs text-purple-400 mt-1">
                        🏛️ {request.userInfo?.institute}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.status === "pending" && (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-yellow-100 text-yellow-800 animate-pulse">
                          ⏳ Pending
                        </span>
                      )}
                      {request.status === "approved" && (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-green-100 text-green-800">
                          ✅ Approved
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800">
                          ❌ Rejected
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-purple-700">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-purple-400">
                        {new Date(request.createdAt).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleRequestAction(request._id, "approve")
                            }
                            className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-all transform hover:scale-105"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() =>
                              handleRequestAction(request._id, "reject")
                            }
                            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-all transform hover:scale-105"
                            title="Reject"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      )}
                      {request.status === "approved" && request.pin && (
                        <div className="bg-gradient-to-r from-blue-100 to-purple-100 px-3 py-2 rounded-lg border border-purple-200 shadow-sm">
                          <p className="text-xs text-purple-600 font-bold">
                            ACCESS PIN
                          </p>
                          <p className="text-xl font-black text-purple-800 tracking-widest">
                            {request.pin}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white p-4 rounded-xl shadow-md border-l-4 border-purple-400"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {request.userInfo?.name?.charAt(0) || "?"}
                      </div>
                      <div>
                        <h4 className="font-bold text-purple-800">
                          {request.userInfo?.name}
                        </h4>
                        <p className="text-xs text-purple-500">
                          {request.user?.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      {request.status === "pending" && (
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800">
                          ⏳
                        </span>
                      )}
                      {request.status === "approved" && (
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-800">
                          ✅
                        </span>
                      )}
                      {request.status === "rejected" && (
                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800">
                          ❌
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold text-purple-800">
                      {request.course?.title}
                    </div>
                    <div className="text-sm text-purple-600">
                      ${request.course?.price}
                    </div>
                    <div className="text-xs text-purple-400 mt-1">
                      🏛️ {request.userInfo?.institute}
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-purple-500 font-medium">📞 Phone</p>
                      <p>{request.userInfo?.phone || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-purple-500 font-medium">
                        🏛️ Institute
                      </p>
                      <p>{request.userInfo?.institute || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-purple-500 font-medium">📅 Date</p>
                      <p>{new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-purple-500 font-medium">📍 Address</p>
                      <p className="truncate">
                        {request.userInfo?.address || "N/A"}
                      </p>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="mt-3 flex justify-end space-x-2">
                      <button
                        onClick={() =>
                          handleRequestAction(request._id, "approve")
                        }
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center"
                      >
                        <CheckCircle size={16} className="mr-1" /> Approve
                      </button>
                      <button
                        onClick={() =>
                          handleRequestAction(request._id, "reject")
                        }
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center"
                      >
                        <XCircle size={16} className="mr-1" /> Reject
                      </button>
                    </div>
                  )}

                  {request.status === "approved" && request.pin && (
                    <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
                      <p className="text-xs text-purple-600 font-bold">
                        ACCESS PIN
                      </p>
                      <p className="text-xl font-black text-purple-800">
                        {request.pin}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <BookOpen className="mx-auto h-10 w-10 text-purple-300 mb-3" />
                <p className="text-purple-500 font-medium">
                  No course requests found
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseHandleByAdmin;
