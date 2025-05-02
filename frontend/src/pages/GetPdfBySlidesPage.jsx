import { useState, useEffect } from "react";
import { BookOpen, Download, Search, X, Heart } from "lucide-react";
import toast from "react-hot-toast";
import PDFViewer from "../components/PDFViewer";
import { axiosInstance } from "../context/axiosInstance";

const GetPdfBySlidesPage = () => {
  const [slides, setSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(`/pdfs/slides`);
        setSlides(data.data.slides);
      } catch (error) {
        toast.error("Failed to load slides");
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  const handleLike = async (slideId, e) => {
    e.stopPropagation();
    try {
      const { data } = await axiosInstance.post(`/pdfs/notes/${slideId}/like`); // Using same endpoint as notes

      setSlides((prevSlides) =>
        prevSlides.map((slide) =>
          slide._id === slideId ? { ...slide, likes: data.data.likes } : slide
        )
      );

      toast.success("Slide liked!");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to like slide");
      }
    }
  };

  const filteredSlides = slides.filter((slide) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      slide.instituteName.toLowerCase().includes(searchLower) ||
      slide.courseName.toLowerCase().includes(searchLower) ||
      slide.title.toLowerCase().includes(searchLower)
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
        {/* Search and header section remains the same */}
        {/* ... */}
      </div>

      {selectedSlide ? (
        <div className="mb-8">
          <button
            onClick={() => setSelectedSlide(null)}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
          >
            <span className="mr-2">← Back to slides</span>
          </button>
          <PDFViewer pdf={selectedSlide} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSlides.length > 0 ? (
            filteredSlides.map((slide) => (
              <div
                key={slide._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedSlide(slide)}
              >
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <BookOpen className="text-blue-500 mr-2" />
                    <h3 className="font-medium text-lg truncate">
                      {slide.title}
                    </h3>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    <p>Institute: {slide.instituteName}</p>
                    <p>Course: {slide.courseName}</p>
                    <p>
                      Uploaded: {new Date(slide.createdAt).toLocaleDateString()}
                    </p>
                    <p className="flex items-center mt-1">
                      <Heart className="mr-1 text-red-500" size={16} />
                      {slide.likes || 0} likes
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <a
                      href={slide.url}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      <Download className="mr-1" size={16} />
                      View
                    </a>
                    <button
                      onClick={(e) => handleLike(slide._id, e)}
                      className="inline-flex items-center px-3 py-1 bg-red-100 text-red-600 hover:bg-red-200 text-sm rounded"
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
              {/* No slides found message */}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GetPdfBySlidesPage;
