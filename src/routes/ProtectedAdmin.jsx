import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const ProtectedAdmin = ({ children }) => {
  const roleType = localStorage.getItem("role");
  const authToken = localStorage.getItem("userAuthToken");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center md:ml-9 sm:ml-20 md:mt-48 mt-60 sm:mt-80">
        <Loader />
      </div>
    );
  }

  const isAuthorizedRole = roleType === "0";

  if (!isAuthorizedRole || !authToken) {
    return <Navigate to="/admin/role/auth/login" replace={true} />;
  }

  return children;
};

export default ProtectedAdmin;
