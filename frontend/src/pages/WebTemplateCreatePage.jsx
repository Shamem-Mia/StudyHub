import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";
import WebOrderForAdmin from "../components/WebOrderForAdmin";

const WebTemplateCreatePage = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [templateData, setTemplateData] = useState({
    title: "",
    description: "",
    features: ["Responsive design", "Contact form"],
    price: 299,
    contact: "+1234567890",
    category: "Portfolio",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...templateData.features];
    newFeatures[index] = value;
    setTemplateData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const addFeature = () => {
    setTemplateData((prev) => ({
      ...prev,
      features: [...prev.features, "New feature"],
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = [...templateData.features];
    newFeatures.splice(index, 1);
    setTemplateData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser || authUser.role !== "admin") {
      toast.error("You are not authorized to create templates");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axiosInstance.post(
        "/sels/templates",
        templateData
      );

      toast.success("Template created successfully!");
      navigate("/sell-web"); // Redirect to templates page
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create template");
      console.error("Error creating template:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!authUser || authUser.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md">
          <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You don't have permission to access this page. Please contact an
            administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">
              Create New Website Template
            </h1>
            <p className="text-gray-600 mt-1">
              Fill in the details below to create a new website template
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={templateData.title}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={templateData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={templateData.category}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="Portfolio">Portfolio</option>
                  <option value="Business">Business</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Blog">Blog</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  name="price"
                  value={templateData.price}
                  onChange={handleChange}
                  min="0"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="contact"
                  value={templateData.contact}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Features
                  </label>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </button>
                </div>

                <div className="space-y-2">
                  {templateData.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) =>
                          handleFeatureChange(index, e.target.value)
                        }
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="ml-2 p-2 text-red-500 hover:text-red-700"
                        disabled={templateData.features.length <= 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate("/sell-web")}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70 flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Template
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <WebOrderForAdmin />
    </div>
  );
};

export default WebTemplateCreatePage;
