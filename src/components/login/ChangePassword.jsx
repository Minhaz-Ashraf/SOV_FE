import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { CustomInput } from "../reusable/Input";
import { changePassowrd } from "../../features/authApi";

const ChangePasswordComp = () => {
  const [loginData, setLoginData] = useState({
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const emailId = location.state?.email;
  const roleType = location.state?.role;
  const otp = location?.state?.otp
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShowConfirmPassword) => !prevShowConfirmPassword);
  };
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

  const validateFields = () => {
    const newErrors = {};

    if (!loginData.password) {
      newErrors.password = "Password is required";
    }

    if (!loginData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (loginData.password !== loginData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      try {
        const res = await changePassowrd(roleType, emailId, otp, loginData.password);
        toast.success(res.message || "Password Changed Successfully");
        navigate("/change-success", {state:{passPage: "passPage"}});
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong");
      }
    }
  };

  return (
    <span className="font-poppins">
      <div>
        {/* Password Field */}
        <div className=" text-secondary relative">
          Password
          <CustomInput
            type={showPassword ? "text" : "password"}
            value={loginData.password}
            onChange={handleChange}
            name="password"
            className="w-full bg-[#F2F5F7] outline-none mt-2 h-11 px-3"
            placeHolder="Password"
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

        {/* Confirm Password Field */}
        <div className="mt-6 text-secondary relative">
          Confirm Password
          <CustomInput
            type={showConfirmPassword ? "text" : "password"}
            value={loginData.confirmPassword}
            onChange={handleChange}
            name="confirmPassword"
            className="w-full bg-[#F2F5F7] outline-none mt-2 h-11 px-3"
            placeHolder="Confirm Password"
          />
          {errors.confirmPassword && (
            <div className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </div>
          )}
          <button
            type="button"
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-3 top-9 text-[20px] flex items-center"
          >
            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </button>
        </div>

        {/* Change Password Button */}
        <div
          className="bg-primary px-6 py-2 cursor-pointer text-white text-center rounded-md mt-6"
          onClick={handleSubmit}
        >
          Change Password
        </div>
      </div>
    </span>
  );
};

export default ChangePasswordComp;
