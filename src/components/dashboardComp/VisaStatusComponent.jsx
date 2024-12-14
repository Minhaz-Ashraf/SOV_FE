import React, { useEffect, useState } from "react";
import { greenCheck, NoVisa, urAdmin, VisaUr } from "../../assets";
import VisastatusPopToApply from "../VisastatusPopToApply";
import { useDispatch, useSelector } from "react-redux";
import { visaStatusData } from "../../features/generalSlice";
import VisaWithdrawlForm from "./VisaWithdrawlForm";
import VisaCompleteUpload from "./VisaCompleteUpload";
import Sidebar from "./Sidebar";
import Header from "./Header";
import {
  changeVisaStatus,
  chngeApplicationStatus,
  updateWithdrawalReq,
} from "../../features/adminApi";
import { toast } from "react-toastify";
import VisaRejectPop from "../adminComps/VisaRejectPop";
import { FaRegEye } from "react-icons/fa";
import WithdrwalChoosePop from "./WithdrwalChoosePop";
import WithDrawalData from "./WithDrawalData";
import socketServiceInstance from "../../services/socket";
import { Link, useLocation } from "react-router-dom";

const VisaStatusComponent = ({ studentId }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const { studentData } = useSelector((state) => state.general);
  const { agentData } = useSelector((state) => state.agent);

  // const id = localStorage.getItem('student');

  const { studentInfoData } = useSelector((state) => state.student);

  const studId =
    role === "3"
      ? studentInfoData?.data?.studentInformation?._id ||
        location?.state?.notifyId
      : role === "2" || role === "0"
      ? studentId
      : null;

  const { visaStatus } = useSelector((state) => state.general);
  const { getStudentDataById } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [isOpenOption, setIsOpenOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [showWithdrwalData, setShowWithdrawalData] = useState(false);

  const closeOption = () => {
    setIsOpenOption(false);
  };
  const handleOpenOption = () => {
    setIsOpenOption(true);
  };
  const closeOpt = () => {
    setIsOpenOpt(false);
  };
  const closePopUp = () => {
    setIsOpen(false);
  };
  const handleOpenVisaPop = () => {
    setIsOpen(true);
  };

  const handleOpenOpt = () => {
    setIsOpenOpt(true);
  };

  const handleWithdraw = () => {
    setShowWithdrawForm(true);
  };
  const handleWithdrawalData = () => {
    setShowWithdrawalData(true);
  };
  useEffect(() => {
    dispatch(visaStatusData(studId));
  }, [dispatch, studId]);

  const applicationStatus = async (flag, message) => {
    try {
      const payload = { status: flag, message: message };
      const res = await changeVisaStatus(visaStatus?._id, payload);
      dispatch(visaStatusData(studId));
      toast.success(res.message || "Approval Status Updated");

      if (socketServiceInstance.isConnected()) {
        let notificationTitle = "";
        let notificationMessage = "";
        let receiverType = "";
        let pathData = "";
        let path = "";
        if (flag === "rejectedbyembassy") {
          if (getStudentDataById.studentInformation.studentId) {
            notificationTitle = "VISA_REJECTED_BY_EMBASSY_STUDENT";
            notificationMessage = `Visa Application ${visaStatus?.applicationId} has been rejected by the Embassy for ${visaStatus?.visa?.country}. Rejection Reason: ${message}`;
            receiverType = "STUDENT";
            path = "/student/visa-update";
          } else {
            notificationTitle = "VISA_REJECTED_BY_EMBASSY_AGENT";
            notificationMessage = `Visa Application ${visaStatus?.applicationId} has been rejected by the embassy for ${getStudentDataById?.studentInformation?.personalInformation?.firstName} ${getStudentDataById?.studentInformation?.personalInformation?.lastName} (${getStudentDataById?.studentInformation?.stId}) for ${visaStatus?.visa?.country}. Rejection Reason: ${message} `;
            receiverType = "AGENT";
            path = "/student-profile";
            pathData = getStudentDataById?.studentInformation?._id;
          }
        } else if (flag === "approvedbyembassy") {
          if (getStudentDataById.studentInformation.studentId) {
            notificationTitle = "VISA_APPROVED_BY_EMBASSY_STUDENT";
            notificationMessage = `Visa Application ${visaStatus?.applicationId} has been approved by the Embassy for ${visaStatus?.visa?.country}.`;
            receiverType = "STUDENT";
            path = "/student/visa-update";
          } else {
            notificationTitle = "VISA_APPROVED_BY_EMBASSY_AGENT";
            notificationMessage = `Visa Application ${visaStatus?.applicationId} has been approved by the embassy for ${getStudentDataById?.studentInformation?.personalInformation?.firstName} ${getStudentDataById?.studentInformation?.personalInformation?.lastName} (${getStudentDataById?.studentInformation?.stId}) for ${visaStatus?.visa?.country}.`;
            receiverType = "AGENT";
            path = "/student-profile";
            pathData = getStudentDataById?.studentInformation?._id;
          }
        }

        if (notificationTitle && notificationMessage) {
          const notificationData = {
            title: notificationTitle,
            message: notificationMessage,
            path: path,
            pathData: { studentId: pathData },
            recieverId: visaStatus?.userId || "",
          };

          const notificationEvent =
            receiverType === "STUDENT"
              ? "NOTIFICATION_ADMIN_TO_STUDENT"
              : "NOTIFICATION_ADMIN_TO_AGENT";

          socketServiceInstance.socket.emit(
            notificationEvent,
            notificationData
          );
        }
      } else {
        console.error("Socket connection failed, cannot emit notification.");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };
  const withdrawalReqAction = async () => {
    try {
      const payload = {
        studentInformationId: visaStatus?.studentInformationId,
      };
      const res = await updateWithdrawalReq(payload);
      await chngeApplicationStatus(
        visaStatus?._id,
        "withdrawalcomplete",
        "visa"
      );

      dispatch(visaStatusData(studId));
      toast.success(res.message || "Withdrwal Request Updated");
      if (getStudentDataById.studentInformation.agentId) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " AGENT_WITHDRAWAL_COMPLETE",
            message: `Withdrawal transaction has been completed for the  ${
              getStudentDataById?.studentInformation?.personalInformation
                .firstName +
              " " +
              getStudentDataById?.studentInformation?.personalInformation
                .lastName
            } ${
              getStudentDataById?.studentInformation?.stId
            } for this application ${visaStatus?.applicationId}`,
            path: "/student-profile",
            pathData: {
              studentId: getStudentDataById?.studentInformation?._id,
            },
            recieverId: getStudentDataById.studentInformation.agentId,
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_AGENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (getStudentDataById.studentInformation.studentId) {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: " STUDENT_WITHDRAWAL_COMPLETE",
            message: `Withdrawal transaction has been completed for ${visaStatus?.applicationId}.`,
            path: "/student/visa-update",
            pathData: {
              studentId: getStudentDataById?.studentInformation?._id,
            },
            recieverId: getStudentDataById.studentInformation.studentId,
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_STUDENT",
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
      {role === "3" ? (
        <>
          <Header customLink="/agent/shortlist" />
          <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
            <Sidebar />
          </span>
        </>
      ) : (
        ""
      )}
      {showWithdrwalData ? (
        <WithDrawalData userId={visaStatus?.userId} />
      ) : showWithdrawForm ? (
        <div className={`${role === "3" ? "mt-20 ml-64" : ""} `}>
          <VisaWithdrawlForm choosedOption={selectedOption} studId={studId} />
        </div>
      ) : visaStatus?.visa?.status === "underreview" ? (
        <div
          className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-14 mb-20 ${
              role === "3" ? "mt-60 mx-44 ml-96 " : ""
          } `}
        >
          <img
            src={urAdmin}
            alt="img"
            className="w-[35%] "
            onError={(e) => {
              e.target.src = profileSkeleton;
            }}
            loading="lazy"
          />
          <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
            {role === "0" ||role === "1" ? null : "Your"} Visa lodgement Application is under review.
         
          </p>
          <p className="text-sidebar text-[16px] text-center font-light mt-3">
          { role === "0" || role === "1" ? null :
            "We’ll notify you with updates. Please ensure all required documents are submitted and check your email for further requests."
            }
          </p>
        </div>
      ) : visaStatus?.visa?.status === "approved" ? (
        <div
          className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-14 mb-20 ${
              role === "3" ? "mt-60 mx-44 ml-96 " : ""
          } `}
        >
          <img
            src={VisaUr}
            alt="img"
            className="w-40 h-36"
            onError={(e) => {
              e.target.src = profileSkeleton;
            }}
            loading="lazy"
          />
          {role === "0" ? (
            <>
              <p className="text-sidebar text-[15px] font-normal mt-3 text-center">
                Visa lodegement has been approved from admin side. Review the
                embassy approval status carefully. If approved, accept the visa
                application. If not, reject it.
              </p>
              <span className="flex flez-row items-center gap-6 mt-6">
                <span
                  onClick={handleOpenVisaPop}
                  className="px-10 py-2 text-white bg-[#D83737] cursor-pointer rounded-md "
                >
                  Reject
                </span>
                <span
                  onClick={() => applicationStatus("approvedbyembassy")}
                  className="px-10 py-2 text-white bg-[#09985C] cursor-pointer rounded-md "
                >
                  Accept
                </span>
              </span>
            </>
          ) : (
            <>
              <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
                Your Visa lodgement Application has been submitted and it is
                forwarded for further procedure.
              </p>
              <p className="text-sidebar text-[16px] text-center font-light mt-3">
                We’ll notify you with updates. Please ensure all required
                documents are submitted and check your email for further
                requests.
              </p>
            </>
          )}
        </div>
      ) : visaStatus?.visa?.status === "rejected" ? (
        <div
          className={`bg-white flex flex-col rounded-md justify-center items-center  py-9 font-poppins px-14 mb-20 ${
            role === "3" ? "mt-60 mx-44 ml-96 " : ""
          } `}
        >
          {role === "2" || role === "3" ? (
            <>
              <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
                Your Visa lodgement Application has been Rejected
              </p>
              <p className="text-sidebar text-[16px] text-center font-light mt-3">
                Please review the details provided or contact support for
                guidance on the next steps.
              </p>
              <Link
                state={{ id: visaStatus?._id }}
                to="/visa/edit"
                className="bg-primary text-white rounded-md px-6 py-2 text-[14px] cursor-pointer mt-4"
              >
                Edit Application
              </Link>
            </>
          ) : (
            <>
              <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
                Visa lodgement Application has been Rejected by Admin
              </p>
            </>
          )}
        </div>
      ) : visaStatus?.visa?.status === "withdrawalrequest" ? (
        <>
          {role === "0" && (
            <div
              className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-14 mb-20 ${
                  role === "3" ? "mt-60 mx-44 ml-96 " : ""
              } `}
            >
              <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
                Visa lodgement Application Rejected
              </p>
              <p className="text-sidebar text-[16px] text-center font-light mt-3">
                Visa Application has been rejected from embassy for this
                student. and User requested for withdraw the amount.
              </p>
              <span
                onClick={handleWithdrawalData}
                className="text-primary flex flex-row items-center font-semibold gap-2 text-[16px] rounded-md px-6 py-2  cursor-pointer mt-4"
              >
                <span>View Withdrawal Form</span>
                <span>
                  <FaRegEye />
                </span>
              </span>
              <span
                onClick={withdrawalReqAction}
                className="bg-primary text-white rounded-md px-6 py-2 text-[14px] cursor-pointer mt-4"
              >
                Update Withdrawal Complete
              </span>
            </div>
          )}

          {role !== "0" && (
            <div
              className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-14 mb-20 ${
                  role === "3" ? "mt-60 mx-44 ml-96 " : ""
              } `}
            >
              <img
                src={urAdmin}
                alt="img"
                className="w-40 h-36"
                onError={(e) => {
                  e.target.src = profileSkeleton;
                }}
                loading="lazy"
              />
              <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
                Your withdrawal request is under process!
              </p>
              <p className="text-sidebar text-[16px] text-center font-light mt-3 mx-9">
                Your withdrawal request will be processed within 45-50 business
                days. You will receive a confirmation email once your request
                has been processed.
              </p>
              <p className="text-sidebar text-[16px] text-center font-light mt-3 ">
                All good things take time. <br />
                Thanks for your patience!
              </p>
              <span
                onClick={handleWithdrawalData}
                className="text-primary flex flex-row items-center font-semibold gap-2 text-[16px] rounded-md px-6 py-2  cursor-pointer mt-4"
              >
                <span>View Withdrawal Form</span>
                <span>
                  <FaRegEye />
                </span>
              </span>
            </div>
          )}
        </>
      ) : visaStatus?.visa?.status === "withdrawalcomplete" ? (
        <>
          <div
            className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-14 mb-20 ${
                role === "3" ? "mt-60 mx-44 ml-96 " : ""
            } `}
          >
            <span className="bg-[#F4FBF8] px-6 py-6">
              <span className="flex flex-row items-center gap-3">
                <img
                  src={greenCheck}
                  alt="img"
                  className="w-16 h-16"
                  onError={(e) => {
                    e.target.src = profileSkeleton;
                  }}
                  loading="lazy"
                />
                <p className="text-sidebar text-[22px] font-normal mt-3">
                  <span className="font-semibold">Completed!</span> Completed!
                  Withdrawal payment for the GIC and Course Fee has been
                  successfully transferred in the registered account.
                </p>
              </span>
            </span>
            {/* {role !== "0"  &&
            <>
            <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
              Visa lodgement Application Rejected
            </p>
            <p className="text-sidebar text-[16px] text-center font-light mt-3">
              Visa Application has been rejected from embassy for this student.
              and User requested for withdraw the amount.
            </p> </>} */}
            <span
              onClick={handleWithdrawalData}
              className="text-primary flex flex-row items-center font-semibold gap-2 text-[16px] rounded-md px-6 py-2  cursor-pointer mt-4"
            >
              <span>View Withdrawal Form</span>
              <span>
                <FaRegEye />
              </span>
            </span>
            {role === "0" ? (
              ""
            ) : (
              <span
                onClick={handleOpenOpt}
                className="bg-[#09985C] text-white rounded-md px-6 py-2 text-[14px] cursor-pointer mt-4"
              >
                Re-Apply for Visa
              </span>
            )}
          </div>
        </>
      ) : visaStatus?.visa?.status === "visagranted" ? (
        <>
          <div
            className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-14 mb-20 ${
                role === "3" ? "mt-60 mx-44 ml-96 " : ""
            } `}
          >
            <span className="bg-[#F4FBF8] px-6 py-6">
              <span className="flex flex-row items-center gap-3">
                <img
                  src={greenCheck}
                  alt="img"
                  className="w-16 h-16"
                  onError={(e) => {
                    e.target.src = profileSkeleton;
                  }}
                  loading="lazy"
                />
                <p className="text-sidebar text-[22px] font-normal mt-3">
                  <span className="font-semibold">Congratulations!</span> {role === "0" || role === "1" ? "Visa Application has been accepted from embassy for this student." : "Your Visa Application has been accepted"}
                </p>
              </span>
              {role === "0" || role === "1" ? <p className="text-sidebar mt-3 text-[16px] font-light text-center">Student has uploaded the PPR and Visa Stamp. Review it! </p> :
              <>
              <p className="text-sidebar text-[16px] text-start font-light mt-3">
                Thank you for completing the PPR submission and receiving your
                visa stamp! <br /> With your visa now in hand, you are one step
                closer to experiencing new opportunities, broadening your
                horizons, and embarking on an exciting educational adventure.{" "}
                <br />{" "}
                <span className="font-medium">
                  {" "}
                  Wishing you all the best as you begin this incredible chapter
                  of your life.
                </span>
              </p></>}
            </span>

            <span className="flex flex-row items-center justify-between w-full mt-6">
              <span className="w--1/2">
                <span className="font-light mt-4">PPR</span>
                <span className="font-medium">
                  {visaStatus?.visa?.ppr ? (
                    <a
                      className="flex items-center gap-3 text-primary font-medium"
                      href={visaStatus.visa.ppr}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View PPR
                      <span>
                        <FaRegEye />
                      </span>
                    </a>
                  ) : (
                    "NA"
                  )}
                </span>
              </span>
              <span className="w-1/2">
                <span className="font-light mt-4">visa Stamp</span>
                <span className="font-medium">
                  {visaStatus?.visa?.visaStamp ? (
                    <a
                      className="flex items-center gap-3 text-primary font-medium"
                      href={visaStatus?.visa?.visaStamp}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View visa Stamp
                      <span>
                        <FaRegEye />
                      </span>
                    </a>
                  ) : (
                    "NA"
                  )}
                </span>
              </span>
            </span>
          </div>
        </>
      ) : visaStatus?.visa?.status === "rejectedbyembassy" ? (
        <div
          className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-14 mb-20 ${
              location.pathname === "/student/visa-update" ? "md:mx-20 md:ml-[28%] sm:mx-9 sm:ml-[28%]  mt-36 ":null
          } `}
        >
          {role !== "0" ? (
            <>
              <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
                Visa Application Rejected
              </p>
              <p className="text-sidebar text-[16px] text-center font-light mt-3">
                Please review the details provided or contact support for
                guidance on the next steps.
              </p>
              <span
                onClick={handleOpenOpt}
                className="bg-[#09985C] text-white rounded-md px-6 py-2 text-[14px] cursor-pointer mt-4"
              >
                Re-Apply for Visa
              </span>
              <span
                onClick={handleOpenOption}
                className="bg-primary text-white rounded-md px-12 py-2 text-[14px] cursor-pointer mt-4"
              >
                Withdraw
              </span>{" "}
            </>
          ) : (
            <>
            <p className="text-sidebar text-[22px] font-semibold mt-3 text-center">
              Visa Application Rejected
            </p>
            <p className="text-sidebar text-[17px] font-normal mt-3 text-center">
            Visa Application has been rejected from embassy for this student.
            </p></>
          )}
        </div>
      ) : visaStatus?.visa?.status === "approvedbyembassy" ? (
        <div
          className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-6 mb-20 ${
              role === "3" ? "mt-60 mx-44 ml-96 " : ""
          } `}
        >
          {role === "3" || role === "2" ? (
            <>
              <span className="bg-[#F4FBF8] px-6 py-6">
                <span className="flex flex-row items-center gap-3">
                  <img
                    src={greenCheck}
                    alt="img"
                    className="w-16 h-16"
                    onError={(e) => {
                      e.target.src = profileSkeleton;
                    }}
                    loading="lazy"
                  />
                  <p className="text-sidebar text-[22px] font-normal mt-3">
                    <span className="font-semibold">Congratulations!</span> Your
                    Visa Application has been accepted
                  </p>
                </span>
                <p className="text-sidebar text-[16px] font-light mt-3">
                  Please allow 8-10 business days to get visa stamp. Once you
                  receive your visa stamp, complete the following steps to
                  finalize your application.
                </p>
              </span>

              <VisaCompleteUpload
               appId={visaStatus?._id} studId={studId} />
            </>
          ) : (
            <>
              <span className="flex flex-row items-center gap-3">
                <img
                  src={greenCheck}
                  alt="img"
                  className="w-16 h-16"
                  onError={(e) => {
                    e.target.src = profileSkeleton;
                  }}
                  loading="lazy"
                />
                <p className="text-sidebar text-[22px] font-normal mt-3">
                  <span className="font-semibold">Congratulations!</span> Visa
                  Application has been accepted from embassy for this student.
                </p>
              </span>
              <p className="text-sidebar text-[16px] font-light mt-3">
                Please allow 8-10 business days to get visa stamp. Once student
                receive visa stamp, Student will finalize the application.
              </p>
            </>
          )}
        </div>
      ) : (
        <div
          className={`bg-white flex flex-col rounded-md justify-center items-center md:mx-52 py-9 font-poppins px-14 mb-20 ${
              role === "3" ? "mt-60 mx-44 ml-96 " : ""
          } `}
        >
          <img
            src={NoVisa}
            alt="img"
            className="w-36 h-36"
            onError={(e) => {
              e.target.src = profileSkeleton;
            }}
            loading="lazy"
          />
          <p className="text-sidebar text-[22px] font-semibold mt-3">
            No Visa Application Applied Yet
          </p>
          <p className="text-sidebar text-[16px] text-center font-light mt-3">
            Start your application now to begin the process and track your
            progress here.
          </p>
          {role === "0" ? (
            ""
          ) : (
            <span
              onClick={handleOpenOpt}
              className="bg-[#09985C] text-white rounded-md px-6 py-2 text-[14px] cursor-pointer mt-4"
            >
              Apply for Visa
            </span>
          )}
        </div>
      )}

      <VisastatusPopToApply
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={studId}
      />
      <VisaRejectPop
        isOpen={isOpen}
        closePopUp={closePopUp}
        handleFunc={applicationStatus}
      />
      <WithdrwalChoosePop
        isOpenOption={isOpenOption}
        closeOption={closeOption}
        handleWithdraw={handleWithdraw}
        setSelectedOption={setSelectedOption}
      />
    </>
  );
};

export default VisaStatusComponent;
