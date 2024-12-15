import React, { useEffect, useState } from "react";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import Header from "../components/dashboardComp/Header";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { studentById } from "../features/generalSlice";
import { profileSkeleton } from "../assets";
import TabBar from "../components/dashboardComp/TabBar";
import studentEdit from "../components/dashboardComp/editfiles/studentEdit";
import { StatusComp } from "../components/dashboardComp/InstituteCard";
import Loader from "../components/Loader";
import { getStudentById } from "../features/adminSlice";
import Sidebar from "../components/dashboardComp/Sidebar";
import { studentInfo } from "../features/studentSlice";
import VisaEdit from "./VisaEdit";
import VisaStatusComponent from "../components/dashboardComp/VisaStatusComponent";
import Applications from "./Applications";
import ApplicationView from "./ApplicationView";
import StudentuplaodDocument from "./../components/dashboardComp/StudentuplaodDocument";
import StudentRecieveDocument from "../components/dashboardComp/StudentRecieveDocument";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import TabBarTwo from "../components/TabBarTwo";

const StudentProfile = () => {
  const role = localStorage.getItem("role");
  const id = localStorage.getItem("student");
  const { studentInfoData } = useSelector((state) => state.student);

  const studentData =
    role === "0"
      ? useSelector((state) => state.admin.getStudentDataById)
      : role === "3"
      ? studentInfoData?.data
      : useSelector((state) => state.general.studentData);

  const location = useLocation();
  const dispatch = useDispatch();
  console.log(location);
  const studentId =
    role === "3"
      ? id || location.state.notifyId
      : location?.state?.id || location?.state?.notifyId;

  const profileView = location.state?.isprofileView;
  const [isLoading, setIsLoading] = useState(true);
  const [profileUpdated, setProfileUpdated] = useState(false);
  useEffect(() => {
    if (role === "0") {
      dispatch(getStudentById(studentId));
    }
    if (role === "3") {
      dispatch(studentInfo(studentId));
    }
    dispatch(studentById(studentId));
  }, [dispatch, profileUpdated, studentId]);

  const handleProfileUpdate = () => {
    setProfileUpdated((prev) => !prev);
  };

  const allTabs = [
    {
      name: "profile",
      label: "Profile",
      component: studentEdit,
      props: {
        data: studentData?.studentInformation,
        profileView: profileView,
        updateData: handleProfileUpdate,
        studentId: studentId,
        adminPath: location.state?.adminState,
      },
    },

    {
      name: "uploadDocument",
      label: "Upload Document",
      component: StudentuplaodDocument,
      props: {
        data: studentData?.studentInformation,
        profileView: profileView,
        updateData: handleProfileUpdate,
        studentId: studentId,
        adminPath: location.state?.adminState,
      },
    },
    {
      name: "recieveDocument",
      label: "Recieve Document",
      component: StudentRecieveDocument,
      props: {
        data: studentData?.studentInformation,
        profileView: profileView,
        updateData: handleProfileUpdate,
        studentId: studentId,
        adminPath: location.state?.adminState,
      },
    },
    {
      name: "applications",
      label: "Applications",
      component: ApplicationView,
      props: {
        data: studentData?.studentInformation,
        profileView: profileView,
        updateData: handleProfileUpdate,
        stId: studentId,
        adminPath: location.state?.adminState,
        adminAccess: location?.state?.id,
      },
    },
    {
      name: "visaStatus",
      label: "Visa Status",
      component: VisaStatusComponent,
      props: {
        data: studentData?.studentInformation,
        profileView: profileView,
        updateData: handleProfileUpdate,
        studentId: studentId,
        adminPath: location.state?.adminState,
        adminAccess: location?.state?.id,
      },
    },
  ];
  console.log(location);
  const tabs =
    role === "3" ? allTabs.filter((tab) => tab.name === "profile") : allTabs;
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const statusFive =
    studentData?.flags?.visaApproved === "approved" ||
    studentData?.flags?.visaApproved === "approvedbyembassy" ||
  studentData?.flags?.visaApproved === "withdrawalrequest" ||
  studentData?.flags?.visaApproved === "withdrawalcomplete" ||
  studentData?.flags?.visaApproved === "rejectedbyembassy"
    ? "done"
    : studentData?.flags?.visaApproved === "reject"
    ? "pending"
    : "current";

  const statusSix =
  
    studentData?.flags?.visaApproved === "approvedbyembassy" ||
    studentData?.flags?.visaApproved === "visagranted"
      ? "done"
      : 
        studentData?.flags?.visaApproved === "rejectedbyembassy" ||
        studentData?.flags?.visaApproved === "withdrawalrequest" ||
        studentData?.flags?.visaApproved === "withdrawalcomplete"
      ? "pending"
      : "current";
  return (
    <>
      {profileView === "/admin/approvals" ||
      profileView === "/admin/applications-review" ? (
        ""
      ) : (
        <>
          <Header customLink="/agent/shortlist" />
          <div>
            <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
              {role === "3" ? (
                <Sidebar />
              ) : role === "2" ? (
                <AgentSidebar />
              ) : role === "0" ? (
                <AdminSidebar />
              ) : null}
            </span>
          </div>{" "}
        </>
      )}
      {isLoading ? (
        <div className="w-1 ml-[50%] mt-52">
          <Loader />
        </div>
      ) : (
        <>
          <div>
            {profileView === "/admin/approvals" ||
            profileView === "/admin/applications-review" ||
            role === "0" ||
            location?.state?.adminState ||
            role === "3" ? (
              ""
            ) : (
              <div className="pt-20 md:ml-[17.5%] md:pl-0 sm:pl-[25%] bg-white">
                <StatusComp
                  statusOne={
                    studentData?.studentInformation?.pageStatus?.status ===
                    "completed"
                      ? "done"
                      : "pending"
                  }
                  statusTwo={
                    studentData?.flags?.offerLetterApproved === "approved" ? "done" :   studentData?.flags?.offerLetterApproved === "rejected" ? "pending"  : "current"
                  }
                  statusFive={statusFive}
                  statusFour={
                    studentData?.flags?.courseFeeApproved === "approved"
                      ? "done"
                      : studentData?.flags?.courseFeeApproved === "rejected"
                      ? "pending"
                      : "current"
                  }
                  statusSix={statusSix}
                />
                {/* {console.log(studentData?.flags) } */}
              </div>
            )}

            <span
              className={`flex items-center   bg-white ${
                profileView === "/admin/approvals" ||
                profileView === "/admin/applications-review"
                  ? " mx-44 px-6 mt-10 pt-6 pb-10"
                  : role === "3"
                  ? "pt-20  pl-[19.5%] pb-6"
                  : location?.state?.adminState
                  ? " pl-[19.5%] pt-20 pb-6"
                  : `pl-[19.5%] ${role === "0" ? "pt-[75px] " : "pt-[25px]"} pb-6`
              }`}
            >
              <span>
                <div className="flex items-center gap-4 mt-1 md:ml-0 sm:ml-[17%] ">
                  <img
                    src={
                      studentData?.studentInformation?.personalInformation
                        ?.profilePicture || profileSkeleton
                    }
                    alt="Profile"
                    className="rounded-md w-28 h-28"
                    onError={profileSkeleton}
                    loading="lazy"
                  />
                  <span className="flex flex-col">
                    <span className="text-sidebar text-[18px] font-medium ">
                      {studentData?.studentInformation?.personalInformation
                        ?.firstName +
                        " " +
                        studentData?.studentInformation?.personalInformation
                          ?.lastName || "NA"}
                    </span>
                    <span className="text-[14px] pt-[1px] text-body font-normal">
                      {studentData?.studentInformation?.personalInformation
                        ?.email || "NA"}
                    </span>
                    <span className="text-[14px] text-body font-normal">
                      {studentData?.studentInformation?.personalInformation
                        ?.phone?.phone || "NA"}
                    </span>
                    <span className="text-[14px] text-body font-normal">
                      ID: {studentData?.studentInformation?.stId || "NA"}
                    </span>
                  </span>
                </div>
              </span>
            </span>

            <div className="sm:ml-[9%] md:ml-0 ">
              <TabBarTwo tabs={tabs} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default StudentProfile;
