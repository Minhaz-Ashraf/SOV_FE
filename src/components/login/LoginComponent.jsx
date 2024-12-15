import React, { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { loginUserData } from "../../features/authSlice";
import { getStudentData, studentInfo } from "../../features/studentSlice";
import { getPersonalInfo } from "../../features/studentApi";
import { getAgentData } from "../../features/agentApi";
import { agentInformation } from "../../features/agentSlice";
import { CustomInput } from "../reusable/Input";

const LoginComponent = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "3",
  });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("3");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((data) => ({
      ...data,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setLoginData((prevData) => ({
      ...prevData,
      role: tab,
    }));
  };

  const validateFields = () => {
    const newErrors = {};
    if (!loginData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!loginData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (validateFields()) {
      try {
        setLoading(true);

        const res = await dispatch(
          loginUserData({
            email: loginData.email,
            password: loginData.password,
            role: loginData.role,
          })
        ).unwrap();
        // toast.success(res?.message || "Login Successful");

        if (loginData?.role === "2") {
          const agentInfo = await getAgentData().catch((error) => {
            console.log(error);
            navigate("/agent-form/1", { state: "passPage" });
            return;
          });
          dispatch(agentInformation());
      
          let redirectPath = "";
          if(agentInfo.pageStatus?.status === "requestedForReapproval") {
            redirectPath = `/agent/account-deleted`;
          } else if(agentInfo.deleted === true) {
            redirectPath = `/agent/account-deleted`;
          } else if (
            agentInfo.pageCount === 6 &&
            agentInfo.pageStatus?.status === "completed"
          ) {
            redirectPath = `/agent/dashboard`;
          } else if (
            (agentInfo.pageCount === 6 &&
              agentInfo.pageStatus.status === "notapproved") ||
            (agentInfo.pageCount === 6 &&
           
              agentInfo.deleted === true) ||
            agentInfo.pageStatus.status === "notapproved"
          ) {
            redirectPath = `/waiting`;
          } else if (
            (agentInfo.pageCount === 6 &&
              agentInfo.pageStatus.status === "rejected") ||
            agentInfo.pageStatus.status === "rejected"
          ) {
            redirectPath = "/agent-form/1";
          } else if (
            (agentInfo.pageCount === 6 &&
              agentInfo.pageStatus.status === "requestedForReapproval") ||
            agentInfo.pageStatus.status === "requestedForReapproval"
          ) {
            redirectPath = "/agent/account-deleted";
          } 
          else if (
            agentInfo.pageCount !== 6 &&
            agentInfo.pageStatus?.status === "registering"
          ) {
            redirectPath = `/agent-form/${agentInfo.pageCount}`;
          } else {
            redirectPath = "/agent-form/1";
          }

          if (redirectPath) {
            navigate(redirectPath, { state: "passPage" });
          }
        } else if (loginData?.role === "3" && res.user._id !== "") {
          dispatch(getStudentData(res.user._id));
          dispatch(studentInfo(res.user._id));


          const studentInfoData = await getPersonalInfo(res.user._id).catch(
            (error) => {
              console.log(error);
              navigate("/student-form/1", { state: "passPage" });
              return;
            }
          );
          // console.log(studentInfoData);

          if (!studentInfoData.data || Object.keys(studentInfoData.data).length === 0) {
            navigate("student-form/1", { state: "passPage" });
            return;
          }
          let redirectPath = "";

          if(studentInfoData.data.studentInformation.pageStatus?.status === "requestedForReapproval") {
            redirectPath = `/student/account-deleted`;
          } else if(studentInfoData.data.studentInformation.deleted === true) {
            redirectPath = `/student/account-deleted`;
          } else if (
            studentInfoData?.data?.studentInformation?.pageCount === 3 &&
            studentInfoData?.data?.studentInformation?.pageStatus?.status ===
              "completed"
          ) {
            redirectPath = `/student/dashboard`;
          }
          if (
            studentInfoData?.data?.studentInformation?.pageCount === 3 &&
            studentInfoData?.data?.studentInformation?.pageStatus?.status ===
              "notapproved"
          ) {
            redirectPath = `/waiting`;
          } else if (
            studentInfoData?.data?.studentInformation?.pageCount !== 3 &&
            studentInfoData?.data?.studentInformation?.pageStatus?.status ===
              "registering"
          ) {
            redirectPath = `/student-form/1`;
          }
          if (
            studentInfoData?.data?.studentInformation?.pageCount === 3 &&
            studentInfoData?.data?.studentInformation?.pageStatus?.status ===
              "rejected"
          ) {
            redirectPath = `/student-form/1`;
          }
          if (
            studentInfoData?.data?.studentInformation?.pageCount === 3 &&
            studentInfoData?.data?.studentInformation?.pageStatus?.status ===
              "requestedForReapproval"
          ) {
            redirectPath = `/student/account-deleted`;
          }
          if (redirectPath) {
            navigate(redirectPath, { state: "passPage" });
          }
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error || "Something went wrong");
      }
    } else {
      toast.error("Please fix the errors in the form");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };
  return (
    <div onKeyDown={handleKeyDown} className="login-container">
    <span className="font-poppins">
      <div className="flex justify-center space-x-6 my-4">
        <button
          onClick={() => handleTabChange("3")}
          className={`px-4 py-2 rounded-md w-36 ${
            activeTab === "3"
              ? "bg-primary text-white"
              : "bg-gray-200 text-secondary"
          }`}
        >
          Student
        </button>
        <button
          onClick={() => handleTabChange("2")}
          className={`px-4 py-2 rounded-md w-36 ${
            activeTab === "2"
              ? "bg-primary text-white"
              : "bg-gray-200 text-secondary"
          }`}
        >
          Agent
        </button>
      </div>

      <div>
        <div className="mt-6 text-secondary">Email Id</div>
        <CustomInput
          type="text"
          value={loginData.email}
          onChange={handleChange}
          name="email"
          placeHodler="Email"
          className="w-full bg-[#F2F5F7] outline-none mt-2 h-11 px-3 rounded-md"
        />
        {errors.email && (
          <div className="text-red-500 text-sm mt-1">{errors.email}</div>
        )}

        <div className="mt-6 text-secondary relative">
          Password
          <CustomInput
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={handleChange}
            name="password"
            className="w-full bg-[#F2F5F7] outline-none mt-2 h-11 px-3 "
            placeHodler="Password"
          />
          {errors.password && (
            <div className="text-red-500 text-sm mt-1">{errors.password}</div>
          )}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-3 top-9 text-[20px] flex items-center"
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>
        <Link
          state={{
            role: loginData.role,
            email: loginData.email,
            passPage: "passPage",
          }}
          to="/forgot-password"
          className="text-primary flex justify-end mt-2 text-[14px] cursor-pointer"
        >
          Forgot Password
        </Link>
        {/* Display "Logging in..." if loading */}
        {loading ? (
          <div className="text-center mt-4 text-primary">Logging in...</div>
        ) : (
          <div
            className="bg-primary px-6 py-2 cursor-pointer text-white text-center rounded-md mt-6"
            onClick={handleLogin}
          >
            Log in
          </div>
        )}

        <p className="text-secondary text-sm pt-4">
          Don't have an account?{" "}
          <Link to="/new-account" className="text-primary font-semibold">
            Register
          </Link>
        </p>
      </div>
    </span></div>
  );
};

export default LoginComponent;
