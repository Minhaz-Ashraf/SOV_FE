import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";

import { profileSkeleton } from "../assets";

import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import { getMemberProfile } from "../features/adminSlice";
import TabBar from "../components/dashboardComp/TabBar";
import TicketActivity from "../components/adminComps/TicketActivity";
import Header from "../components/dashboardComp/Header";
import ApplicationActivity from "../components/adminComps/ApplicationActivity";
import ApprovalActivity from "../components/adminComps/ApprovalActivity";
import TabBarTwo from './../components/TabBarTwo';

const TeamActivity = () => {
  const location = useLocation();
  const id = location?.state?.id;
  const { getMember } = useSelector((state) => state.admin);

  const dispatch = useDispatch();

 
  const tabs = [
    {
      name: "approvalActivity",
      label: "Approval Activity",
      component: ApprovalActivity,
      props: { id: id },
    },
    {
      name: "applicationActivity",
      label: "Application Activity",
      component: ApplicationActivity,
      props: { id: id },
    },
    {
      name: "ticketActivity",
      label: "Ticket Activity",
      component: TicketActivity,
      props: { id: id },
    },
  ];
  useEffect(() => {
    dispatch(getMemberProfile(id));
  }, []);
  // useEffect(() => {
  //   if (location.pathname !== "/admin/team-activity") {
  //     setActiveTab("pending");
  //     setSearchParams({ tab: "pending" });
  //   } else {
  //     setActiveTab(searchParams.get("tab") || "approvalActivity");
  //   }
  // }, [location.pathname, searchParams]);

  // const handleTabChange = (tabName) => {
  //   setActiveTab(tabName);
  //   setSearchParams({ tab: tabName });
  // };

  return (
    <>
      <Header customLink="/agent/shortlist" />

      <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
        <AdminSidebar />
      </span>

      <div>
        <span className="flex items-center pt-20 pb-6 md:pl-[18.5%] sm:pl-[27%] bg-white">
          <span>
            <div className="flex items-center gap-4 mt-1 ">
              <img
                src={getMember?.data?.profilePicture || profileSkeleton}
                alt="Profile"
                className="rounded-md w-28 h-28"
                onError={profileSkeleton}
                loading="lazy"
              />
              <span className="flex flex-col">
                <span className="text-primary font-medium text-[13px]">
                  Applications
                </span>
                <span className="text-sidebar text-[18px] font-medium ">
                  {getMember?.data?.firstName +
                    " " +
                    getMember?.data?.lastName || "NA"}
                </span>
                <span className="text-[14px] pt-[1px] text-body font-normal">
                  {getMember?.data?.email || "NA"}
                </span>
                <span className="text-[14px] text-body font-normal">
                  {getMember?.data?.phone || "NA"}
                </span>
                <span className="text-[14px] text-body font-normal">
                  ID: {getMember?.data?.teamId || "NA"}
                </span>
              </span>
            </div>
          </span>
        </span>

        <div className="sm:ml-14 md:ml-0">
          <TabBarTwo
            tabs={tabs}
            // activeTab={activeTab}
            // onTabChange={handleTabChange}
            // setActiveTab={setActiveTab}
          />
        </div>
      </div>
    </>
  );
};

export default TeamActivity;
