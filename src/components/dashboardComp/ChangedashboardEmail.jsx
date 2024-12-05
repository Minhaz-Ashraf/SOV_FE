import React, { useState } from "react";
import AgentSidebar from "./AgentSidebar";
import Header from "./Header";
import { CustomInput } from "../reusable/Input";
import { toast } from "react-toastify";
import { getOtpToChageEmail } from "../../features/generalApi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const ChangeDashboardEmail = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const { agentData } = useSelector((state) => state.agent);
  const { studentInfoData } = useSelector((state) => state.student);
  const [newMail, setNewMail] = useState("");
  const [confirmNewMail, setConfirmNewMail] = useState("");
  const currentEmail =
    role === "2"
      ? agentData?.agentEmail
      : role === "3"
      ? studentInfoData?.data?.studentInformation?.personalInformation?.email
      : null;

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "newMail") {
      setNewMail(value);
    } else if (name === "confirmNewMail") {
      setConfirmNewMail(value);
    }
  };

  const handleOtp = async () => {
    if (newMail !== confirmNewMail) {
      toast.error("New email and confirmation email do not match.");
      return;
    }

    try {
      const payload = {
        email: currentEmail,
      };

      const res = await getOtpToChageEmail(payload);
      toast.success(res.message || "OTP sent to your registered email");

      if (res.statusCode === 200) {
        navigate("/settings/otp-confirm", { state: newMail });
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
      <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
         {role === "2" ?<AgentSidebar />  : <Sidebar/>  } 
        </span>
      </div>
      <div className="font-poppins">
        <span className="flex md:flex-row sm:flex-col items-center bg-white mt-20 md:ml-[16.5%] sm:ml-[22%] pb-6">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Change Email Address
            </p>
            <p className="mt-1 md:font-normal sm:font-light text-body md:pr-[8%] sm:pr-[20%] ml-9">
              Enter your new email address and we’ll send you an OTP on your new
              email for confirmation.
            </p>
          </span>
        </span>

        <div className="flex flex-row gap-2 items-center mb-2 md:ml-[31.5%] md:mr-[16%] sm:ml-[26%] mt-12 text-[20px] sm:mx-[22%] text-secondary">
          <span className="font-semibold">Current Email</span>
        </div>
        <div className="bg-white rounded-md mb-20 md:ml-[31.5%] md:mr-[16%] px-8 py-10 sm:ml-[26%] ">
          <CustomInput
            type="email"
            className="h-11 md:w-full sm:w-48 rounded-md text-body bg-input pl-3 border border-[#E8E8E8] outline-none"
            value={currentEmail}
            readOnly
          />
          <div className = "mt-5">
          <CustomInput
            type="email"
            name="newMail"
            className="h-11 md:w-full sm:w-48 rounded-md text-body bg-input pl-3 border border-[#E8E8E8] outline-none"
            placeHodler="Enter new Email Address"
            value={newMail}
            onChange={handleInput}
          /></div>
          <div className = "mt-5">

          <CustomInput
            type="email"
            name="confirmNewMail"
            className="h-11 md:w-full sm:w-48 rounded-md text-body bg-input pl-3 border border-[#E8E8E8] outline-none"
            placeHodler="Confirm new Email Address"
            value={confirmNewMail}
            onChange={handleInput}
          /></div>
          <div
            onClick={handleOtp}
            className="text-white bg-primary text-center py-2 rounded-md mt-9 cursor-pointer"
          >
            Send OTP
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangeDashboardEmail;
 