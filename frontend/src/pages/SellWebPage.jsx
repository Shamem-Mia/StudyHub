import { useState, useEffect } from "react";
import {
  ClipboardList,
  User,
  Briefcase,
  Phone,
  DollarSign,
  Check,
  X,
  Edit,
  Save,
  Plus,
  Trash2,
  Search,
  Loader2,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";
import TemplateCard from "../components/TemplateCard";
import OrdersTab from "../components/OrdersTab";
import OrderModal from "../components/OrderModal";

const SellWebPage = () => {
  const { authUser } = useAuthStore();
  const [templates, setTemplates] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState({
    templates: false,
    orders: false,
    submitting: false,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("templates");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [templatesPerPage] = useState(6);
  const [filterCategory, setFilterCategory] = useState("all");

  const [requestForm, setRequestForm] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: "",
    business: "",
    requirements: "",
  });

  // Categories for filtering
  const categories = [
    "all",
    "business",
    "portfolio",
    "ecommerce",
    "blog",
    "landing",
  ];

  // Fetch templates from backend
  const fetchTemplates = async () => {
    try {
      setLoading((prev) => ({ ...prev, templates: true }));
      const { data } = await axiosInstance.get("/sels/templates");
      setTemplates(data.data || data);
    } catch (error) {
      toast.error("Failed to load templates");
      console.error("Error fetching templates:", error);
    } finally {
      setLoading((prev) => ({ ...prev, templates: false }));
    }
  };

  // Fetch user orders from backend
  const fetchUserOrders = async () => {
    if (!authUser?.email) return;

    try {
      setLoading((prev) => ({ ...prev, orders: true }));
      const { data } = await axiosInstance.get(`/sels/orders`);
      setOrders(data.data || data);
    } catch (error) {
      toast.error("Failed to load orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading((prev) => ({ ...prev, orders: false }));
    }
  };

  // Initial data loading
  useEffect(() => {
    fetchTemplates();
  }, []);

  // Fetch orders when tab changes or authUser changes
  useEffect(() => {
    fetchUserOrders();
  }, [authUser]);

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterCategory]);

  const handleOrder = (template) => {
    setSelectedTemplate(template);
    setShowRequestModal(true);
  };

  const submitOrder = async () => {
    if (!validateForm()) return;

    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      const orderData = {
        templateId: selectedTemplate._id,
        title: selectedTemplate.title,
        price: selectedTemplate.price,
        customerInfo: {
          ...requestForm,
          email: requestForm.email || authUser?.email,
        },
      };

      const { data } = await axiosInstance.post(
        "/sels/templates/orders",
        orderData
      );

      setOrders((prev) => [data.data || data, ...prev]);
      toast.success("Order submitted successfully!");
      setShowRequestModal(false);
      resetRequestForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit order");
      console.error("Error submitting order:", error);
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const validateForm = () => {
    if (!requestForm.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!requestForm.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!requestForm.phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!requestForm.business.trim()) {
      toast.error("Please enter your business/organization");
      return false;
    }
    return true;
  };

  const resetRequestForm = () => {
    setRequestForm({
      name: authUser?.name || "",
      email: authUser?.email || "",
      phone: "",
      business: "",
      requirements: "",
    });
  };

  const saveTemplate = async () => {
    if (!authUser || authUser.role !== "admin") {
      toast.error("Not authorized!");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, submitting: true }));

      if (editData._id) {
        // Update existing template
        const { data } = await axiosInstance.put(
          `/sels/templates/${editData._id}`,
          editData
        );
        setTemplates((prev) =>
          prev.map((t) => (t._id === editData._id ? data.data || data : t))
        );
      } else {
        // Create new template
        const { data } = await axiosInstance.post("/sels/templates", editData);
        setTemplates((prev) => [data.data || data, ...prev]);
      }

      toast.success("Template saved successfully!");
      setEditData(null);
    } catch (error) {
      toast.error("Failed to save template");
      console.error("Error saving template:", error);
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const startEditing = (template = null) => {
    if (authUser?.role !== "admin") {
      toast.error("Not authorized!");
      return;
    }
    setEditData(
      template
        ? { ...template }
        : {
            title: "",
            description: "",
            price: 0,
            contact: "",
            category: "business",
            features: ["Responsive design", "SEO friendly"],
          }
    );
  };

  const deleteTemplate = async (templateId) => {
    if (!authUser || authUser.role !== "admin") {
      toast.error("Not authorized!");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, submitting: true }));
      await axiosInstance.delete(`/sels/templates/${templateId}`);
      setTemplates((prev) => prev.filter((t) => t._id !== templateId));
      toast.success("Template deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete template");
      console.error("Error deleting template:", error);
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  const handleEditChange = (e, field) => {
    setEditData({
      ...editData,
      [field]: e.target.value,
    });
  };

  const handleFeatureEdit = (e, index) => {
    const newFeatures = [...editData.features];
    newFeatures[index] = e.target.value;
    setEditData({
      ...editData,
      features: newFeatures,
    });
  };

  const addFeature = () => {
    setEditData({
      ...editData,
      features: [...editData.features, "New feature"],
    });
  };

  const removeFeature = (index) => {
    const newFeatures = [...editData.features];
    newFeatures.splice(index, 1);
    setEditData({
      ...editData,
      features: newFeatures,
    });
  };

  const cancelEditing = () => {
    setEditData(null);
  };

  // Filter templates based on search term and category
  const filteredTemplates = templates.filter((template) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      template.title.toLowerCase().includes(searchLower) ||
      (template.category &&
        template.category.toLowerCase().includes(searchLower)) ||
      template.description.toLowerCase().includes(searchLower);

    const matchesCategory =
      filterCategory === "all" ||
      (template.category && template.category.toLowerCase() === filterCategory);

    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastTemplate = currentPage * templatesPerPage;
  const indexOfFirstTemplate = indexOfLastTemplate - templatesPerPage;
  const currentTemplates = filteredTemplates.slice(
    indexOfFirstTemplate,
    indexOfLastTemplate
  );
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);

  // Group orders by status
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const approvedOrders = orders.filter((order) => order.status === "approved");
  const rejectedOrders = orders.filter((order) => order.status === "rejected");

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-[300px]">
      <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Get Your Professional Website
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-600">
            Get your perfect website according to your needs
          </p>
        </div>

        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-6 py-3 font-medium text-lg ${
              activeTab === "templates"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("templates")}
          >
            Templates
          </button>
          <button
            className={`px-6 py-3 font-medium text-lg ${
              activeTab === "orders"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            My Orders ({orders.length})
          </button>
        </div>

        {activeTab === "templates" ? (
          <>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="category-filter"
                  className="text-sm font-medium text-gray-700"
                >
                  Category:
                </label>
                <select
                  id="category-filter"
                  className="p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading.templates ? (
              <LoadingSpinner />
            ) : (
              <>
                {filteredTemplates.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No templates found
                    </h3>
                    <p className="text-gray-600">
                      {searchTerm || filterCategory !== "all"
                        ? "Try adjusting your search or filter criteria"
                        : "No templates available at the moment"}
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {currentTemplates.map((template) => (
                        <TemplateCard
                          key={template._id}
                          template={template}
                          editData={editData}
                          authUser={authUser}
                          orders={orders}
                          handleOrder={handleOrder}
                          startEditing={startEditing}
                          deleteTemplate={deleteTemplate}
                          saveTemplate={saveTemplate}
                          cancelEditing={cancelEditing}
                          handleEditChange={handleEditChange}
                          handleFeatureEdit={handleFeatureEdit}
                          addFeature={addFeature}
                          removeFeature={removeFeature}
                          loading={loading}
                        />
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <div className="flex justify-center mt-8 gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          disabled={currentPage === 1}
                          className="p-2 border rounded-lg disabled:opacity-50"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        <span className="flex items-center px-4">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="p-2 border rounded-lg disabled:opacity-50"
                        >
                          <ArrowRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <OrdersTab
            orders={orders}
            pendingOrders={pendingOrders}
            approvedOrders={approvedOrders}
            rejectedOrders={rejectedOrders}
            loading={loading.orders}
          />
        )}
      </div>

      {/* Order Request Modal */}
      {showRequestModal && selectedTemplate && (
        <OrderModal
          selectedTemplate={selectedTemplate}
          requestForm={requestForm}
          setRequestForm={setRequestForm}
          setShowRequestModal={setShowRequestModal}
          submitOrder={submitOrder}
          loading={loading.submitting}
          authUser={authUser}
        />
      )}
    </div>
  );
};

export default SellWebPage;
