import React from "react";
import Header from "../components/dashboardComp/Header";
import { FaStar } from "react-icons/fa";
import Sidebar from "../components/dashboardComp/Sidebar";
import ShortlistComponent from "../components/dashboardComp/ShortlistComponent";

const Shortlist = () => {
  return (
    <>
      <Header icon={<FaStar />} />
      <div className="">
        <span className="fixed overflow-y-scroll scrollbar-hide pt-6 bg-white ">
          <Sidebar />
        </span>
      </div>
      <ShortlistComponent
        headingText=" Your Shortlisted Universities & Colleges"
        bodyText="  Review the details, compare options, and proceed with the application process for your preferred institutions."
      />
    </>
  );
};

export default Shortlist;
