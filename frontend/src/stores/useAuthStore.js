import { create } from "zustand";
import { axiosInstance } from "../context/axiosInstance";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  loading: false,
  error: "",
  message: "",
  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/users/user-data");
      set({ authUser: response.data.user });
    } catch (error) {
      console.log("error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  register: async (formData, navigate) => {
    set({ loading: true, error: "" });
    try {
      const response = await axiosInstance.post("/auth/register", {
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/verify-email", {
        state: {
          email: formData.email,
          tempUserData: response.data.tempUserData,
        },
      });

      toast(response.data.message || "Something is wrong");

      return response.data || null;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      return null;
    } finally {
      set({ loading: false, error: "" });
    }
  },

  verifyAndCreate: async (email, otp, tempUserData, navigate) => {
    set({ loading: true, error: "" });

    try {
      const response = await axiosInstance.post("/auth/verify-and-create", {
        email,
        otp,
        tempUserData,
      });
      set({
        message: "Email verified successfully!",
      });
      set({ authUser: response.data });
      toast.success("Successfully registered!");
      navigate("/");
    } catch (error) {
      set({
        error: err.response?.data?.message || "Verification failed",
      });
    } finally {
      set({ loading: false });
    }
  },

  logout: async (navigate) => {
    try {
      let n;
      n = confirm("Do you want to logged out?");
      if (n) {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        navigate("/login");
      } else {
        toast.error("Not logged out");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "logout failed");
      console.log("Error in logout store!");
    }
  },

  login: async (email, password, navigate) => {
    set({ loading: true });

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({ authUser: response.data });
      toast.success("login successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      set({ error: error.response?.data?.message || "Login failed" });
    } finally {
      set({ loading: false });
    }
  },

  forgetPassword: async (email, navigate) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/auth/send-reset-otp", {
        email,
      });
      toast.success(response.data.message);
      navigate("/verify-otp", { state: { email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      set({ loading: false });
    }
  },

  verifyResetOtp: async (email, otp, navigate) => {
    set({ loading: true });

    try {
      const { data } = await axiosInstance.post("/auth/verify-reset-otp", {
        email,
        otp,
      });

      toast.success(data.message);
      navigate("/reset-password", {
        state: { email },
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (email, newPassword, navigate) => {
    set({ loading: true });

    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        email,
        newPassword,
      });
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      set({ loading: false });
    }
  },

  setAuthUser: (user) => set({ authUser: user }),

  handleLike: async (noteId, setNotes) => {
    try {
      const { data } = await axiosInstance.post(`/pdfs/notes/${noteId}/like`);

      // Update the notes state
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, likes: data.data.likes } : note
        )
      );

      toast.success("Note liked!");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to like note");
      }
    }
  },
}));
