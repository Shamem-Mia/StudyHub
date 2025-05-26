import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import { useAuthStore } from "./stores/useAuthStore";
import { Toaster } from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import ProfilePage from "./pages/ProfilePage";
import GetPdfByNotesPage from "./pages/GetPdfByNotesPage";
import GetPdfBySlidesPage from "./pages/GetPdfBySlidesPage";
import GetPdfByChowthaPage from "./pages/GetPdfByChowthaPage";
import GetPdfByLabReportPage from "./pages/GetPdfByLabReportPage";
import GetPdfByBookPage from "./pages/GetPdfByBookPage";
import GetPdfByPrevQuestionPage from "./pages/GetPdfByPrevQuestionPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdManagementSimplePage from "./pages/AdManagementSimplePage";
import AdminPDFManagement from "./pages/AdminPDFManagement";
import CGPACalculator from "./pages/CGPACalculator";
import CodeEditor from "./pages/CodeEditor";
import AllCourse from "./pages/AllCourse";
import CourseHandleByAdmin from "./pages/CourseHandleByAdmin";
// import RequestWebsite from "./pages/RequestWebsite";
import SellWebPage from "./pages/SellWebPage";
import WebTemplateCreatePage from "./pages/WebTemplateCreatePage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className=" size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/notes" element={<GetPdfByNotesPage />} />
        <Route path="/slides" element={<GetPdfBySlidesPage />} />
        <Route path="/chowtha" element={<GetPdfByChowthaPage />} />
        <Route path="/lab-reports" element={<GetPdfByLabReportPage />} />
        <Route path="/pyq" element={<GetPdfByPrevQuestionPage />} />
        <Route path="/books" element={<GetPdfByBookPage />} />
        <Route path="/admin" element={<AdManagementSimplePage />} />
        <Route path="/admin-control" element={<AdminPDFManagement />} />

        <Route path="/cgpa-calc" element={<CGPACalculator />} />
        <Route path="/code-editor" element={<CodeEditor />} />
        <Route path="/all-courses" element={<AllCourse />} />
        <Route path="/handle-courses" element={<CourseHandleByAdmin />} />

        {/* <Route path="/handle-selling" element={<RequestWebsite />} /> */}
        <Route path="/sell-web" element={<SellWebPage />} />
        <Route path="/create-template" element={<WebTemplateCreatePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;
