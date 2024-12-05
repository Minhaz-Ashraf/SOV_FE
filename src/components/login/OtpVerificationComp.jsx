import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  resendAgentOtp,
  resendStudentOtp,
  resetPassword,
} from "../../features/authApi";

const OtpVerificationComp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const location = useLocation();
  const emailId = location.state?.email;
  const roleType = location.state?.role;
  const navigate = useNavigate();

  // Timer countdown logic
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/, "");
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    try {
      const res = await resetPassword(roleType, emailId, otpValue);
      toast.success(res.message || "OTP verified successfully");
      localStorage.clear("email");
      navigate("/change-pass", {
        state: { email: emailId, role: roleType, otp: otpValue, passPage: "passPage" },
      });
    } catch (error) {
      toast.error(error.message || "Wrong OTP Entered");
      console.log(error);
    }
  };

  const handleResendOtp = () => {
    if (parseInt(roleType) === parseInt(3)) {
      const OtpSresend = async () => {
        try {
          const res = await resendStudentOtp(emailId);
          toast.success(res?.message || "OTP sent successfully");
        } catch (error) {
          console.log(error);
          toast.error(error.message || "Something went wrong");
        }
      };
      OtpSresend();
    } else if (parseInt(roleType) === parseInt(2)) {
      const OtpAresend = async () => {
        try {
          const res = await resendAgentOtp(emailId);
          toast.success(res?.message || "OTP sent successfully");
        } catch (error) {
          console.log(error);
          toast.error(error.message || "Something went wrong");
        }
      };
      OtpAresend();
    }
    setTimer(60);
    setResendDisabled(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex justify-center mt-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            className="w-14 h-12 mx-2 text-center border border-gray-300 rounded"
            maxLength={1}
          />
        ))}
      </form>

      <div className="flex flex-col-reverse justify-center items-center font-DMsans gap-2 mt-5">
        <span
          onClick={resendDisabled ? null : handleResendOtp}
          className={`px-8 py-2 cursor-pointer rounded-lg ${
            resendDisabled ? "text-gray-400" : "text-primary underline"
          }`}
        >
          {resendDisabled ? `Resend OTP (${formatTimer(timer)})` : "Resend OTP"}
        </span>

        <span
          onClick={handleSubmit}
          className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary w-72 text-center"
        >
          Submit
        </span>
      </div>
    </>
  );
};

export default OtpVerificationComp;
