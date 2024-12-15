import React, { useEffect, useState } from "react";
import AdminCard from "./AdminCard";
import { toast } from "react-toastify";
import {
  changeApprovalStatus,
  chngeApplicationStatus,
} from "../../features/adminApi";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTabType } from "../../features/adminSlice";
import { DataNotFound } from "../Dnf";
import socketServiceInstance from "../../services/socket";
import Loader from "../Loader";

const Pending = ({ data }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [approvalUpdated, setApprovalUpdated] = useState(false);
  const [applicationUpdated, setApplicationUpdated] = useState(false);
  const fetchStatus =
    location.pathname === "/admin/applications-review"
      ? "underreview"
      : "notapproved";
  const handleApprovalUpdate = () => {
    setApprovalUpdated((prev) => !prev);
  };
  const handleApplicationUpdate = () => {
    setApplicationUpdated((prev) => !prev);
  };

  useEffect(() => {
    dispatch(setTabType(fetchStatus));
  }, [dispatch, applicationUpdated, approvalUpdated, location.pathname]);

  const updateStatus = async (id, status, type, message) => {
    try {
      const res = await changeApprovalStatus(id, status, type, message);
      handleApprovalUpdate();
      
      toast.success(res.message || "Approval Status Updated");
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };
  const applicationStatus = async (id, status, type, message, applicationData, mgdbId) => {
    try {
      const res = await chngeApplicationStatus(id, status, type, message);
      handleApplicationUpdate();

      if (applicationData.customUserId.startsWith("AG")) {
        let notificationTitle = "";
        let notificationMessage = "";
        let path = "";
        let pathData = "";
          
        if (type === "courseFeeApplication") {
          notificationTitle = status === "approved" 
            ? "COURSE_FEE_APPROVED_AGENT" 
            : "COURSE_FEE_REJECTED_AGENT";
          notificationMessage = status === "approved"
            ? `Course Fee Application (${applicationData.applicationId})  has been approved for the ${applicationData.fullName} ${applicationData.studentId}`
            : `Course Fee Application (${applicationData.applicationId})  has been rejected for the ${applicationData.fullName} ${applicationData.studentId}.Rejection Reason :- {${message}}`;
            path = "/agent/applications/lists"
            pathData = applicationData.studentInformationId
            // pathData = 
        } else if (type === "visa") {
          notificationTitle = status === "approved" 
            ? "VISA_LODGEMENT_APPROVED_AGENT" 
            : "VISA_LODGEMENT_REJECTED_AGENT";
          notificationMessage = status === "approved"
            ? `Visa Lodgement Application (${applicationData.applicationId})  has been approved for the ${applicationData.fullName} ${applicationData.studentId} for ${applicationData.country}.`
            : `Visa Lodgement Application (${applicationData.applicationId})  has been rejected for the ${applicationData.fullName} ${applicationData.studentId} for ${applicationData.country}. Rejection Reason :- {${message}}`;
            path = "/agent/applications/lists"
            pathData = applicationData.studentInformationId
        } else if (type === "offerLetter") {
          notificationTitle = status === "approved" 
            ? "OFFER_LETTER_APPROVED_AGENT" 
            : "OFFER_LETTER_REJECTED_AGENT";
          notificationMessage = status === "approved"
            ? `Offer letter(${applicationData.applicationId})  has been approved for ${applicationData.institution} for the ${applicationData.fullName} ${applicationData.studentId}.`
            : `Offer letter(${applicationData.applicationId})  has been rejected for ${applicationData.institution} for the ${applicationData.fullName} ${applicationData.studentId}.Rejection Reason :- {${message}}`;
            path = "/agent/applications/lists"
            pathData = applicationData.studentInformationId
        }
      
        if (socketServiceInstance.isConnected()) {
          const notificationData = {
            title: notificationTitle,
            message: notificationMessage,
            path: `/agent/application/lists`,
            pathData: { studentId: pathData, notify:"notify" },

            recieverId: applicationData.userId,
          };
      
          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_AGENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      
      if (applicationData.customUserId.startsWith("ST")) {
        let notificationTitle = "";
        let notificationMessage = "";
        let path="";
        if (type === "courseFeeApplication") {
          notificationTitle = status === "approved" 
            ? "COURSE_FEE_APPROVED_STUDENT" 
            : "COURSE_FEE_REJECTED_STUDENT";
          notificationMessage = status === "approved"
            ? `Course Fee Application (${applicationData.applicationId})  has been approved.`
            : `Course Fee Application (${applicationData.applicationId})  has been rejected Rejection Reason :- {${message}}`;
             path = "/student/application"
        } else if (type === "visa") {
          notificationTitle = status === "approved" 
            ? "VISA_LODGEMENT_APPROVED_STUDENT" 
            : "VISA_LODGEMENT_REJECTED_STUDENT";
          notificationMessage = status === "approved"
            ? `Visa Lodgement Application (${applicationData.applicationId}) has been approved for ${applicationData.country}.`
            : `Visa Lodgement Application (${applicationData.applicationId}) has been rejected for ${applicationData.country}. Rejection Reason :- {${message}}`;
              path = "/student/application"
        } else if (type === "offerLetter") {
          notificationTitle = status === "approved" 
            ? "OFFER_LETTER_APPROVED_STUDENT" 
            : "OFFER_LETTER_REJECTED_STUDENT";
          notificationMessage = status === "approved"
            ? `Offer letter(${applicationData.applicationId})  has been approved of ${applicationData.institution}.`
            : `Offer letter(${applicationData.applicationId})  has been rejected for ${applicationData.institution} Rejection Reason :- {${message}}`;
              path = "/student/application"
        }
      
        if (socketServiceInstance.isConnected()) {
          const notificationData = {
            title: notificationTitle,
            message: notificationMessage,
            path: path,
            recieverId: applicationData.userId,
          };
      
          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_STUDENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      

      toast.success(res.message || "Approval Status Updated");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  const applications = data?.applications;


  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



  if (loading) {
    return (
      <div
      className={`w-1  mt-12 ${
     "ml-[42%]"
      }`}
    >
      <Loader />
    </div>
    );
  }
  // console.log(applications);
  return (
    <div className="mt-4">
      {location.pathname === "/admin/applications-review" ? (
        applications?.length > 0 ? (
          applications.map((application, index) => (
            <div key={index}>
              <AdminCard
                apId={application?.applicationId}
                isApproval={false}
                updateStatus={applicationStatus}
                newStatus="approved"
                agentId={application?.institutionId}
                linkTwo={application?.type === "offerLetter" ? "/application-view" : application?.type === "visa" ? "/visa-view" : application?.type === "courseFeeApplication" ? "/coursefee-view" : null}
                name={application.fullName}
                userId={application?.customUserId}
                mgdbId={application?.mgdbId}
                applicationType={application?.type}
                
                description={
                  application?.customUserId?.startsWith("AG-")
                    ? `${application?.agentName} has filed ${application?.type === "courseFeeApplication"? "course fee application": application?.type === "offerLetter" ? "offer letter" : application?.type === "visa" ? "visa" : null } for his/her student ${application?.fullName}`
                    : application?.customUserId?.startsWith("ST-")
                    ? `${application?.fullName} has filed ${application?.type === "courseFeeApplication"? "course fee application": application?.type === "offerLetter" ? "offer letter" : application?.type === "visa" ? "visa" : null }`
                    : "Unknown type"
                }
                userType={
                  application?.customUserId?.startsWith("AG-")
                    ? "Agent"
                    : "Student"
                }
                id={application?.institutionId}
                instituteData={application}
                sectionData={application?.type}
              pageType="application"

              />
            </div>
          ))
        ) : (
          <DataNotFound
            className="flex flex-col items-center mt-16"
            message="No Data Available"
            linkText="Back to Dashboard"
            linkDestination="/admin/dashboard"
          />
        )
      ) : data?.length > 0 ? (
        data.map((item, index) => (
          <div key={index}>
            <AdminCard
              userType={item?.type === "agent" ? "Agent" : "Student"}
              userId={item?.agId ? item?.agId : item?.stId}
              isApproval={true}
              updateStatus={updateStatus}
              newStatus="completed"
              id={item?._id}
              agentId={item?.agentId || item?._id}
              linkTwo="/agent-profile"
              linkOne="/student-profile"
              rejectStatus="rejected"
              name={`${item?.firstName} ${item?.lastName}` || "Unknown User"}
              description={
                `${item?.firstName} ${item?.lastName} ${
                  item?.status === "requestedForReapproval"
                    ? `${
                        item?.type === "agent" ? "agent" : "student"
                      } has requested for reapproval of the profile as`
                    : "has requested to register as "
                } ${
                  item?.type === "agent" ? "an agent" : "a student"
                } on SOV portal` || "Unknown User"
              }
              sectionData={item?.type === "agent" ? "company" : "student"}
              customUserId={""}
              pageType="offerLetter"
            />
          </div>
        ))
      ) : (
        <DataNotFound
          className="flex flex-col items-center mt-16"
          message="No Data Available"
          linkText="Back to Dashboard"
          linkDestination="/admin/dashboard"
        />
      )}
    </div>
  );
};

export default Pending;
