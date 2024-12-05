import React from "react";
import Header from "./dashboardComp/Header";
import AgentSidebar from "./dashboardComp/AgentSidebar";
import Sidebar from "./dashboardComp/Sidebar";

const HelpSupport = () => {
  const role = localStorage.getItem("role");
  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
        {role === "3" ? <Sidebar/> : role === "2" ? <AgentSidebar /> : null }
        </span>
      </div>
      <div className="bg-white rounded-md px-6 py-6 md:ml-[20%] sm:ml-[27%] font-poppins sm:mt-28 md:mt-22 mr-8 ">
        <p className="font-semibold text-sidebar text-[22px]">
          Bugs and Issues Report
        </p>
        <p className="font-semibod text-sidebar text-[17px]  mt-3 mb-2">Description :-</p>
        <p className="text-body text-[14px] md:pr-28">
          If you experience any issues or bugs while using this portal, please
          reach out to our development team for assistance. <br />
          We handle issues related to features and functionality, such as
          problems with: <br />
          <li>Form submission</li>
          <li>Adding a student</li>
          <li>Editing profiles or applications</li>
          <li>searching, Filtering and shortlisting</li>
          <li>And more</li>
          Our team is committed to resolving your concerns within 24 to 48
          hours. For a faster resolution, please include a screenshot or screen
          recording of the issue and your contact details when reporting it.{" "}
          <br />
          Thank you for helping us improve your experience with this portal.
        </p>
        <p className="font-semibod mt-2 text-sidebar text-[17px]">
          Contact Details :-
        </p>
        <p className=" text-body text-[14px]">
          {" "}
          <span className="font-semibold text-sidebar">Email:- </span>
          dev@sovportal.in
        </p>
      </div>
      <div className="bg-white rounded-md px-6 py-6 md:ml-[20%] sm:ml-[27%] font-poppins mt-10 mr-8 mb-20">
        <p className="font-semibold text-sidebar text-[22px]">
          Help and Support
        </p>
        <p className="font-semibod text-sidebar text-[17px] mt-3 mb-2">Description :-</p>
        <p className="text-body text-[14px] md:pr-28">
          If you encounter any issues related to general information—such as
          college details, courses, or offer letter pricing—please reach out to
          our operations team for support. These inquiries are handled by our
          operations department rather than the technical team. Our team aims to
          resolve these issues within 24 to 48 hours. To ensure a swift
          response, please include your contact details when submitting your
          request. Thank you for helping us serve you better.
          <br />
          Thank you for helping us serve you better.
        </p>
        <p className="font-semibod mt-2 text-sidebar text-[17px]">
          Contact Details :-
        </p>
        <p className=" text-body text-[14px]">
          {" "}
          <span className="font-semibold text-sidebar">Email:- </span>
          Support@sovportal.in, Info@sovportal.in
        </p>
      </div>
    </>
  );
};

export default HelpSupport;
