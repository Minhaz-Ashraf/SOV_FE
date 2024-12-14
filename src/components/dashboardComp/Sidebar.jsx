import React, { useEffect, useState } from "react";
import { BsFillCollectionFill, BsPieChartFill } from "react-icons/bs";
import { FaPassport } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoDocumentTextSharp } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdOutlineHistory } from "react-icons/md";
import { AiFillQuestionCircle } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import LogoutPop from "../login/LogoutPop";
import ImageComponent from "../reusable/Input";
import { logo } from "../../assets";
import DeleteAccount from "../DeleteAccountPop";
import { deleteStudentById } from "../../features/agentApi";
import socketServiceInstance from "../../services/socket";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(
    JSON.parse(localStorage.getItem("isOpen")) ?? true
  );
  const [isLogoutOpen, setisLogoutOpen] = useState(false);
  const [isOpenPop, setIsOpenPop] = useState(false);
  const studentId = localStorage.getItem("student");
  const openDeletePopup = () => {
    setIsOpenPop(true);
  };

  const closePop = () => {
    setIsOpenPop(false);
  };

  const openLogoutPopup = () => {
    setisLogoutOpen(true);
  };

  const closeLogout = () => {
    setisLogoutOpen(false);
  };

  const deleteAccountById = async () => {
    try {
      const res = await deleteStudentById(studentId);
      toast.success(res.message || "Account Deleted Successfully");
      localStorage.removeItem("student");
      localStorage.removeItem("role");
      localStorage.removeItem("userAuthToken");
      if (socketServiceInstance.isConnected()) {
        //from agent to admin
        const data = { userId: studentId, reason: "" };

        socketServiceInstance.socket.emit("DELETE_AUTH_TOKEN", data);
      } else {
        console.error("Socket connection failed, cannot emit notification.");
      }
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const sidebarList = [
    {
      pathPage: "/student/dashboard",
      icon: <BsPieChartFill />,
      label: "Dashboard",
    },
    {
      pathPage: "/student/document",
      icon: <BsFillCollectionFill />,
      label: "Documents",
    },
    {
      pathPage: "/student/application",
      icon: <IoDocumentTextSharp />,
      label: "Applications",
      otherPath: "/student/application",
      otherPathTwo: "/offerLetter-apply",
      otherPathThree: "/offerLetter/edit",
      otherPathFive: "/visa-apply",
      otherPathSix: "/visa/edit",
      otherPathSeven: "/course-fee/edit",
      otherPathEight: "/course-fee"

    },
    {
      pathPage: "/student/visa-update",
      icon: <FaPassport />,
      label: "Visa Updates",
    },
  ];
  useEffect(() => {
    localStorage.setItem("isOpen", JSON.stringify(isOpen));
  }, [isOpen]);
  return (
    <>
      <div className="bg-white md:w-[17.5vw] sm:w-[24vw] h-[100vh]  overflow-y-auto scrollbar-hide border-r-2 border-[#E8E8E8]">
        <span>
          <ImageComponent src={logo} alt="logo" className="w-44 h-24 ml-2 " />
        </span>
        {sidebarList.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium ${
                path === item.pathPage ||
              path === item?.otherPath ||
              path === item?.otherPathTwo ||
              path === item?.otherPathThree ||
              path === item?.otherPathFour ||
             path === item?.otherPathFive ||
             path === item?.otherPathSix ||
             path === item?.otherPathSeven ||
             path === item?.otherPathEight 


                ? "bg-[#FBD5D5] text-primary border-l-4 border-primary font-medium"
                : "text-sidebar"
            }`}
          >
            <Link to={item.pathPage} className="flex items-center gap-3 px-6">
              <span className="text-[20px]"> {item.icon}</span>{" "}
              <span>{item.label}</span>
            </Link>
          </div>
        ))}

        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center mt-2 bg-transparent py-2 relative hover:text-primary hover:bg-[#FBD5D5] px-5 text-sidebar cursor-pointer"
        >
          <span className="text-[23px]">
            <CgProfile />
          </span>
          <span className="flex items-center pl-[12px]">
            My Account
            {isOpen ? (
              <IoIosArrowUp className="text-[18px] absolute right-6" />
            ) : (
              <IoIosArrowDown className="absolute right-6" />
            )}
          </span>
        </div>

        {/* Dropdown menu */}
        <div
          className={`transition-all duration-500 ease-in-out overflow-hidden  ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="sm:mt-2 list-none text-[16px]">
            <Link to="/account/profile-edit">
              <li
                className={`text-sidebar py-2 mb-2 cursor-pointer md:pl-14 lg:px-14 sm:pl-14 md:ml-0 hover:bg-[#f5ebeb] hover:text-primary ${
                  path === "/account/profile-edit" &&
                  "bg-[#FBD5D5] border-l-4 border-primary text-primary"
                }`}
              >
                Edit Profile
              </li>
            </Link>

            <Link to="/settings/change-password">
              <li
                className={`text-sidebar py-2 mb-2 cursor-pointer md:pl-14 sm:pl-14 md:ml-0  hover:bg-[#f5ebeb] hover:text-primary ${
                  path === "/settings/change-password" &&
                  "bg-[#FBD5D5] border-l-4 border-primary text-primary"
                }`}
              >
                Change Password
              </li>
            </Link>
            <Link to="/settings/change-email">
              <li
                className={`text-sidebar py-2 mb-2 cursor-pointer md:px-14 sm:pl-14 md:ml-0  hover:bg-[#f5ebeb] hover:text-primary ${
                  path === "/settings/change-email" &&
                  "bg-[#FBD5D5] border-l-4 border-primary text-primary"
                }`}
              >
                Change Email
              </li>
            </Link>
            <Link to="/settings/delete-account">
              <li
                className={`text-sidebar py-2 mb-2 cursor-pointer md:px-14 sm:pl-14 md:ml-0  hover:bg-[#f5ebeb] hover:text-primary ${
                  path === "/settings/delete-account" &&
                  "bg-[#FBD5D5] border-l-4 border-primary text-primary"
                }`}
              >
                Delete Account
              </li>
            </Link>
          </ul>
        </div>
        {/* <div
        className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium ${
          path === "/student/payment-details"
            ? "bg-[#FBD5D5] text-primary border-l-4 border-primary font-medium"
            : "text-sidebar"
        }`}
      >
        <Link
          to="/student/payment-details"
          className="flex items-center gap-3 px-6"
        >
          <span className="text-[20px]">
            {" "}
            <MdOutlineHistory />
          </span>{" "}
          <span>Payment Details</span>
        </Link>
      </div> */}

        <div
          className={`cursor-pointer py-4 hover:bg-[#f5ebeb] hover:text-primary hover:border-l-4 hover:font-medium ${
            path === "/help-support"
              ? "bg-[#FBD5D5] text-primary border-l-4 border-primary font-medium"
              : "text-sidebar"
          }`}
        >
          <Link
            to="/help-support"
            className="flex items-center gap-3 md:pl-6 lg:px-6 sm:pl-6 "
          >
            <span className="text-[20px]">
              {" "}
              <AiFillQuestionCircle />
            </span>{" "}
            <span>Help & Support</span>
          </Link>
        </div>

        <div
          className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium text-secondary`}
        >
          <div
            className="flex items-center gap-3 px-6"
            onClick={openLogoutPopup}
          >
            <span className="text-[20px]">
              {" "}
              <RiLogoutBoxRLine />
            </span>{" "}
            <span>Logout</span>
          </div>
        </div>
        <p className="text-secondary pl-6 pt-8 font-bold text-[14px]">
          SOV PORTAL
        </p>
        <p className="font-light text-secondary pl-6 text-[12px] pt-1 mb-20">
          © 2024 All Rights Reserved
        </p>
      </div>
      <LogoutPop isLogoutOpen={isLogoutOpen} closeLogout={closeLogout} />
   
    </>
  );
};

export default Sidebar;
