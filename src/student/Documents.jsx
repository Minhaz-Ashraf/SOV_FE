import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import Sidebar from "../components/dashboardComp/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useSearchParams } from "react-router-dom";
import { studentInfo } from "../features/studentSlice";
import { studentById } from "../features/generalSlice";
import StudentRecieveDocument from "../components/dashboardComp/StudentRecieveDocument";
import StudentuplaodDocument from "./../components/dashboardComp/StudentuplaodDocument";
import TabBar from "../components/dashboardComp/TabBar";

const Documents = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  // const [isLoading, setIsLoading] =useState()
  const { studentInfoData } = useSelector((state) => state.student);
  const studentId = studentInfoData?.data?.studentInformation?._id
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "myDocument"
  );
  const studentData =
    role === "0"
      ? useSelector((state) => state.admin.getStudentDataById)
      : role === "3"
      ? studentInfoData?.data
      : useSelector((state) => state.general.studentData);
  const dispatch = useDispatch();
  const profileView = location.state?.isprofileView;
  const [profileUpdated, setProfileUpdated] = useState(false);
  useEffect(() => {
    dispatch(studentInfo(studentId));
    dispatch(studentById(studentId));
  }, [dispatch, profileUpdated, studentId]);

  const handleProfileUpdate = () => {
    setProfileUpdated((prev) => !prev);
  };

  const tabs = [
    {
      name: "myDocument",
      label: "My Document",
      component: StudentuplaodDocument,
      props: {
        data: studentData?.studentInformation,
        profileView: profileView,
        updateData: handleProfileUpdate,
        studentId: studentId,
      },
    },
    {
      name: "recieveDocument",
      label: "Recieved Document",
      component: StudentRecieveDocument,
      props: {
        data: studentData?.studentInformation,
        profileView: profileView,
        updateData: handleProfileUpdate,
        studentId: studentId,
      },
    },
  ];

  useEffect(() => {
    // Check the pathname and reset the active tab if needed
    if (location.pathname !== "/student/document") {
      setActiveTab("myDocument");
      setSearchParams({ tab: "myDocument" }); // Update the search params
    } else {
      setActiveTab(searchParams.get("tab") || "myDocument"); // Set from search params
    }
  }, [location.pathname, searchParams]);

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    setSearchParams({ tab: tabName });
  };

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
        <Sidebar />
      </span>
      <div className="ml-[17%] pt-16 pb-8 bg-white  font-poppins  ">
        <span className="flex items-center">
          <p className="text-[28px] font-bold text-sidebar mt-6 md:ml-9  sm:ml-20">
            Documents
          </p>
        </span>
        <p className="text-[16px] font-normal text-sidebar  md:ml-9  sm:ml-20">
          Here you can view and manage all your uploaded and recieved documents.
        </p>
      </div>
      <div className="sm:ml-[9%] md:ml-0">
        <TabBar
          tabs={tabs}
          activeTab={activeTab} onTabChange={handleTabChange} 
        />
      </div>
    </>
  );
};

export default Documents;
