import { Info, Loader2, X } from "lucide-react";

// Order Modal Component
const OrderModal = ({
  selectedTemplate,
  requestForm,
  setRequestForm,
  setShowRequestModal,
  submitOrder,
  loading,
  authUser,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white to-indigo-50 rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-indigo-100">
        <div className="p-6 max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Order: {selectedTemplate.title}
            </h2>
            <button
              onClick={() => setShowRequestModal(false)}
              className="text-gray-500 hover:text-indigo-700 transition-colors p-1 rounded-full hover:bg-indigo-50"
            >
              <X size={24} />
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">
            <div className="bg-white p-4 rounded-lg border border-indigo-50 shadow-sm">
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full p-2 border border-indigo-100 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                value={requestForm.name}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, name: e.target.value })
                }
                required
              />
            </div>

            <div className="bg-white p-4 rounded-lg border border-indigo-50 shadow-sm">
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full p-2 border border-indigo-100 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                value={requestForm.email}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, email: e.target.value })
                }
                required
                disabled={!!authUser?.email}
              />
            </div>

            <div className="bg-white p-4 rounded-lg border border-indigo-50 shadow-sm">
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-2 border border-indigo-100 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                value={requestForm.phone}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, phone: e.target.value })
                }
                required
              />
            </div>

            <div className="bg-white p-4 rounded-lg border border-indigo-50 shadow-sm">
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Business/Organization
              </label>
              <input
                type="text"
                className="w-full p-2 border border-indigo-100 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                value={requestForm.business}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    business: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="bg-white p-4 rounded-lg border border-indigo-50 shadow-sm">
              <label className="block text-sm font-medium text-indigo-800 mb-1">
                Additional Requirements
              </label>
              <textarea
                className="w-full p-2 border border-indigo-100 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 transition-all"
                rows={3}
                value={requestForm.requirements}
                onChange={(e) =>
                  setRequestForm({
                    ...requestForm,
                    requirements: e.target.value,
                  })
                }
                placeholder="Any specific requirements or details about your project..."
              />
            </div>

            <div className="pt-4 border-t border-indigo-100 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between mb-4">
                <span className="text-indigo-700 font-medium">
                  Template Price:
                </span>
                <span className="font-bold text-purple-600">
                  ${selectedTemplate.price}
                </span>
              </div>
              <div className="bg-indigo-100 p-3 rounded-lg text-sm text-indigo-800 flex items-start border border-indigo-200">
                <Info className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-indigo-600" />
                <p>
                  Our team will contact you within 24 hours to discuss your
                  requirements and finalize the order.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 mt-auto">
            <button
              onClick={() => setShowRequestModal(false)}
              className="px-4 py-2 border border-indigo-200 rounded-md text-indigo-700 hover:bg-indigo-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={submitOrder}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-70 flex items-center transition-all shadow-md hover:shadow-indigo-200 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Submitting...
                </>
              ) : (
                "Submit Order"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
