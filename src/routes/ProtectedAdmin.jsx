import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const ProtectedAdmin = ({ children }) => {
  const { getAdminProfile } = useSelector((state) => state.admin);
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
      <div className="flex justify-center md:ml-32 sm:ml-20 md:mt-48 mt-60 sm:mt-80">
        <Loader />
      </div>
    );
  }

  // Log the current values to help with debugging
  console.log('roleType:', roleType);
  console.log('Admin Profile:', getAdminProfile);

  // Check the conditions for navigation
  const isRoleNotZero = roleType !== "0";

  if (isRoleNotZero && !authToken ) {
    console.log('Navigating to login due to missing profile data');
    return <Navigate to="/login" replace={true} />;
  }

  // If everything is fine, render the children
  return children;
};

export default ProtectedAdmin;
