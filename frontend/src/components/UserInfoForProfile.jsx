import { useState, useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { axiosInstance } from "../context/axiosInstance";
import { toast } from "react-hot-toast";
import {
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Coins,
} from "lucide-react";
import { Link } from "react-router-dom";

const UserInfoForProfile = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    instituteName: "",
    address: "",
    dateOfBirth: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        role: authUser.role || "",
        instituteName: authUser.instituteName || "",
        address: authUser.address || "",
        dateOfBirth: authUser.dateOfBirth?.split("T")[0] || "",
      });
      setLoading(false);
    }
  }, [authUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("formData", formData);

      const { data } = await axiosInstance.put("/users/edit-profile", formData);

      setAuthUser(data.user);
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!authUser) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          You are a guest
        </h2>
        <p className="text-gray-600 mb-6">
          To view your profile, please log in first and go to the home page.
        </p>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
          >
            Login
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8 text-center">
            <div className="relative inline-block">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-blue-500" />
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition">
                  <Edit className="h-4 w-4 text-blue-500" />
                </button>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {authUser.fullName}
            </h1>
            <p className="text-blue-100">{authUser.email}</p>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-100"
                        disabled
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="instituteName"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Institute Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="instituteName"
                        name="instituteName"
                        value={formData.instituteName}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Date of Birth
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-medium">{authUser.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="font-medium">{authUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Institute Name</p>
                      <p className="font-medium">
                        {authUser.instituteName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="font-medium">
                        {authUser.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {/* role */}

                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium">
                        {authUser.role || "Not provided"}
                      </p>
                    </div>
                  </div>
                  {/* coin */}

                  <div className="flex items-start">
                    <Coins className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Delivery Coin</p>
                      <p className="font-medium">
                        {authUser.deliveredCoin || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium">
                        {authUser.dateOfBirth
                          ? new Date(authUser.dateOfBirth).toLocaleDateString()
                          : "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-start">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">
                        {authUser.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Security Section */}
          <div className="border-t border-gray-200 px-6 py-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Lock className="h-5 w-5 text-gray-500 mr-2" />
              Account Security
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    Password
                  </h3>
                  <p className="text-sm text-gray-500">
                    Last changed 3 months ago
                  </p>
                </div>
                <div className="border-t pt-4">
                  <Link
                    to="/forgot-password"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Change Password
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoForProfile;
