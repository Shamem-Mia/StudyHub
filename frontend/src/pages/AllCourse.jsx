import { useState, useEffect } from "react";
import {
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  X,
  Info,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";
import RequestCourse from "../components/RequestCourse";

const AllCourse = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestedCourses, setRequestedCourses] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axiosInstance.get("/courses");
        if (!isMounted) return;

        const courses = response.data?.data || [];
        setCourses(Array.isArray(courses) ? courses : []);

        try {
          const requestsResponse = await axiosInstance.get("/courses/requests");
          const requestsData = requestsResponse.data;
          const requests =
            requestsData?.data?.requests || requestsData?.requests || [];
          setRequestedCourses(requests);
        } catch (requestsError) {
          console.log("Requests not fetched (user might not be logged in)");
        }
      } catch (err) {
        if (!isMounted) return;

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load courses";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = (courses || []).filter((course) => {
    if (!course) return false;
    const searchLower = (searchTerm || "").toLowerCase();
    return (
      (course.title || "").toLowerCase().includes(searchLower) ||
      (course.category || "").toLowerCase().includes(searchLower) ||
      (course.description || "").toLowerCase().includes(searchLower)
    );
  });

  const handleRequestClick = (course) => {
    setSelectedCourse(course);
    setShowRequestModal(true);
  };

  const handleRequestSuccess = (newRequest) => {
    setRequestedCourses((prev) => [newRequest, ...prev]);
    setShowRequestModal(false);
    setSelectedCourse(null);
  };

  const handleResetSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
        <p className="mt-4 text-gray-700 font-medium">Loading courses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg">
        <XCircle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-red-700 font-bold">Error loading data</p>
        <p className="text-gray-700 text-center mt-2">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // Color variants for course cards
  const cardColors = [
    "border-t-4 border-blue-500 hover:border-blue-600",
    "border-t-4 border-purple-500 hover:border-purple-600",
    "border-t-4 border-green-500 hover:border-green-600",
    "border-t-4 border-yellow-500 hover:border-yellow-600",
    "border-t-4 border-pink-500 hover:border-pink-600",
    "border-t-4 border-indigo-500 hover:border-indigo-600",
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg mb-8 text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: Title and Contact */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen size={28} className="text-white" />
              <h1 className="text-2xl font-bold">Course Catalog</h1>
            </div>
            <h1 className="text-lg font-medium sm:ml-6">Call: 01833620248</h1>
          </div>

          {/* Right: Search Input */}
          <div className="relative w-full md:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-white" size={18} />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-10 pr-10 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white focus:border-white text-white placeholder-white/70"
              />
              {searchTerm && (
                <button
                  onClick={handleResetSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="text-white/70 hover:text-white" size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex overflow-x-auto mb-8 scrollbar-hide">
        <button
          className={`px-6 py-3 font-bold rounded-t-lg mr-2 transition-all ${
            activeTab === "all"
              ? "bg-white text-indigo-700 shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Courses
        </button>
        <button
          className={`px-6 py-3 font-bold rounded-t-lg transition-all ${
            activeTab === "requested"
              ? "bg-white text-indigo-700 shadow-md"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setActiveTab("requested")}
        >
          My Courses ({requestedCourses.length})
        </button>
      </div>

      {/* Content Section */}
      {activeTab === "all" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course, index) => (
              <div
                key={course?._id || Math.random().toString(36).substr(2, 9)}
                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full ${
                  cardColors[index % cardColors.length]
                }`}
              >
                <div className="p-5 flex flex-col h-full">
                  <div className="flex-grow">
                    <div className="flex items-start mb-4">
                      <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 mr-3">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
                          {course?.title || "Untitled Course"}
                        </h3>
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-800 rounded-full">
                          {course?.category || "General"}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {course?.description || "No description available"}
                    </p>

                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-sm text-gray-700">
                        <Clock className="mr-1" size={16} />
                        {course?.duration || "0"} weeks
                      </div>
                      <div className="text-lg font-bold text-indigo-700">
                        ৳{course?.price || "0"}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRequestClick(course)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all mt-auto ${
                      requestedCourses?.some(
                        (req) => req?.course?._id === course?._id
                      )
                        ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white hover:shadow-md"
                    }`}
                  >
                    {requestedCourses?.some(
                      (req) => req?.course?._id === course?._id
                    )
                      ? "Already Requested"
                      : "Enroll Now"}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl">
              <Search className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-700 mt-4">
                {searchTerm
                  ? `No courses found for "${searchTerm}"`
                  : "No courses available"}
              </h3>
              <p className="text-gray-500 mt-2">
                {searchTerm
                  ? "Try a different search term"
                  : "Check back later for new courses"}
              </p>
              {searchTerm && (
                <button
                  onClick={handleResetSearch}
                  className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <BookOpen className="mr-3 text-indigo-600" size={24} />
              My Course Requests
            </h3>
          </div>

          {requestedCourses.length > 0 ? (
            <div className="space-y-6">
              {requestedCourses.map((request) => (
                <div
                  key={
                    request?._id || Math.random().toString(36).substring(2, 9)
                  }
                  className="border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
                >
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <div className="flex items-center">
                        <div className="p-2 rounded-lg bg-indigo-400/20 mr-3">
                          <BookOpen size={18} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">
                            {request?.course?.title || "Unknown Course"}
                          </h4>
                          <p className="text-indigo-100 text-sm">
                            Requested:{" "}
                            {request?.createdAt
                              ? new Date(request.createdAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )
                              : "Unknown date"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center mt-2 sm:mt-0">
                        {request?.status === "pending" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
                            <Clock className="mr-1" size={14} />
                            Pending
                          </span>
                        )}
                        {request?.status === "approved" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800">
                            <CheckCircle className="mr-1" size={14} />
                            Approved
                          </span>
                        )}
                        {request?.status === "rejected" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            <XCircle className="mr-1" size={14} />
                            Rejected
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column - Course Info */}
                    <div className="md:col-span-2 space-y-4">
                      {/* Course Details */}
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg mr-2">
                            <BookOpen size={16} />
                          </span>
                          Course Details
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                            <p className="text-gray-500 text-sm font-medium">
                              Price
                            </p>
                            <p className="font-bold text-indigo-600">
                              {request?.course?.price !== undefined
                                ? `$${request.course.price}`
                                : "Free"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Student Information */}
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-2">
                            <User size={16} />
                          </span>
                          Student Information
                        </h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                            <p className="text-gray-500 text-sm font-medium">
                              Name
                            </p>
                            <p className="font-semibold text-gray-800">
                              {request?.userInfo?.name || "N/A"}
                            </p>
                          </div>

                          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                            <p className="text-gray-500 text-sm font-medium">
                              Phone
                            </p>
                            <p className="font-semibold text-gray-800">
                              {request?.userInfo?.phone || "N/A"}
                            </p>
                          </div>

                          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                            <p className="text-gray-500 text-sm font-medium">
                              Institute
                            </p>
                            <p className="font-semibold text-gray-800">
                              {request?.userInfo?.institute || "N/A"}
                            </p>
                          </div>

                          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                            <p className="text-gray-500 text-sm font-medium">
                              Address
                            </p>
                            <p className="font-semibold text-gray-800">
                              {request?.userInfo?.address || "N/A"}
                            </p>
                          </div>

                          <div className="sm:col-span-2 bg-blue-50 p-3 rounded-md border border-blue-100">
                            <p className="text-gray-500 text-sm font-medium">
                              Additional Info
                            </p>
                            <p className="font-semibold text-gray-800">
                              {request?.userInfo?.additionalInfo ||
                                "None provided"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Status Card */}
                    <div className="flex flex-col">
                      <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm h-full flex flex-col">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <span className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-2">
                            <Info size={16} />
                          </span>
                          Enrollment Status
                        </h5>

                        <div className="flex-grow flex flex-col justify-center">
                          {request?.status === "approved" && request?.pin && (
                            <div className="text-center">
                              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-3">
                                <p className="text-gray-600 text-sm mb-1">
                                  Enrollment PIN
                                </p>
                                <p className="text-2xl font-bold text-green-700 tracking-wider">
                                  {request.pin}
                                </p>
                              </div>
                            </div>
                          )}

                          {request?.status === "pending" && (
                            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200">
                              <Clock
                                size={24}
                                className="mx-auto text-yellow-500 mb-2"
                              />
                              <p className="text-gray-700 font-medium">
                                Under Review
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                We'll notify you when processed
                              </p>
                            </div>
                          )}

                          {request?.status === "rejected" && (
                            <div className="text-center p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                              <XCircle
                                size={24}
                                className="mx-auto text-red-500 mb-2"
                              />
                              <p className="text-gray-700 font-medium">
                                Request Rejected
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Contact support for details
                              </p>
                              <button className="mt-3 px-4 py-1 text-sm bg-white border border-red-200 text-red-600 rounded-md hover:bg-red-50 transition-colors shadow-sm">
                                Contact Support
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl border border-gray-200 shadow-sm">
              <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-700 mt-4">
                No Course Requests
              </h3>
              <p className="text-gray-500 mt-2">
                You haven't requested any courses yet.
              </p>
              <button
                onClick={() => setActiveTab("all")}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all shadow-indigo-100 hover:shadow-indigo-200"
              >
                Browse Courses
              </button>
            </div>
          )}
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedCourse && (
        <RequestCourse
          course={selectedCourse}
          onClose={() => setShowRequestModal(false)}
          onRequestSuccess={handleRequestSuccess}
        />
      )}
    </div>
  );
};

export default AllCourse;
