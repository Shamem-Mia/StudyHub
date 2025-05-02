import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";
import HomePageCards from "../components/HomePageCards";
import PDFUploadForm from "../components/PDFUploadForm";
import { axiosInstance } from "../context/axiosInstance";
import toast from "react-hot-toast";
import { FileText } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";

const HomePage = () => {
  const { authUser, isAdmin } = useAuthStore();
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marqueeMessage, setMarqueeMessage] = useState("");

  const handleUploadSuccess = (newPdf) => {
    setPdfs((prevPdfs) => [newPdf, ...prevPdfs]);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch random PDFs
        const pdfsResponse = await axiosInstance.get("/pdfs/random");
        setPdfs(pdfsResponse.data.data.pdfs);

        // Fetch marquee message
        const messageResponse = await axiosInstance.get("/marquee/active");
        setMarqueeMessage(
          messageResponse.data.message ||
            "Welcome to StudyHub! Explore our resources."
        );
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Marquee Message at the top */}
      {marqueeMessage && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-sm md:text-base font-medium">
            {marqueeMessage}
          </div>
        </div>
      )}

      {authUser ? <PDFUploadForm onUploadSuccess={handleUploadSuccess} /> : ""}

      <HomePageCards />

      {/* Display Random PDFs */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Recommended PDFs for you!!!
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pdfs.slice(0, 20).map((pdf) => (
              <div
                key={pdf._id}
                className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center mb-2">
                  <FileText className="text-blue-500 mr-2" />
                  <h3 className="font-semibold text-lg truncate">
                    {pdf.title}
                  </h3>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {pdf.category ? <p>Category: {pdf.category}</p> : null}
                  {pdf.courseName ? <p>Course: {pdf.courseName}</p> : null}
                  {pdf.instituteName ? (
                    <p>Institute: {pdf.instituteName}</p>
                  ) : null}
                  <p>
                    Uploaded: {new Date(pdf.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  View PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content and Footer */}
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
