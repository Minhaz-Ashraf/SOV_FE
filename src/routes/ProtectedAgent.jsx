import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../components/Loader";
import { useSelector } from "react-redux";

const ProtectedAgent = ({ children }) => {
  const roleType = localStorage.getItem("role");
  const { agentData } = useSelector((state) => state.agent);

  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className="flex justify-center md:ml-32 sm:ml-20 md:mt-48 mt-60 sm:mt-80">
        <Loader />
      </div>
    );
  }

  if (roleType !== "3" && agentData?.pageStatus?.status !== "completed") {
    return <Navigate to="/login" replace={true} />;
  }

  return children;
};

export default ProtectedAgent;
