import React, { useEffect } from "react";
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

const Approved = ({ data }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const fetchStatus =
    location.pathname === "/admin/applications-review"
      ? "approved"
      : "completed";
  console.log(data);
  useEffect(() => {
    dispatch(setTabType(fetchStatus));
  }, [dispatch]);

  console.log(data);

  const applications = data?.applications;

  return (
    <div className="mt-4">
      {location.pathname === "/admin/applications-review" ? (
        applications?.length > 0 ? (
          applications.map((application, index) => (
            <div key={index}>
              <AdminCard
                userType={
                  application?.customUserId?.startsWith("AG-")
                    ? "Agent"
                    : "Student"
                }
                apId={application?.applicationId}
                isApproval={false}
                newStatus="approved"
                name={application.fullName}
                userId={application?.customUserId}
                applicationType={application?.type}
                currentStatus="approved"
                agentId={application?.institutionId}

                linkTwo={application?.type === "offerLetter" ? "/application-view" : application?.type === "visa" ? "/visa-view" : application?.type === "courseFeeApplication" ? "/coursefee-view" : null}
                id={application?.institutionId}
                description={
                  application?.customUserId?.startsWith("AG-")
                    ? `${application?.agentName} has filed ${application?.type === "courseFeeApplication"? "course fee application": application?.type === "offerLetter" ? "offer letter" : application?.type === "visa" ? "visa" : null } for his/her student ${application?.fullName}`
                    : application?.customUserId?.startsWith("ST-")
                    ? `${application?.fullName} has filed ${application?.type === "courseFeeApplication"? "course fee application": application?.type === "offerLetter" ? "offer letter" : application?.type === "visa" ? "visa" : null }`
                    : "Unknown type"
                }
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
              currentStatus="approved"
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

export default Approved;
