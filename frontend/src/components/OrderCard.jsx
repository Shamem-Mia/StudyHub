// Order Card Component
const OrderCard = ({ order, status }) => {
  const statusStyles = {
    pending: "bg-yellow-50 border-l-4 border-yellow-400",
    completed: "bg-green-50 border-l-4 border-green-400",
    rejected: "bg-red-50 border-l-4 border-red-400",
  };

  const statusText = {
    pending: "Pending",
    completed: "Completed",
    rejected: "Rejected",
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className={`${statusStyles[status]} p-4 rounded-r-lg`}>
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium">{order.title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Price:</span> DBT:{order.price}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Ordered on:</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
          {order.customerInfo?.requirements && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Requirements:</p>
              <p className="text-sm text-gray-600">
                {order.customerInfo.requirements}
              </p>
            </div>
          )}
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${statusColors[status]}`}
        >
          {statusText[status]}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
