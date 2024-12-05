import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const AgentRoleProtected = ({ children }) => {
  const roleType = localStorage.getItem("role");

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center md:ml-32 sm:ml-20 md:mt-48 mt-60 sm:mt-80">
        <Loader />
      </div>
    );
  }

  // Only allow access if roleType is "2"
  if (roleType !== "2") {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default AgentRoleProtected;
