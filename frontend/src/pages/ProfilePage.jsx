import React from "react";
import UserInfoForProfile from "../components/UserInfoForProfile";
import PDFUpload from "../components/PDFUpload";
import { useAuthStore } from "../stores/useAuthStore";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  return (
    <div>
      <UserInfoForProfile />

      <PDFUpload />
    </div>
  );
};

export default ProfilePage;
