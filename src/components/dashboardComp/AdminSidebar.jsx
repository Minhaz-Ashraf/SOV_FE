import React, { useEffect, useState } from "react";
import {
  BsFillCollectionFill,
  BsFillTicketPerforatedFill,
  BsPieChartFill,
} from "react-icons/bs";
import { FaPassport, FaUserCheck, FaUsers } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { IoDocumentTextSharp } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdDocumentScanner, MdOutlineHistory } from "react-icons/md";
import { AiFillQuestionCircle } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import LogoutPop from "../login/LogoutPop";
import ImageComponent from "../reusable/Input";
import { logo } from "../../assets";
import { FaUserGroup } from "react-icons/fa6";
import { setNullStudentDirectory } from "../../features/adminSlice";
import { useDispatch } from "react-redux";

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;
  const [isOpen, setIsOpen] = useState(
    JSON.parse(localStorage.getItem("isOpen")) ?? true
  );
  const [isLogoutOpen, setisLogoutOpen] = useState(false);

  const openLogoutPopup = () => {
    setisLogoutOpen(true);
  };

  const closeLogout = () => {
    setisLogoutOpen(false);
  };
  const sidebarList = [
    {
      pathPage: "/admin/dashboard",
      icon: <BsPieChartFill />,
      label: "Dashboard",
    },
    {
      pathPage: "/admin/student-directory",
      icon: <FaUsers />,
      label: "Students",
      otherPath: "/student-profile",
    },
    {
      pathPage: "/admin/agent-directory",
      icon: <FaUserGroup />,
      label: "Agents",
      otherPath: "/admin/agent-student",
      otherPathTwo: "/agent-profile",
    },
    {
      pathPage: "/admin/approvals",
      icon: <FaUserCheck />,
      label: "Approvals",
    },
    {
      pathPage: "/admin/application-list",
      icon: <IoDocumentTextSharp />,
      label: "Applications ",
      otherPath: "/admin/student-applications",
    },
    {
      pathPage: "/admin/applications-review",
      icon: <MdDocumentScanner />,
      label: "Applications Review",
      otherPath: "/coursefee-view",
      otherPathTwo: "/application-view",
      otherPathThree: "/visa-view",
    

    },
  ];

  const handleDispatch = () => {
    dispatch(setNullStudentDirectory());
  };
  useEffect(() => {
    localStorage.setItem("isOpen", JSON.stringify(isOpen));
  }, [isOpen]);
  return (
    <>
      <div className="bg-white md:w-[17.5vw] sm:w-[24vw] h-[100vh]  pb-6  overflow-y-auto scrollbar-hide border-r-2 border-[#E8E8E8]">
        <span>
          <ImageComponent
            src={logo}
            alt="logo"
            className="md:w-44 sm:w-32 md:h-24 sm:h-16 ml-2 "
          />
        </span>
        {sidebarList.map((item, index) => (
          <div
            key={index}
            className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium ${
              path === item.pathPage ||
              path === item?.otherPath ||
              path === item?.otherPathTwo ||
              path === item?.otherPathThree ||
              path === item?.otherPathFour
                ? "bg-[#FBD5D5] text-primary border-l-4 border-primary font-medium"
                : "text-sidebar"
            }`}
          >
            <Link
              to={item.pathPage}
              onClick={item.label === "Applications" ? handleDispatch() : null}
              className="flex items-center gap-3 px-6"
            >
              <span className="text-[20px]"> {item.icon}</span>{" "}
              <span>{item.label}</span>
            </Link>
          </div>
        ))}
        <div
          className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium ${
            path === "/admin/ticket"
              ? "bg-[#FBD5D5] text-primary border-l-4 border-primary font-medium"
              : "text-sidebar"
          }`}
        >
          <Link to="/admin/ticket" className="flex items-center gap-3 px-6">
            <span className="text-[20px]">
              {" "}
              <BsFillTicketPerforatedFill />
            </span>{" "}
            <span>Ticket Support</span>
          </Link>
        </div>
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
            <Link to="/admin/profile">
              <li
                className={`text-sidebar py-2 mb-2 cursor-pointer md:pl-14 lg:px-14 sm:pl-14 md:ml-0 hover:bg-[#f5ebeb] hover:text-primary ${
                  path === "/admin/profile" &&
                  "bg-[#FBD5D5] border-l-4 border-primary text-primary"
                }`}
              >
                Edit Profile
              </li>
            </Link>
            <Link to="/admin/change-password">
              <li
                className={`text-sidebar py-2 mb-2 cursor-pointer md:pl-[52px] sm:pl-14 md:ml-1  hover:bg-[#f5ebeb] hover:text-primary ${
                  path === "/admin/change-password" &&
                  "bg-[#FBD5D5] border-l-4 border-primary text-primary"
                }`}
              >
                Change Password
              </li>
            </Link>
            <Link to="/admin/change-email">
              <li
                className={`text-sidebar py-2 mb-2 cursor-pointer md:pl-14 sm:pl-14 md:ml-0  hover:bg-[#f5ebeb] hover:text-primary ${
                  path === "/admin/change-email" &&
                  "bg-[#FBD5D5] border-l-4 border-primary text-primary"
                }`}
              >
                Change Email
              </li>
            </Link>
            {/*   <Link to="/settings/delete-account">
              <li
                className={`text-sidebar py-2 mb-2 cursor-pointer md:px-14 sm:pl-14 md:ml-0  hover:bg-[#f5ebeb] hover:text-primary ${
                  path === "/settings/delete-account" &&
                  "bg-[#FBD5D5] border-l-4 border-primary text-primary"
                }`}
              >
                Delete Account
              </li>
            </Link> */}
          </ul>
        </div>
        {/* <div
          className={`cursor-pointer py-4 hover:bg-[#f5ebeb] hover:text-primary hover:border-l-4 hover:font-medium ${
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
          className={`cursor-pointer py-4 hover:bg-[#FBD5D5] hover:text-primary hover:border-l-4 hover:font-medium text-secondary`}
        >
          <div
            className="flex items-center gap-3 px-6 "
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

export default AdminSidebar;
