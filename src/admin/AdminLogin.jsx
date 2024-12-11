import React, { useState } from "react";
import Footer from "../components/Footer";
import { loginBanner, logo } from "../assets";
import ImageComponent, { CustomInput } from "../components/reusable/Input";
import { toast } from "react-toastify";
import { adminLogin } from "../features/adminApi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Mobile from "../components/Mobile";
import { useDispatch } from "react-redux";
import { adminProfileData } from "../features/adminSlice";

const AdminLogin = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setIsLogin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Validate email and password fields
  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!isLogin.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(isLogin.email)) {
      errors.email = "Invalid email address";
    }

    if (!isLogin.password) {
      errors.password = "Password is required";
    } else if (isLogin.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    return errors;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  // Handle login
  const handleLogin = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const role = "0";
      const { email, password } = isLogin;
      const res = await adminLogin(role, email, password);
      toast.success(res.message || "Login Successful");
      navigate("/admin/dashboard")
      dispatch(adminProfileData())

    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      <Mobile/>
      
    <div className="hidden sm:block md:block">

      <div className="flex flex-col min-h-screen font-poppins ">
        <div className="flex flex-row-reverse justify-between mx-6 sm:gap-9 flex-grow">
          <span>
            <ImageComponent
              src={loginBanner}
              className="md:w-[78vh] md:h-[90vh] sm:h-[60vh] rounded-xl md:mt-6 mb-5 mr-16 object-cover sm:mt-36"
            />
          </span>
          <span>
            <header>
              <ImageComponent src={logo} alt="logo" className="w-40 h-24" />
            </header>

            <p className="text-heading font-semibold text-[27px] md:ml-20 md:mt-3 xl:mt-20 sm:mt-28 ">
              Login Your Account
            </p>

            <span className="flex flex-col bg-white rounded-md md:w-[80vh] xl:w-[80vh] sm:w-[30vh] px-10 py-9 md:ml-20 mt-3">
              <p className="text-secondary text-[18px] font-medium">
                Login account as a admin
              </p>

              <span className="font-poppins">
                <div>
                  <div className="mt-6 text-secondary">Email Id</div>
                  <CustomInput
                    type="text"
                    value={isLogin.email}
                    onChange={handleChange}
                    name="email"
                    placeHodler="Email"
                    className="w-full bg-[#F2F5F7] outline-none mt-2 h-11 px-3 rounded-md"
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </div>
                  )}

                  <div className="mt-6 text-secondary relative">
                    Password
                    <CustomInput
                      type={showPassword ? "text" : "password"}
                      value={isLogin.password}
                      onChange={handleChange}
                      name="password"
                      className="w-full bg-[#F2F5F7] outline-none mt-2 h-11 px-3 "
                      placeHodler="Password"
                    />
                    {errors.password && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.password}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-3 top-9 text-[20px] flex items-center"
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>

                  {/* Display "Logging in..." if loading */}
                  {loading ? (
                    <div className="text-center mt-4 text-primary">
                      Logging in...
                    </div>
                  ) : (
                    <div
                      className="bg-primary px-6 py-2 cursor-pointer text-white text-center rounded-md mt-6"
                      onClick={handleLogin}
                    >
                      Log in
                    </div>
                  )}
                </div>
              </span>
            </span>
          </span>
        </div>

        <footer className="mt-auto">
          <Footer />
        </footer>
      </div></div>

    </>
  );
};

export default AdminLogin;
