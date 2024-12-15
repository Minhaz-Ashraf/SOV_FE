import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "./Header";
import AgentSidebar from "./AgentSidebar";
import { useSelector } from "react-redux";
import {
  confirmUpdateEmail,
  getOtpToChageEmail,
} from "../../features/generalApi";
import greenCheck from "../../assets/greenCheck.png"; // Make sure to update the path
import socketServiceInstance from "../../services/socket";

const DashboardEmailOtp = () => {
  const { agentData } = useSelector((state) => state.agent);
  const { studentInfoData } = useSelector((state) => state.student);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [isOtpConfirmed, setIsOtpConfirmed] = useState(false); // Track OTP confirmation
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const userId =
    role === "3"
      ? studentInfoData?.data?.studentInformation?._id
      : agentData?._id;

  const currentEmail =
    role === "2"
      ? agentData?.agentEmail
      : role === "3"
      ? studentInfoData?.data?.studentInformation?.personalInformation?.email
      : null;

  const newEmail = location.state;

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

  const handleSubmit = async () => {
    const otpValue = otp.join("");

    try {
      const updatedPayload = {
        otp: otpValue,
        email: newEmail,
      };
      const res = await confirmUpdateEmail(updatedPayload);

      if (res.statusCode === 200) {
        setIsOtpConfirmed(true);
        toast.success(
        
            " Your registered email has been successfully updated. Please log in using your new email to regain access to your account"
        );
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const data = { userId: userId, reason: "password changed" };

          socketServiceInstance.socket.emit("DELETE_AUTH_TOKEN", data);
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
        // Redirect to the login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
          localStorage.removeItem("userAuthToken");
          localStorage.removeItem("role");
          localStorage.removeItem("student");


        }, 3000);
      } else {
        throw new Error("Invalid OTP");
      }
    } catch (error) {
      toast.error(error.message || "Wrong OTP Entered");
      console.error(error);
    }
  };

  const handleResendOtp = async () => {
    try {
      const payload = { email: currentEmail };
      const res = await getOtpToChageEmail(payload);
      toast.success(res?.message || "OTP sent successfully");
      setTimer(60);
      setResendDisabled(true);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          <AgentSidebar />
        </span>
      </div>
      <div className="font-poppins">
        <span className="flex md:flex-row sm:flex-col items-center bg-white mt-16 md:ml-[16.5%] sm:ml-[10%] pb-6">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Change Email Address
            </p>
            <p className="mt-1 md:font-normal sm:font-light text-body md:pr-[8%] sm:pr-[20%] ml-9">
              Enter the OTP sent to your registered email for confirmation.
            </p>
          </span>
        </span>
        <div className="bg-white py-6 mb-2 md:ml-[31.5%] md:mr-[16%] sm:ml-[39%] mt-12 text-[20px] sm:mx-[16%] text-secondary">
          {isOtpConfirmed ? (
            <div className="flex flex-col justify-center w-full items-center">
              <img
                src={greenCheck}
                alt="Success"
                loading="lazy"
                className="w-24 h-24"
              />
              <p className="text-secondary font-poppins text-[22px] mt-6">
                Email changed successfully!
              </p>
              <p className="text-green-500 font-poppins text-[16px]">
                We’re redirecting you to the login page...
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                className="flex justify-center mt-4"
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    className="w-14 h-12 mx-2 text-center border border-gray-300 rounded"
                    maxLength={1}
                    autoFocus={index === 0}
                  />
                ))}
              </form>

              <div className="flex flex-col-reverse justify-center items-center font-DMsans gap-2 mt-5">
                <span
                  onClick={!resendDisabled ? handleResendOtp : undefined}
                  className={`px-8 py-2 cursor-pointer rounded-lg ${
                    resendDisabled ? "text-gray-400" : "text-primary underline"
                  }`}
                >
                  {resendDisabled
                    ? `Resend OTP (${formatTimer(timer)})`
                    : "Resend OTP"}
                </span>

                <button
                  onClick={handleSubmit}
                  className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary w-72 text-center mt-4"
                  type="button"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardEmailOtp;
