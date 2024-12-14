import { Card, Typography } from "@material-tailwind/react";
import { Link, useLocation } from "react-router-dom";
import TicketResolvePop from "./adminComps/TicketResolvePop";
import { useEffect, useState } from "react";
import { removeDocument } from "../features/generalApi";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../utils/fireBase";
import { getDocumentAll } from "../features/generalSlice";
import { useDispatch, useSelector } from "react-redux";
import { FiDownloadCloud } from "react-icons/fi";
import ViewTicketPop from "./dashboardComp/ViewTicketPop";
import ApplicationChoosePop from "./dashboardComp/ApplicationChoosePop";
import {
  deleteApplication,
  removeAgentorStudent,
  ticketResolve,
  uploadApplications,
} from "../features/adminApi";
import socketServiceInstance from "../services/socket";
import { v4 as uuidv4 } from "uuid";
import { MdOutlineUploadFile } from "react-icons/md";
import RemovePopUp from "./adminComps/RemovePopUp";
import {
  adminUrlData,
  getAllAgentList,
  getAllStudentList,
  getAllTickets,
} from "../features/adminSlice";
import { RiDeleteBin6Line } from "react-icons/ri";
import { extractFileName, extractFileNames } from "../constant/commonfunction";
import { FaRegEye } from "react-icons/fa";
import { studentApplications } from "../features/agentSlice";
import DocDeletePop from "./DocDeletePop";

export function CustomTable({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  customClass,
  SecondLink,
  SecondAction,
}) {
  const [isOpenOpt, setIsOpenOpt] = useState(false);
  const [isId, setIsId] = useState(false);
  const closeOpt = () => {
    setIsOpenOpt(false);
  };

  const handleOpenOpt = (id) => {
    setIsOpenOpt(true);
    setIsId(id);
  };
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70 "
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {Object.entries(row).map(([key, value], idx) =>
                  key !== "customLinkState" ? ( // Exclude customLinkState from visible cells
                    <td key={idx} className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {value}
                      </Typography>
                    </td>
                  ) : null
                )}
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <Link
                      to={link}
                      state={row.customLinkState}
                      className="flex flex-row items-center gap-2"
                    >
                      {" "}
                      <span className="text-primary">{icon}</span>{" "}
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpenOpt(row.customLinkState)}
                      className={`${customClass}`}
                    >
                      {" "}
                      <span className="font-body">{SecondAction}</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <ApplicationChoosePop
        isOpenOpt={isOpenOpt}
        closeOpt={closeOpt}
        state={isId}
      />
    </>
  );
}

export function CustomTableTwo({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  customClass,
  SecondLink,
  secondCustomState,
  SecondAction,
  customData,
  customDataTwo,
  customDataThree,
}) {
  const location = useLocation();
  const dispatch = useDispatch();
  const nullval = null;
  const [uploadingState, setUploadingState] = useState({});
  const { getStudentDataById } = useSelector((state) => state.admin);

  const handleFileUpload = async (e, studentId, type, rowId) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingState((prev) => ({ ...prev, [rowId]: true }));

    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(
      storage,
      `uploads/adminApplications/test${uniqueFileName}`
    );

    try {
      // Upload file to Firebase
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Call backend API to save file info
      const uploadData = {
        document: [downloadURL],
        documentName: file.name,
        documentType: type,
        studentId: studentId,
        applicationId: rowId,
      };
      await uploadApplications(uploadData); // Update with your API call
      dispatch(
        studentApplications({ nullval, nullval, studentId, nullval, nullval })
      );

      if (getStudentDataById.studentInformation.agentId) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " RECEIVED_OFFER_LETTER_AGENT",
            message: `Received the document from admin  ${
              getStudentDataById?.studentInformation?.personalInformation
                .firstName +
              " " +
              getStudentDataById?.studentInformation?.personalInformation
                .lastName
            } ${getStudentDataById?.studentInformation?.stId} `,
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
            title: " RECEIVED_OFFER_LETTER_STUDENT",
            message: `Received the document from admin  ${
              getStudentDataById?.studentInformation?.personalInformation
                .firstName +
              " " +
              getStudentDataById?.studentInformation?.personalInformation
                .lastName
            } ${getStudentDataById?.studentInformation?.stId} `,
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

      toast.success(`${file.name} uploaded successfully!`);

      // Fetch the updated application data
      // dispatch(fetchApplications());
      setUploadingState((prev) => ({ ...prev, [rowId]: false }));
    } catch (error) {
      toast.error("Error uploading file. Please try again.");
      console.log(error);
    } finally {
      setUploadingState((prev) => ({ ...prev, [rowId]: false }));
    }
  };

  const handleFileDelete = async (fileUrl, studentId) => {
    const storageRef = ref(storage, fileUrl);

    try {
      // Delete file from Firebase
      await deleteObject(storageRef);

      await deleteApplication({ fileUrl: fileUrl });
      dispatch(
        studentApplications({ nullval, nullval, studentId, nullval, nullval })
      );

      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Error deleting file. Please try again.");
    }
  };
  useEffect(() => {
    customDataThree?.forEach((item) => {
      dispatch(adminUrlData(item)); // Dispatch each item individually
    });
  }, [dispatch]);

  console.log(customDataThree, "test");

  return (
    <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-input p-4 "
              >
                <Typography
                  variant="small"
                  color="sidebar"
                  className="font-medium leading-none opacity-70 "
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              {/* Render only the values you want to display */}
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.sno}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row?.id}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.type?.offerLetter
                    ? row.type?.offerLetter?.preferences?.country
                    : row.type?.visa
                    ? row.type?.visa?.country
                    : "_"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.type?.offerLetter
                    ? "Offer Letter"
                    : row.type?.visa
                    ? "Visa"
                    : row.type?.courseFeeApplication
                    ? "Course Fee"
                    : "NA"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-light text-[13px] text-white rounded-xl px-2 py-[3px] text-center ${
                    (row.type?.offerLetter?.status ||
                      row.type?.visa?.status ||
                      row.type?.courseFeeApplication?.status) === "underreview"
                      ? "bg-[#096D98]"
                      : (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "approved" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "withdrawalrequest" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "approvedbyembassy" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "withdrawalcomplete" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "visagranted"
                      ? "bg-[#09985C]"
                      : (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "rejected" ||
                        (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                          "rejectedbyembassy"
                      ? "bg-[#D33131]"
                      : (row.type?.offerLetter?.status ||
                          row.type?.visa?.status ||
                          row.type?.courseFeeApplication?.status) ===
                        "withdrawalcomplete"
                      ? "bg-[#D33131]"
                      : "bg-primary"
                  }`}
                >
                  {(row.type?.offerLetter?.status ||
                    row.type?.visa?.status ||
                    row.type?.courseFeeApplication?.status) === "underreview"
                    ? "Under Review"
                    : (row.type?.offerLetter?.status ||
                        row.type?.visa?.status ||
                        row.type?.courseFeeApplication?.status) === "rejected"
                    ? "Rejected"
                    : (row.type?.offerLetter?.status ||
                        row.type?.visa?.status ||
                        row.type?.courseFeeApplication?.status) === "approved"
                    ? "Approved"
                    : row.type?.visa?.status === "approvedbyembassy"
                    ? "Approved By Embassy"
                    : row.type?.visa?.status === "rejectedbyembassy"
                    ? "Rejected By Embassy"
                    : row.type?.visa?.status === "visagranted"
                    ? "Visa Granted"
                    : row.type?.visa?.status === "withdrawalrequest"
                    ? "Requested for Withdrawal"
                    : row.type?.visa?.status === "withdrawalcomplete"
                    ? "Withdrawal Completed"
                    : "NA"}
                </Typography>
              </td>
              {/* {console.log(row?.type?.documents)} */}
              {location.pathname === "/admin/student-applications" && (
                <td className="p-4 ">
                  <span className="flex items-center gap-3">
                    {/* View and Delete Buttons */}
                    {Array.isArray(row?.type?.documents) &&
                    row?.type?.documents.length > 0 ? (
                      <>
                        <a
                          className="flex items-center gap-3 text-primary font-medium"
                          href={row?.type?.documents[0]}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                        <button
                          className="px-4 py-1 text-primary text-[20px] rounded-md"
                          onClick={() =>
                            handleFileDelete(
                              row?.type?.documents[0],
                              row?.studentId
                            )
                          }
                        >
                          <RiDeleteBin6Line />
                        </button>
                      </>
                    ) : (
                      <div className="mt-4">
                        <Typography
                          as="label"
                          htmlFor={`pdf-upload-${row?.appId}`}
                          variant="small"
                          color="blue-gray"
                          className="font-medium cursor-pointer"
                        >
                          <span className="flex items-center gap-3 justify-center">
                            {uploadingState[row?.appId] ? (
                              "Uploading..."
                            ) : (
                              <>
                                <span className="font-normal text-sidebar">
                                  Upload
                                </span>
                                <span className="font-body text-primary text-[22px]">
                                  <MdOutlineUploadFile />
                                </span>
                              </>
                            )}
                          </span>
                        </Typography>

                        {/* Hidden File Input */}
                        <input
                          type="file"
                          id={`pdf-upload-${row?.appId}`}
                          accept="application/pdf"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(
                              e,
                              row?.studentId,
                              row?.type?.offerLetter
                                ? "offerletter"
                                : row?.type?.visa
                                ? "visa"
                                : row?.type?.courseFeeApplication
                                ? "coursefeeApplication"
                                : "NA",
                              row?.appId
                            )
                          }
                        />
                      </div>
                    )}
                  </span>

                  {/* Upload Section */}
                </td>
              )}

              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={
                      row.type?.offerLetter
                        ? "/offerLetter/edit"
                        : row.type?.visa
                        ? "/visa/edit"
                        : row.type?.courseFeeApplication
                        ? "/course-fee/edit"
                        : null
                    }
                    state={row.appId}
                    className="flex flex-row items-center gap-2"
                  >
                    <span className="text-primary">{icon}</span>
                    <span className="font-body">{action}</span>
                  </Link>
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={SecondLink}
                    state={secondCustomState}
                    className={customClass}
                  >
                    <span className="font-body">{SecondAction}</span>
                  </Link>
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
export function CustomTableThree({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  customClass,
  SecondLink,
  secondCustomState,
  SecondAction,
  customLinkState,
}) {
  return (
    <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {tableHead.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-input p-4"
              >
                <Typography
                  variant="small"
                  color="sidebar"
                  className="font-medium leading-none opacity-70 "
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, index) => (
            <tr key={index} className="even:bg-blue-gray-50/50">
              {/* Render only the values you want to display */}
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {index + 1 || "NA"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.id}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {row.type === "offerLetter" ? "Offer Letter" : ""}
                </Typography>
              </td>

              <td className="p-4">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className={`font-light text-[13px] text-white rounded-xl w-28 px-2 py-[3px] text-center ${
                    row.status === "underreview"
                      ? "bg-[#096D98] "
                      : row.status === "approved"
                      ? "bg-[#09985C]"
                      : row.status === "rejected"
                      ? "bg-[#D33131]"
                      : "bg-primary"
                  }`}
                >
                  {row.status === "underreview"
                    ? "Under Review"
                    : row.status === "rejected"
                    ? "Rejected"
                    : row.status === "approved"
                    ? "Approved"
                    : "NA"}
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={link}
                    state={row.appId}
                    className="flex flex-row items-center gap-2"
                  >
                    <span className="text-primary">{icon}</span>
                    <span className="font-body">{action}</span>
                  </Link>
                </Typography>
              </td>
              <td className="p-4">
                <Typography
                  as="a"
                  href="#"
                  variant="small"
                  color="blue-gray"
                  className="font-medium"
                >
                  <Link
                    to={SecondLink}
                    state={secondCustomState}
                    className={customClass}
                  >
                    <span className="font-body">{SecondAction}</span>
                  </Link>
                </Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
export function CustomTableFour({
  tableHead = [],
  tableRows = [],
  action,
  icon,
  link,
  customClass,
  SecondLink,
  secondCustomState,
  SecondAction,
  customLinkState,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isticketId, setTicketId] = useState();
  const handleOpen = (id) => {
    setIsOpen(true);
    setTicketId(id);
  };
  const closePopUp = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70 "
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno || "NA"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.ticketNo}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.type}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-medium ${
                      row?.priority === "Urgent"
                        ? "text-red-500"
                        : "text-green-500"
                    } `}
                  >
                    {row?.priority}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-light text-[13px] text-white rounded-xl   py-[3px] text-center ${
                      row.status === "underreview"
                        ? "bg-[#096D98] "
                        : row.status === "resolved"
                        ? "bg-[#09985C]"
                        : "bg-primary"
                    }`}
                  >
                    {row.status === "underreview"
                      ? "Under Review"
                      : row.status === "resolved"
                      ? "Resolved"
                      : "NA"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpen(row.Id)}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <ViewTicketPop
        isOpen={isOpen}
        closePopUp={closePopUp}
        isticketId={isticketId}
      />
    </>
  );
}

export function CustomTableFive({
  tableHead = [],
  tableRows = [],
  action,
  icon,
}) {
  const dispatch = useDispatch();
  const { updateTicketTab } = useSelector((state) => state.admin);

  const [isOpen, setIsOpen] = useState(false);
  const ticketData = useSelector((state) => state.admin.ticketById);
  const test = null;
  
  console.log(ticketData);
  const [isticketId, setTicketId] = useState();
  const role = localStorage.getItem("role");
  const handleOpen = (id) => {
    setIsOpen(true);
    setTicketId(id);
  };
  const closePopUp = () => {
    setIsOpen(false);
  };
const updatedStatus = "pending"
  const ticketStatusChange = async (
    status,
    isSolution,
    resolvedText,
    ticketId
  ) => {
    try {
      const res = await ticketResolve(
        status,
        isSolution,
        resolvedText,
        ticketId
      );
      dispatch(getAllTickets({ test, test, test, test,test, updateTicketTab, test }));
      toast.success(res?.message || "Status Updated Successfully");
      if (ticketData.createdById.startsWith("AG")) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " TICKET_RESOLVED_AGENT",
            message: `Ticket Raised ${ticketData.ticketId} has been resolved`,
            path: "/help-support",
            recieverId: `${ticketData.createdBy}`,
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_AGENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (ticketData.createdById.startsWith("ST")) {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: " TICKET_RESOLVED_STUDENT",
            message: `Ticket Raised ${ticketData.ticketId} has been resolved`,
            path: "/help-support",
            recieverId: `${ticketData.createdBy}`,
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_ADMIN_TO_STUDENT",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      closePopUp();
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.ticketNo}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.userId}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal text-white text-center rounded-xl text-[13px] py-1 ${
                      row.type === "agent" ? "bg-[#0F67A7]" : "bg-[#640FA7]"
                    } `}
                  >
                    {row.type === "agent" ? "Agent" : "Student"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-medium ${
                      row?.priority === "Urgent"
                        ? "text-red-500"
                        : "text-green-500"
                    } `}
                  >
                    {row?.priority}
                  </Typography>
                </td>
                {console.log(row)}
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpen(row.Id)}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <TicketResolvePop
        isOpen={isOpen}
        closePopUp={closePopUp}
        isticketId={isticketId}
        handleStatus={ticketStatusChange}
      />
    </>
  );
}

export function CustomTableSix({
  tableHead = [],
  tableRows = [],
  action,
  icon,
}) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.ticketNo}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.userId}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-normal text-white text-center rounded-xl text-[13px] py-1 ${
                      row.type === "agent" ? "bg-[#0F67A7]" : "bg-[#640FA7]"
                    } `}
                  >
                    {row.type === "agent" ? "Agent" : "Student"}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className={`font-medium ${
                      row?.priority === "Urgent"
                        ? "text-red-500"
                        : "text-green-500"
                    } `}
                  >
                    {row?.priority}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpen(row.Id)}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

export function CustomTableSeven({
  tableHead = [],
  tableRows = [],
  action,
  actionTwo,
  tableType,
  icon,
  studentId
}) {
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");
    const [isOpenPop, setIsOpenPop] = useState(false);
    const [isDocId, setIsDocId] = useState(false);
    const [isUrl, setIsUrl] = useState(false);
    const path =
    role === "0"
      ? `/document/all-admin/${studentId}`
      : role === "2" || role === "3"
      ? `/document/all/${studentId}`
      : null;
    const openDeletePopup = (docId, url) => {
      setIsUrl(url)
      setIsDocId(docId)
      setIsOpenPop(true);
    };
  
    const closePop = () => {
      setIsOpenPop(false);
    };
  const handleRemoveFile = async (id, fileUrl) => {
    try {
      if (!fileUrl) {
        toast.error("File URL is missing.");
        return;
      }
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      const res = await removeDocument(id);
      dispatch(getDocumentAll({path}));

      toast.success(res.message || "Document removed successfully");
    } catch (error) {
      console.error("Error removing file:", error);
      toast.error(error.message || "Failed to remove the document");
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead
                .filter((head) => !(head === "Action" && role === "0")) // Filter out "Action" when role is 0
                .map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-100 bg-input p-4"
                  >
                    <Typography
                      variant="small"
                      color="sidebar"
                      className="font-medium leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {extractFileNames(row?.docName)}
                  </Typography>
                </td>
                {tableType === "recieve" && (
                  <td className="p-4">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                    >
                      {row.docType}
                    </Typography>
                  </td>
                )}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.date}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <a
                      href={row.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </a>
                  </Typography>
                </td>
                {tableType === "upload" && role !== "0" && (
                  <td className="">
                    <Typography
                      as="a"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <span
                        
                        onClick={() => openDeletePopup(row.docId, row.url)}
                        className="flex flex-row items-center gap-2"
                      >
                        <span className="font-body border rounded-md border-primary cursor-pointer px-6 py-1">
                          {actionTwo}
                        </span>
                      </span>
                    </Typography>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <DocDeletePop
        closePop={closePop}
        isOpenPop={isOpenPop}
        handleFunc={handleRemoveFile}
        isUrl={isUrl}
        isDocId={isDocId}
      />
    </>
  );
}
export function CustomTableEight({
  tableHead = [],
  tableRows = [],
  action,
  actionTwo,
  linkOne,
  iconTwo,
  actionThree,
  linkTwo,
  icon,
}) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isId, setIsId] = useState();
  const [isStudentId, setIsStudentId] = useState();

  const handleOpen = (id, studentId) => {
    setIsId(id);
    setIsStudentId(studentId);
    setIsOpen(true);
  };
  const closePopUp = () => {
    setIsOpen(false);
  };
  const handleRemove = async (id) => {
    try {
      const path =
        location.pathname === "/admin/agent-student"
          ? `/studentInformation/agent-student-admin`
          : "/admin/student-directory";
      const pathData =
        location.pathname === `/admin/agent-directory`
          ? `/admin/delete-agent/${id}`
          : `/admin/delete-student/${id}`;

      const res = await removeAgentorStudent(pathData);
      // navigate("/removed-user")
      location.pathname === `/admin/agent-directory`
        ? dispatch(getAllAgentList({}))
        : dispatch(getAllStudentList({ path }));

      toast.success(res.message || "Removed successfully");
      if (socketServiceInstance.isConnected()) {
        //from agent to admin
        const data = { userId: isStudentId, reason: "Removed by admin" };
        console.log("fired", data);

        socketServiceInstance.socket.emit("DELETE_AUTH_TOKEN", data);
      } else {
        console.error("Socket connection failed, cannot emit notification.");
      }
    } catch (error) {
      console.error("Error while removing ", error);
      toast.error(error.message || "Failed to remove");
    }
  };

  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          {console.log(tableRows)}
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                {console.log(row)}

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.stId}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.email}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.phone}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <Link
                      to={linkOne}
                      state={{
                        adminState: location.pathname,
                        id: row.data?.id || row?.data._id,
                      }}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>
                {console.log(row?.studentId)}

                {row.viewList && (
                  <td className="p-4">
                    <Typography
                      as="a"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <Link
                        to={linkTwo}
                        state={{
                          adminState: location.pathname,
                          id: row.data?.id || row?.data._id,
                        }}
                        className="flex flex-row items-center gap-2"
                      >
                        <span className="text-primary">{iconTwo}</span>
                        <span className="font-body">{actionThree}</span>
                      </Link>
                    </Typography>
                  </td>
                )}
                {console.log(row, "check")}
                <td className="">
                  <Typography
                    as="a"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() =>
                        handleOpen(
                          row.data?._id || row.data?.id,
                          row?.data?.studentId
                        )
                      }
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="font-body border rounded-md border-primary cursor-pointer px-6 py-1">
                        {actionTwo}
                      </span>
                    </span>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <RemovePopUp
        closePopUp={closePopUp}
        isOpen={isOpen}
        handleFunc={handleRemove}
        isId={isId}
      />
    </>
  );
}
export function CustomTableNine({
  tableHead = [],
  tableRows = [],
  action,
  actionTwo,
  linkOne,
  iconTwo,
  actionThree,
  linkTwo,
  icon,
}) {
  return (
    <>
      <Card className="h-full w-full overflow-scroll scrollbar-hide font-poppins">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-input p-4"
                >
                  <Typography
                    variant="small"
                    color="sidebar"
                    className="font-medium leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index} className="even:bg-blue-gray-50/50">
                {/* Render only the values you want to display */}
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.sno}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.name}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.stId}
                  </Typography>
                </td>

                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.submittedby === "student"
                      ? "Student"
                      : `Agent(${row.submittedby}) `}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.total}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.underreview}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                  >
                    {row.approved}
                  </Typography>
                </td>
                <td className="p-4">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <Link
                      to={linkOne}
                      state={{
                        adminState: location.pathname,
                        id: row.data?._id,
                      }}
                      className="flex flex-row items-center gap-2"
                    >
                      <span className="text-primary">{icon}</span>
                      <span className="font-body">{action}</span>
                    </Link>
                  </Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}
