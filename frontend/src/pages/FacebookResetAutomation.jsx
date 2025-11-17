import { useState, useRef } from "react";
import {
  Upload,
  Search,
  Phone,
  CheckCircle,
  XCircle,
  Loader2,
  FileText,
  Info,
  Copy,
  Trash2,
  Users,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { axiosInstance } from "../context/axiosInstance";

const FacebookResetAutomation = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [manualInput, setManualInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const fileInputRef = useRef(null);
  const [processedCount, setProcessedCount] = useState(0);

  // Handle manual input
  const handleManualInput = () => {
    if (!manualInput.trim()) {
      toast.error("Please enter phone numbers");
      return;
    }

    const numbers = manualInput
      .split(/[\n,]+/)
      .map((num) => num.trim())
      .filter((num) => {
        if (!num) return false;
        if (!/^[0-9+]+$/.test(num)) {
          toast.error(`Invalid phone number format: ${num}`);
          return false;
        }
        return true;
      });

    if (numbers.length === 0) {
      toast.error("No valid phone numbers found");
      return;
    }

    setPhoneNumbers(numbers);
    setManualInput("");
    toast.success(`Added ${numbers.length} phone numbers`);
  };

  // Start automation
  const startAutomation = async () => {
    if (phoneNumbers.length === 0) {
      toast.error("Please add phone numbers first");
      return;
    }

    setLoading(true);
    setIsRunning(true);
    setResults([]);
    setProgress(0);
    setProcessedCount(0);

    try {
      const response = await axiosInstance.post("/facebook-reset-check", {
        phoneNumbers,
      });

      if (response.data.success) {
        setResults(response.data.results);
        setProcessedCount(
          response.data.summary.processedCount || phoneNumbers.length
        );
        toast.success(response.data.message);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Error starting automation:", error);
      toast.error(
        error.response?.data?.message || "Failed to start automation"
      );
    } finally {
      setLoading(false);
      setIsRunning(false);
      setProgress(100);
    }
  };

  // Stop automation
  const stopAutomation = () => {
    setIsRunning(false);
    setLoading(false);
    toast.info("Automation stopped");
  };

  // Clear all data
  const clearData = () => {
    setPhoneNumbers([]);
    setManualInput("");
    setResults([]);
    setProgress(0);
    setProcessedCount(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Delete individual result
  const deleteResult = (index) => {
    setResults((prev) => prev.filter((_, i) => i !== index));
    toast.success("Result deleted");
  };

  // Clear specific category
  const clearCategory = (category) => {
    setResults((prev) =>
      prev.filter((result) => {
        if (category === "otpSent") return !result.otpSent;
        if (category === "accountNoOtp")
          return !(result.exists && !result.otpSent);
        if (category === "noAccount") return result.exists;
        return true;
      })
    );
    toast.success(`Cleared ${category} results`);
  };

  // Download results
  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "facebook-reset-results.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Filter results by category
  const otpSentResults = results.filter((r) => r.otpSent && !r.error);
  const accountNoOtpResults = results.filter(
    (r) => r.exists && !r.otpSent && !r.error
  );
  const noAccountResults = results.filter((r) => !r.exists && !r.error);
  const errorResults = results.filter((r) => r.error);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-xl shadow-lg mb-8 text-white">
          <div className="flex items-center gap-3">
            <Search size={28} className="text-white" />
            <div>
              <h1 className="text-2xl font-bold">
                Facebook Password Reset Automation
              </h1>
              <p className="text-blue-100 mt-1">
                Check phone numbers and receive OTP notifications
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-md border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {results.length}
                  </p>
                  <p className="text-sm text-gray-600">Total Processed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <MessageCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {otpSentResults.length}
                  </p>
                  <p className="text-sm text-gray-600">OTP Sent</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <AlertCircle className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {accountNoOtpResults.length}
                  </p>
                  <p className="text-sm text-gray-600">Account No OTP</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 shadow-md border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="text-red-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {noAccountResults.length + errorResults.length}
                  </p>
                  <p className="text-sm text-gray-600">No Account/Errors</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Input Section */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Phone size={20} />
                Add Phone Numbers
              </h2>
              <div className="space-y-4">
                <textarea
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="2250707323984&#10;2250707326509&#10;2250707325376"
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                />
                <button
                  onClick={handleManualInput}
                  disabled={!manualInput.trim()}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  Add Numbers
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Controls
              </h2>
              <div className="space-y-3">
                <button
                  onClick={startAutomation}
                  disabled={loading || phoneNumbers.length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Search size={20} />
                  )}
                  {loading
                    ? `Processing... (${processedCount}/${phoneNumbers.length})`
                    : "Start Automation"}
                </button>

                {isRunning && (
                  <button
                    onClick={stopAutomation}
                    className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle size={20} />
                    Stop Automation
                  </button>
                )}

                <button
                  onClick={clearData}
                  className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Clear All Data
                </button>
              </div>
            </div>

            {/* Current Numbers */}
            {phoneNumbers.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Numbers to Process ({phoneNumbers.length})
                  </h2>
                  <button
                    onClick={() => setPhoneNumbers([])}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Clear all numbers"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {phoneNumbers.map((number, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-600 p-1 bg-gray-50 rounded"
                    >
                      {number}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText size={20} />
                  Results ({results.length})
                </h2>
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={downloadResults}
                      className="bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-all flex items-center gap-2"
                    >
                      <FileText size={16} />
                      Download
                    </button>
                  </div>
                )}
              </div>

              {/* Category Tabs */}
              {results.length > 0 && (
                <div className="flex gap-2 mb-6 overflow-x-auto">
                  <button
                    onClick={() => clearCategory("otpSent")}
                    className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    <MessageCircle size={16} />
                    OTP Sent ({otpSentResults.length})
                    <XCircle size={14} />
                  </button>
                  <button
                    onClick={() => clearCategory("accountNoOtp")}
                    className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    <AlertCircle size={16} />
                    Account No OTP ({accountNoOtpResults.length})
                    <XCircle size={14} />
                  </button>
                  <button
                    onClick={() => clearCategory("noAccount")}
                    className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-2 rounded-lg text-sm font-medium"
                  >
                    <XCircle size={16} />
                    No Account ({noAccountResults.length})
                    <XCircle size={14} />
                  </button>
                </div>
              )}

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Phone size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>
                      No results yet. Add phone numbers and start automation.
                    </p>
                  </div>
                ) : (
                  results.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.otpSent
                          ? "bg-green-50 border-green-200"
                          : result.exists
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              result.otpSent
                                ? "bg-green-100"
                                : result.exists
                                ? "bg-yellow-100"
                                : "bg-red-100"
                            }`}
                          >
                            {result.otpSent ? (
                              <MessageCircle
                                size={20}
                                className="text-green-600"
                              />
                            ) : result.exists ? (
                              <AlertCircle
                                size={20}
                                className="text-yellow-600"
                              />
                            ) : (
                              <XCircle size={20} className="text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {result.phone}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              result.otpSent
                                ? "bg-green-100 text-green-800"
                                : result.exists
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {result.otpSent
                              ? "OTP Sent"
                              : result.exists
                              ? "Account Found"
                              : "No Account"}
                          </span>
                          <button
                            onClick={() => deleteResult(index)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete result"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacebookResetAutomation;
