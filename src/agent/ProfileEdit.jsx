import React, { useEffect, useState } from "react";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Header from "../components/dashboardComp/Header";
import { useDispatch, useSelector } from "react-redux";
import { profileSkeleton } from "../assets";
import AgentProfileEdit from "../components/dashboardComp/editfiles/AgentProfileEdit";
import { useLocation } from "react-router-dom";
import { agentInformation } from "../features/agentSlice";
import { agentDataProfile } from "./../features/adminSlice";
import Loader from "../components/Loader";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";

const ProfileEdit = () => {
  const { agentData } = useSelector((state) => state.agent);
  const { agentProfile } = useSelector((state) => state.admin);
  const role = localStorage.getItem("role");
  const agentProfileData = role === "0" ? agentProfile : agentData;
  const location = useLocation();
  const id = location?.state?.id;
  console.log(location);
  const profileData = agentData.length <= 0 ? id : agentData;
  const dispatch = useDispatch();
  const profileView = location?.state?.isprofileView;
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [loading, setLoading] = useState(true);
  console.log(agentData);
  useEffect(() => {
    if (role !== "0") {
      dispatch(agentInformation());
    }
  }, [dispatch, profileUpdated]);

  useEffect(() => {
    if (role === "0") {
      dispatch(agentDataProfile(id));
    }
  }, [dispatch]);
  const handleProfileUpdate = () => {
    setProfileUpdated((prev) => !prev);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      {profileView === "/admin/approvals" ||
      profileView === "/admin/applications-review" ? (
        ""
      ) : (
        <Header customLink="/agent/shortlist" />
      )}
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review" ? (
            ""
          ) : location?.state?.adminState === "/admin/agent-directory" ? (
            <AdminSidebar />
          ) : (
            <AgentSidebar />
          )}
        </span>
      </div>
      {loading ? ( // Display loading indicator
        <div
          className={`w-1 ml-[50%] mt-52 ${
            role === "0" ? "ml-[50%]" : "ml-[55%]"
          }`}
        >
          <Loader />
        </div>
      ) : (
        <div>
          <span
            className={`flex items-center bg-white ${
              profileView === "/admin/approvals" ||
              profileView === "/admin/applications-review"
                ? " mx-44 px-6 mt-10 pt-6"
                : " md:pl-[18.5%] sm:pl-[27%] pt-20"
            }`}
          >
            <span>
              <div className="flex items-center gap-4 mt-1 mb-6">
                <img
                  src={
                    agentProfileData?.primaryContact?.profilePicture ||
                    profileSkeleton
                  }
                  alt="Profile"
                  className="rounded-md w-28 h-28"
                  onError={profileSkeleton}
                  loading="lazy"
                />
                <span className="flex flex-col">
                  <span className="text-sidebar text-[18px] font-medium ">
                    {agentProfileData?.companyDetails?.businessName || "NA"}
                  </span>
                  <span className="text-[14px] pt-[1px] text-body font-normal">
                    {agentProfileData?.agentEmail || "NA"}
                  </span>
                  <span className="text-[14px] text-body font-normal">
                    {agentProfileData?.companyDetails?.phoneNumber || "NA"}
                  </span>
                  <span className="text-[14px] text-body font-normal">
                    ID: {agentProfileData?.agId || "NA"}
                  </span>
                </span>
              </div>
            </span>
          </span>

          <div
            className={`${
              profileView === "/admin/approvals" ||
              profileView === "/admin/applications-review"
                ? " mx-44"
                : " mr-6 mt-6 md:ml-[18.5%] sm:ml-[27%]"
            }`}
          >
            {!loading && (
              <AgentProfileEdit
                agentData={agentProfileData}
                locationPath={location}
                updateData={handleProfileUpdate}
                adminId={agentProfile?._id}
                agentId={id}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileEdit;
