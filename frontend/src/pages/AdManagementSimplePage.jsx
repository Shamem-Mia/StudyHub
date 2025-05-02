import React, { useState, useEffect } from "react";
import { Trash2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance.js";
import MarqueeManager from "../components/MarqueeManager.jsx";

const AdManagementSimplePage = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scriptContent, setScriptContent] = useState("");
  const [adType, setAdType] = useState("script");

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/ads");
      setAds(data.ads);
    } catch (error) {
      toast.error("Failed to fetch ads");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/ads", {
        scriptContent,
        type: adType,
      });
      toast.success("Advertisement created successfully");
      setScriptContent("");
      fetchAds();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create ad");
    }
  };

  const toggleAdStatus = async (id, currentStatus) => {
    try {
      await axiosInstance.put(`/ads/${id}/status`, {
        isActive: !currentStatus,
      });
      toast.success("Ad status updated");
      fetchAds();
    } catch (error) {
      toast.error("Failed to update ad status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      try {
        await axiosInstance.delete(`/ads/${id}`);
        toast.success("Advertisement deleted");
        fetchAds();
      } catch (error) {
        toast.error("Failed to delete advertisement");
      }
    }
  };

  const renderAdPreview = (ad) => {
    if (ad.type === "script") {
      return (
        <div
          className="h-48 bg-gray-100 overflow-hidden flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: ad.scriptContent }}
        />
      );
    } else {
      return (
        <div className="h-48 bg-gray-100 overflow-hidden">
          <img
            src={ad.imageUrl}
            alt="Ad preview"
            className="w-full h-full object-cover"
          />
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <MarqueeManager />
      <h1 className="text-2xl font-bold mb-6">Advertisement Management</h1>

      {/* Create New Ad Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Create New Advertisement</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ad Type
          </label>
          <select
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="script">Script Ad</option>
            <option value="image">Image Ad</option>
          </select>
        </div>

        {adType === "script" ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Script
              </label>
              <textarea
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="w-full px-3 py-2 border rounded-md font-mono text-sm h-32"
                placeholder={`<script type="text/javascript">\n  atOptions = {\n    'key': '57ebb1f3179c86582d60fb43da30b0ba',\n    'format': 'iframe',\n    'height': 300,\n    'width': 160,\n    'params': {}\n  };\n</script>\n<script type="text/javascript" src="//www.highperformanceformat.com/57ebb1f3179c86582d60fb43da30b0ba/invoke.js"></script>`}
                required
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Ad
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination URL
              </label>
              <input
                type="url"
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="https://example.com"
                required
              />
            </div>
            <button
              type="submit"
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Ad
            </button>
          </form>
        )}
      </div>

      {/* Ads List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Current Advertisements</h2>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : ads.length === 0 ? (
          <p className="text-gray-500">No advertisements found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.map((ad) => (
              <div key={ad._id} className="border rounded-lg overflow-hidden">
                {renderAdPreview(ad)}
                <div className="p-4">
                  <div className="flex justify-between items-center mt-3">
                    <button
                      onClick={() => toggleAdStatus(ad._id, ad.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ad.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {ad.isActive ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleDelete(ad._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdManagementSimplePage;
