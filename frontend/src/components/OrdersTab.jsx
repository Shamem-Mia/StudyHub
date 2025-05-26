import { BookOpen, CheckCircle, Clock, Loader2, XCircle } from "lucide-react";
import OrderCard from "./OrderCard";

// Orders Tab Component
const OrdersTab = ({
  orders,
  pendingOrders,
  approvedOrders,
  rejectedOrders,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">My Orders</h2>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600">
              Browse our templates and place your first order!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Orders */}
            {pendingOrders.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Clock className="text-yellow-500 mr-2" />
                  Pending Approval ({pendingOrders.length})
                </h3>
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <OrderCard key={order._id} order={order} status="pending" />
                  ))}
                </div>
              </div>
            )}

            {/* approved Orders */}
            {approvedOrders.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="text-green-500 mr-2" />
                  Completed ({approvedOrders.length})
                </h3>
                <div className="space-y-4">
                  {approvedOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      status="approved"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Orders */}
            {rejectedOrders.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <XCircle className="text-red-500 mr-2" />
                  Rejected ({rejectedOrders.length})
                </h3>
                <div className="space-y-4">
                  {rejectedOrders.map((order) => (
                    <OrderCard
                      key={order._id}
                      order={order}
                      status="rejected"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersTab;
