import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Header from "../components/dashboardComp/Header";
import { useDispatch, useSelector } from "react-redux";
import { applicationById } from "../features/agentSlice";
import OfferLetterEducationDetails from "../components/dashboardComp/editfiles/OfferLetterEducationDetails";
import IeltsScore from "../components/dashboardComp/editfiles/IeltsScore";
import OfferLetterPreferences from "../components/dashboardComp/editfiles/OfferLetterPreferences";
import TofelScore from "../components/dashboardComp/editfiles/TofelEdit";
import PteScoreEdit from "../components/dashboardComp/editfiles/PteScoreEdit";
import CertificateEdit from "../components/dashboardComp/editfiles/CertificateEdit";
import { toast } from "react-toastify";
import { applicationReSubmit } from "../features/generalApi";
import OffLetterPersonalInfo from "../components/dashboardComp/editfiles/OffLetterPersonalInfo";
import Sidebar from "../components/dashboardComp/Sidebar";
import socketServiceInstance from "../services/socket";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";

const OfferLetterEdit = () => {
  const role = localStorage.getItem("role");
  const { applicationDataById } = useSelector((state) => state.agent);
  const { studentData } = useSelector((state) => state.general);
  const { agentData } = useSelector((state) => state.agent);
  const { studentInfoData } = useSelector((state) => state.student);
  const dispatch = useDispatch();
  const location = useLocation();
  const profileView = role === "0"
  const appId = location.state.id || location.state;
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    dispatch(applicationById(appId));
  }, [dispatch, isUpdated]);
  const handleProfileUpdate = () => {
    setIsUpdated((prev) => !prev);
  };
  
  const resSubmit = async () => {
    try {
      const section = "offerLetter";
      const res = await applicationReSubmit(appId, section);
      dispatch(applicationById(appId));
      toast.success(res.message || "Application Re-Submitted");
      if (role === "2" ) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " STUDENT_RESUBMITTED_OFFER_LETTER",
            message: `${studentInfoData?.data?.studentInformation?.personalInformation.firstName + " " + studentInfoData?.data?.studentInformation?.personalInformation.lastName}  ${studentInfoData?.data?.studentInformation?.stId}  has resubmitted the offer letter application   ${applicationDataById?.applicationId} of    ${applicationDataById?.offerLetter?.preferences?.institution} ${applicationDataById?.offerLetter?.preferences?.institution}`,
            path: "/admin/applications-review",
            recieverId: "",
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_STUDENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (role === "3") {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: " STUDENT_RESUBMITTED_OFFER_LETTER",
            message: `${studentInfoData?.data?.studentInformation?.personalInformation.firstName + " " + studentInfoData?.data?.studentInformation?.personalInformation.lastName}  ${studentInfoData?.data?.studentInformation?.stId}  has resubmitted the offer letter application   ${applicationDataById?.applicationId} of    ${applicationDataById?.offerLetter?.preferences?.institution} ${applicationDataById?.offerLetter?.preferences?.institution}`,
            path: "/admin/applications-review",
            recieverId: "",
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_STUDENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      {profileView === "/admin/applications-review" ? (
        ""
      ) : (
        <>
          <Header customLink="/agent/shortlist" />
          <div>
            <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
            {role === "3" ? <Sidebar /> : role === "2" ? <AgentSidebar /> : <AdminSidebar/> }
            </span>
          </div>
        </>
      )}
      <div className="bg-white">
        {profileView === "/admin/applications-review" ? (
          ""
        ) : (
          <span className="flex items-center justify-between pr-7 md:pt-20 sm:pt-28 md:ml-[16.5%] sm:ml-[20%] ">
            <span>
              <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
                Offer Letter
              </p>
              <p className="mt-1 font-normal text-body mb-5 ml-9">
                View and Edit your offer Letter
              </p>
            </span>
            {applicationDataById?.offerLetter?.status === "rejected" &&
              ( role !== "0" && role !== "1" ) && (
              <span
                onClick={resSubmit}
                className="px-6 py-2 bg-primary rounded-md text-white cursor-pointer"
              >
                Re-Submit
              </span>
            )}
          </span>
        )}
      </div>
      <div
        className={`${
          profileView === "/admin/applications-review"
            ? " mx-44 mt-20"
            : " ml-[19.5%] mt-9 mr-6"
        }  `}
      >
        <OffLetterPersonalInfo
          appId={appId}
          updatedData={handleProfileUpdate}
          profileViewPath={profileView}
        />
      </div>
      <div
        className={`${
          profileView === "/admin/applications-review"
            ? " mx-44 mt-20"
            : " ml-[19.5%] mt-9 mr-6"
        }  `}
      >
        <OfferLetterEducationDetails
          appId={appId}
          updatedData={handleProfileUpdate}
          profileViewPath={profileView}
          userId={
            role === "2"
              ? applicationDataById?.studentInformationId
              : role === "3"
              ? studentInfoData?.data?.studentInformation?._id
              : null
          }
        
        />
      </div>
      <div
        className={`${
          profileView === "/admin/applications-review"
            ? " mx-44 mt-20"
            : " ml-[19.5%] mt-9 mr-6"
        }  `}
      >
        <OfferLetterPreferences
          appId={appId}
          updatedData={handleProfileUpdate}
          profileViewPath={profileView}
        />
      </div>
      <div
        className={`${
          profileView === "/admin/applications-review"
            ? " mx-44 mt-20"
            : " ml-[19.5%] mt-9 mr-6"
        }  `}
      >
        <IeltsScore
          appId={appId}
          updatedData={handleProfileUpdate}
          profileViewPath={profileView}
        />
      </div>
      <div
        className={`${
          profileView === "/admin/applications-review"
            ? " mx-44 mt-20"
            : " ml-[19.5%] mt-9 mr-6"
        }  `}
      >
        <PteScoreEdit
          appId={appId}
          updatedData={handleProfileUpdate}
          profileViewPath={profileView}
        />
      </div>
      <div
        className={`${
          profileView === "/admin/applications-review"
            ? " mx-44 mt-20"
            : " ml-[19.5%] mt-9 mr-6"
        }  `}
      >
        <TofelScore
          appId={appId}
          updatedData={handleProfileUpdate}
          profileViewPath={profileView}
        />
      </div>
      <div
        className={`${
          profileView
           === "/admin/applications-review"
            ? " mx-44 mt-20"
            : " ml-[19.5%] mt-9 mr-6"
        }  `}
      >
        <CertificateEdit
          appId={appId}
          updatedData={handleProfileUpdate}
          profileViewPath={profileView}
          userId={
            role === "2"
              ? applicationDataById?.studentInformationId
              : role === "3"
              ? studentInfoData?.data?.studentInformation?._id
              : null
          }
        />
      </div>
    </>
  );
};

export default OfferLetterEdit;
