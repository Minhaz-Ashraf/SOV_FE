import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getOtpToResetPassword } from "../../features/authApi";
import Register from "../reusable/Register";

const ForgotPasswordComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roleType = location?.state?.role;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleInput = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the submit is initiated
    try {
      const res = await getOtpToResetPassword(roleType, email);
      toast.success(res.message || "Otp Sent to your email");

      navigate("/otp-verify", {
        state: { email: email, role: roleType, passPage: "passPage" },
      });
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
      console.log(error);
      setLoading(false);

    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="-mt-6">
        <Register
          imp="*"
          type="email"
          label="Registered Email Id"
          value={email}
          name="email"
          handleInput={handleInput}
        />
      </div>
      <span
        onClick={handleSubmit}
        className="text-white font-poppins bg-primary cursor-pointer rounded-md py-2 text-center mt-6"
      >
        {loading ? "Sending OTP..." : "Send OTP"} {/* Change text based on loading state */}
      </span>
      <Link
        to="/login"
        className="cursor-pointer text-primary underline text-center mt-6"
      >
        Back to Login
      </Link>
    </>
  );
};

export default ForgotPasswordComponent;
