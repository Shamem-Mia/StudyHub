import { useState, useEffect } from "react";
import { axiosInstance } from "../context/axiosInstance";
import { useAuthStore } from "../stores/useAuthStore";
import {
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  Search,
  AlertCircle,
  User,
  Briefcase,
  Phone,
  Mail,
  DollarSign,
} from "lucide-react";
import toast from "react-hot-toast";

const WebOrderForAdmin = () => {
  const { authUser } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/sels/admin/orders");
      setOrders(data.data || data);
    } catch (error) {
      toast.error("Failed to load orders");
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authUser?.role === "admin") {
      fetchOrders();
    }
  }, [authUser]);

  const pendingOrders = orders
    .filter((order) => order.status === "pending")
    .filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.title.toLowerCase().includes(searchLower) ||
        order.customerInfo.name.toLowerCase().includes(searchLower) ||
        order.customerInfo.email.toLowerCase().includes(searchLower) ||
        order.customerInfo.business.toLowerCase().includes(searchLower)
      );
    });

  const handleApproveReject = async (orderId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this order?`)) {
      return;
    }

    try {
      setIsProcessing(true);
      await axiosInstance.put(`/sels/admin/orders/${orderId}`, { status });

      if (status === "rejected") {
        setOrders(orders.filter((order) => order._id !== orderId));
        toast.success("Order rejected and removed");
      } else {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
        toast.success("Order approved successfully");
      }
    } catch (error) {
      toast.error(`Failed to ${status} order`);
      console.error(`Error ${status}ing order:`, error);
    } finally {
      setIsProcessing(false);
      setSelectedOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Orders Dashboard
          </h1>
          <p className="text-lg text-indigo-700">
            Manage and review all pending website template orders
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="relative flex-grow max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-indigo-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 w-full p-3 border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all bg-indigo-50 text-indigo-800 placeholder-indigo-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 px-4 py-3 rounded-xl border-2 border-amber-200 shadow-sm">
              <Clock className="h-5 w-5" />
              <span className="font-medium">
                {pendingOrders.length} Pending Orders
              </span>
            </div>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="text-center py-12 bg-indigo-50 rounded-xl border-2 border-dashed border-indigo-200">
              <AlertCircle className="mx-auto h-12 w-12 text-indigo-400 mb-4" />
              <h3 className="text-xl font-medium text-indigo-800 mb-2">
                No pending orders
              </h3>
              <p className="text-indigo-600">
                All orders have been processed or there are no new orders yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingOrders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white rounded-xl border-2 border-indigo-100 hover:border-indigo-300 shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 border-b-2 border-indigo-100">
                    <h3 className="text-lg font-bold text-indigo-800 truncate">
                      {order.title}
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="h-4 w-4 text-indigo-600" />
                      <span className="text-indigo-800 font-medium">
                        {order.customerInfo.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4 text-indigo-600" />
                      <span className="text-indigo-700">
                        {order.customerInfo.business}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-4 w-4 text-indigo-600" />
                      <span className="font-bold text-purple-600">
                        ${order.price}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex justify-between border-t-2 border-indigo-50 pt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveReject(order._id, "approved");
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        disabled={isProcessing}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApproveReject(order._id, "rejected");
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                        disabled={isProcessing}
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border-4 border-indigo-200">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Order Details
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-100">
                    <h3 className="text-lg font-medium text-indigo-800 mb-3 flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Template Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-700">
                          Title:
                        </span>
                        <span className="text-indigo-900">
                          {selectedOrder.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-700">
                          Price:
                        </span>
                        <span className="font-bold text-purple-600">
                          ${selectedOrder.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-100">
                    <h3 className="text-lg font-medium text-indigo-800 mb-3 flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Customer Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-700">
                          Name:
                        </span>
                        <span className="text-indigo-900">
                          {selectedOrder.customerInfo.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-700">
                          Email:
                        </span>
                        <span className="text-indigo-900">
                          {selectedOrder.customerInfo.email}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-700">
                          Phone:
                        </span>
                        <span className="text-indigo-900">
                          {selectedOrder.customerInfo.phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-indigo-700">
                          Business:
                        </span>
                        <span className="text-indigo-900">
                          {selectedOrder.customerInfo.business}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedOrder.customerInfo.requirements && (
                  <div className="mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-100">
                    <h3 className="text-lg font-medium text-indigo-800 mb-3 flex items-center gap-2">
                      <AlertCircle className="h-5 w-5" />
                      Additional Requirements
                    </h3>
                    <div className="bg-white p-3 rounded-lg text-gray-700 whitespace-pre-line">
                      {selectedOrder.customerInfo.requirements}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t-2 border-indigo-100">
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      handleApproveReject(selectedOrder._id, "rejected");
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-red-100 to-rose-100 text-red-700 rounded-xl hover:from-red-200 hover:to-rose-200 flex items-center gap-2 border-2 border-red-200 shadow-sm"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        Reject Order
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(null);
                      handleApproveReject(selectedOrder._id, "approved");
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-xl hover:from-green-200 hover:to-emerald-200 flex items-center gap-2 border-2 border-green-200 shadow-sm"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Approve Order
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebOrderForAdmin;
