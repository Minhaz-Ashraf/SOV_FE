import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const CommonRoleProtected = ({ children }) => {
 
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("userAuthToken");
  
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
  const roleType = localStorage.getItem("role");


  const isAuthorized =
    roleType === "3" || roleType === "2" ||
    roleType === "0" 

  if (!isAuthorized && !authToken) {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default CommonRoleProtected;
