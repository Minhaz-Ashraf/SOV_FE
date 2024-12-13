import React from "react";
import ImageComponent from "../components/reusable/Input";
import { reaproval } from "../assets";
import { toast } from "react-toastify";
import { reApprovalRequest } from "../features/generalApi";
import { useDispatch, useSelector } from "react-redux";
import socketServiceInstance from "../services/socket";
import { Link } from "react-router-dom";
import { agentInformation } from "../features/agentSlice";
import { studentInfo } from "../features/studentSlice";

const ReApproval_Request = () => {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("student")
  const { agentData } = useSelector((state) => state.agent);
  const { studentInfoData } = useSelector((state) => state.student);
 
  const id =
    role === "2"
      ? agentData?._id
      : role === "3"
      ? studentInfoData?.data?.studentInformation?._id
      : null;

  const reApprovalReq = async () => {
    try {
      const payload = {
        status: "requestedForReapproval",
      };
      const res = await reApprovalRequest(
        role === "2"
          ? `/company/update-agent-reapproval-status/${id}`
          : role === "3"
          ? `/studentinformation/update-student-reapproval-status/${id}`
          : null,
        payload
      );
      if (role === "2") {
        dispatch(agentInformation());
      }
      if (role==="3"){
        dispatch(studentInfo(studentId))
      }
      toast.success(res?.message || "Requested for reapproval");
      if (role === "2") {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " AGENT_PROFILE_DELETED_RE_REGISTERED",
            message: `${agentData?.companyDetails?.businessName} ${agentData?.agId} has deleted the profile and registered again as an agent on the portal. Request for reapproval `,
            path: "/admin/approvals",
            recieverId: "",
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_AGENT_TO_ADMIN",
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
            title: " STUDENT_PROFILE_DELETED_RE_REGISTERED",
            message: `${
              studentInfoData?.data?.studentInformation?.personalInformation
                .firstName +
              " " +
              studentInfoData?.data?.studentInformation?.personalInformation
                .lastName
            }  ${
              studentInfoData?.data?.studentInformation?.stId
            } has deleted the profile and registered again as an agent on the portal. Request for reapproval`,
            path: "/admin/approvals",
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
      toast.error(error?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className="flex flex-col items-center justify-center  font-poppins ">
        <ImageComponent src={reaproval} className="w-80 mt-6" />
        <p className="text-sidebar text-[26px] font-semibold">
          Account deleted!
        </p>
        <p className="px-[30%] text-center pt-3 text-body">
          Your account has been deleted. Please request for the admin approval
          to regain access.
        </p>
        <span className="flex flex-col items-center justify-center">
          {studentInfoData?.data?.studentInformation?.pageStatus?.status ===
            "requestedForReapproval" ||
          agentData?.pageStatus?.status === "requestedForReapproval" ? (
            <p className="text-[16px] text-sidebar mt-6">
              You have requested for the re-approval . please wait for the admin
              approval.
            </p>
           
          ) : (
            <span
              onClick={reApprovalReq}
              className="bg-primary rounded-md text-white px-6 py-2 mt-6 cursor-pointer "
            >
              Request Reapproval
            </span>
          )}

          <a
            href="mailto:support@sovportal.in?subject=Contact%20Support&body=Hello%20Admin,"
            className="border border-greyish px-11 py-2 text-body mt-6 rounded-md cursor-pointer"
          >
            Contact Admin
          </a>

          <Link to="/login" className="  px-11 py-2 text-primary underline rounded-md cursor-pointer ">
            Back to Login
          </Link>
        </span>
      </div>
    </>
  );
};

export default ReApproval_Request;
