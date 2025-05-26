import {
  Check,
  ClipboardList,
  DollarSign,
  Edit,
  Loader2,
  Phone,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";

const TemplateCard = ({
  template,
  editData,
  authUser,
  orders,
  handleOrder,
  startEditing,
  deleteTemplate,
  saveTemplate,
  cancelEditing,
  handleEditChange,
  handleFeatureEdit,
  addFeature,
  removeFeature,
  loading,
}) => {
  const isEditing = editData?._id === template._id;
  const hasPendingOrder = orders.some(
    (o) => o.templateId === template._id && o.status === "pending"
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-2xl relative group">
      {/* Centered Category Badge - Fixed Positioning */}
      {template.category && !isEditing && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full shadow-md">
          {template.category}
        </div>
      )}

      <div className="pt-8 pb-6 px-6 h-full flex flex-col">
        {/* Rest of your card content remains exactly the same */}
        <div className="flex justify-between items-start mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) => handleEditChange(e, "title")}
              className="text-2xl font-extrabold w-full mb-2 p-3 border-2 border-indigo-100 rounded-xl focus:ring-2 focus:ring-indigo-500 bg-indigo-50 text-indigo-900"
            />
          ) : (
            <div className="w-full text-center mt-2">
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                {template.title}
              </h2>
            </div>
          )}

          {authUser?.role === "admin" && (
            <div className="flex space-x-2 absolute top-6 right-6">
              {/* Admin action buttons remain the same */}
              {isEditing ? (
                <>
                  <button
                    onClick={saveTemplate}
                    className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-md"
                    title="Save"
                    disabled={loading.submitting}
                  >
                    {loading.submitting ? (
                      <Loader2 className="animate-spin h-4 w-4" />
                    ) : (
                      <Save size={18} />
                    )}
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="p-2 bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700 rounded-xl hover:from-gray-300 hover:to-gray-400 transition-all shadow-md"
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(template)}
                    className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-600 rounded-xl hover:from-blue-200 hover:to-indigo-200 transition-all shadow-sm"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteTemplate(template._id)}
                    className="p-2 bg-gradient-to-r from-red-100 to-pink-100 text-red-600 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all shadow-sm"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Rest of your card content remains exactly the same */}
        {isEditing ? (
          <textarea
            value={editData.description}
            onChange={(e) => handleEditChange(e, "description")}
            className="text-gray-600 text-sm mb-4 w-full p-3 border-2 border-indigo-100 rounded-xl h-24 focus:ring-2 focus:ring-indigo-500 bg-indigo-50"
          />
        ) : (
          <p className="text-gray-600 text-sm mb-4 text-center">
            {template.description}
          </p>
        )}

        <div className="flex items-center justify-center mb-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-3 rounded-xl border-2 border-indigo-100">
          {isEditing ? (
            <input
              type="number"
              value={editData.price}
              onChange={(e) => handleEditChange(e, "price")}
              className="w-full p-2 bg-white border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-900"
            />
          ) : (
            <span className="inline-flex items-baseline gap-1 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 shadow-sm">
              <span className="text-sm font-semibold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-md shadow-inner">
                BDT
              </span>
              {template.price}
            </span>
          )}
        </div>

        <div className="flex items-center justify-center mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border-2 border-blue-100">
          <Phone className="h-6 w-6 mr-2 text-blue-600" />
          {isEditing ? (
            <input
              type="text"
              value={editData.contact}
              onChange={(e) => handleEditChange(e, "contact")}
              className="w-full p-2 bg-white border-2 border-blue-100 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium text-blue-900"
            />
          ) : (
            <span className="font-medium text-blue-800">
              {template.contact}
            </span>
          )}
        </div>

        <div className="mb-6 flex-grow bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-100">
          <h3 className="font-bold text-lg text-purple-800 mb-3 flex items-center justify-center">
            <ClipboardList className="h-6 w-6 mr-2 text-purple-600" />
            Key Features:
          </h3>
          <ul className="space-y-3">
            {(isEditing ? editData.features : template.features).map(
              (feature, index) => (
                <li key={index} className="flex items-start">
                  {isEditing ? (
                    <div className="flex items-center w-full">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureEdit(e, index)}
                        className="w-full p-2 bg-white border-2 border-purple-100 rounded-lg mr-2 focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={() => removeFeature(index)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100"
                        title="Remove feature"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-700 flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </span>
                  )}
                </li>
              )
            )}
            {isEditing && (
              <li className="flex justify-center">
                <button
                  onClick={addFeature}
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center mt-2 font-medium"
                >
                  <Plus className="h-5 w-5 mr-1" />
                  Add New Feature
                </button>
              </li>
            )}
          </ul>
        </div>

        <button
          onClick={() => handleOrder(template)}
          disabled={hasPendingOrder}
          className={`w-full py-3 px-4 rounded-xl font-bold mt-auto transition-all duration-300 ${
            hasPendingOrder
              ? "bg-gray-200 text-gray-600 cursor-not-allowed shadow-inner"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
          }`}
        >
          {hasPendingOrder ? (
            <span className="flex items-center justify-center">
              Order Pending
            </span>
          ) : (
            "Order Your Website"
          )}
        </button>
      </div>
    </div>
  );
};

export default TemplateCard;
