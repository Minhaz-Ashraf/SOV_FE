import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const VerifyPopUp = ({ isVerifyOpen, OtpResend, handleVerify, email }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (isVerifyOpen) {
      setIsResendDisabled(true);
      setTimer(60); 
    }
  }, [isVerifyOpen]);

  // Timer logic
  useEffect(() => {
    let interval;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false); 
    }

    return () => clearInterval(interval); 
  }, [isResendDisabled, timer]);

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/, "");
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const otpValue = otp.join("");
    try {
      const res = await handleVerify(otpValue);
      toast.success(res || "Verification Successful");
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
      console.log(error);
    } finally {
      setIsSubmitting(false); 
    }
  };
  

  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <>
      {isVerifyOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6 font-poppins`}
        >
          <div className="bg-white pb-9 rounded-lg md:w-[46%] w-full relative p-9">
            <p className="text-start text-heading font-bold text-[22px]">
              OTP Verification
            </p>
            <p className="text-start font-DMsans text-secondary font-normal text-[14px]">
              Please enter the OTP we’ve sent to your email {email}
            </p>
            <div className="flex justify-center mt-4">
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
            </div>
            <div className="flex flex-col-reverse justify-center items-center font-DMsans gap-2 mt-5">
              <span
                onClick={() => {
                  if (!isResendDisabled) OtpResend();
                }}
                className={`px-8 py-2  rounded-lg ${
                  isResendDisabled
                    ? "text-gray-400 "
                    : "text-primary underline cursor-pointer"
                }`}
              >
                {isResendDisabled ? `Resend OTP (${formatTimer(timer)})` : "Resend OTP"}
              </span>
              <span
                onClick={handleOtpSubmit}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary w-full text-center"
              >
              {isSubmitting ? "Submitting..." : "Submit"}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyPopUp;
