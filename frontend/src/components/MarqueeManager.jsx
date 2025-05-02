import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Loader2, X, Edit, Check } from "lucide-react";
import { axiosInstance } from "../context/axiosInstance";

const MarqueeManager = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editMessage, setEditMessage] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/marquee");
      setMessages(response.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMessage = async () => {
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post("/marquee", { message: newMessage });
      toast.success("Message created successfully");
      setNewMessage("");
      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create message");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMessage = async (id) => {
    if (!editMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(`/marquee/${id}`, {
        message: editMessage,
      });
      toast.success("Message updated successfully");
      setEditingId(null);
      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update message");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      setLoading(true);
      const message = messages.find((m) => m._id === id);
      await axiosInstance.put(`/marquee/${id}`, {
        isActive: !message.isActive,
      });
      toast.success("Message status updated");
      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update message status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/marquee/${id}`);
      toast.success("Message deleted successfully");
      fetchMessages();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">
        Manage Marquee Messages
      </h2>

      {/* Create New Message */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-3">Create New Message</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter marquee message..."
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateMessage}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : null}
            Create
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Existing Messages</h3>
        {loading && messages.length === 0 ? (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-blue-600" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-gray-500">No messages found</p>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`p-4 border rounded-lg ${
                  message.isActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                {editingId === message._id ? (
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={editMessage}
                      onChange={(e) => setEditMessage(e.target.value)}
                      className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateMessage(message._id)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm flex items-center"
                      >
                        <Check size={16} className="mr-1" /> Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditMessage("");
                        }}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{message.message}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(message.createdAt).toLocaleString()} |{" "}
                        {message.isActive ? (
                          <span className="text-green-600">Active</span>
                        ) : (
                          <span className="text-gray-500">Inactive</span>
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(message._id)}
                        className={`px-2 py-1 rounded text-sm ${
                          message.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {message.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(message._id);
                          setEditMessage(message.message);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteMessage(message._id)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarqueeManager;
