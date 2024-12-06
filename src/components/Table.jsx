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
import { adminUrlData, getAllAgentList, getAllStudentList } from "../features/adminSlice";

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
  customLinkState,
  ThirdAction,
}) {
  const location = useLocation();
  const dispatch =useDispatch();
  const [isData, setIsData] =useState({
    studentId: "",
    appId:"",
  })
  const [fileUrl, setFileUrl] = useState(null);
  const [uploadingState, setUploadingState] = useState({});

  const handleFileUpload = async (e, studentId, type, rowId) => {
    setIsData({
      studentId: studentId,
      appId: rowId
    })
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
        DocumentType: type,
        studentId: studentId,
      };
      await uploadApplications(uploadData); // Update with your API call

      toast.success(`${file.name} uploaded successfully!`);

      // Fetch the updated application data
      // dispatch(fetchApplications());
      setUploadingState((prev) => ({ ...prev, [rowId]: false }));
    } catch (error) {
      toast.error("Error uploading file. Please try again.");
    } finally {
      setUploadingState((prev) => ({ ...prev, [rowId]: false }));
    }
  };

  const handleFileDelete = async (fileUrl) => {
    const storageRef = ref(storage, fileUrl);

    try {
      // Delete file from Firebase
      await deleteObject(storageRef);

      await deleteApplication(fileUrl);

      toast.success("File deleted successfully!");

      // Fetch the updated application data
      dispatch(fetchApplications());
    } catch (error) {
      toast.error("Error deleting file. Please try again.");
    }
  };
useEffect(()=>{
  dispatch(adminUrlData({ studentId: isData?.studentId, applicationId: isData?.appId }));

},[dispatch])

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
              {location.pathname === "/admin/student-applications" && (
                <td className="p-4">
                  {!fileUrl ? (
                    <>
                      <Typography
                        as="label"
                        htmlFor={`pdf-upload-${row?.appId}`}
                        variant="small"
                        color="blue-gray"
                        className="font-medium cursor-pointer"
                      >
                        <span className="flex items-center gap-3 justify-center">
                          {uploadingState[row.appId] ? (
                            "Uploading..."
                          ) : (
                            <>
                              <span className="font-normal text-sidebr">
                                Upload
                              </span>
                              <span className="font-body text-primary text-[22px]">
                                <MdOutlineUploadFile />
                              </span>
                            </>
                          )}
                        </span>
                      </Typography>
                      {console.log(row)}
                      <input
                        type="file"
                        id={`pdf-upload-${row?.appId}`}
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(
                            e,
                            row?.studentId,
                            row.type?.offerLetter
                              ? "offerLetter"
                              : row.type?.visa
                              ? "visa"
                              : row.type?.courseFeeApplication
                              ? "courseFee"
                              : "NA",
                            row.appId
                          )
                        }
                      />
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                        onClick={() => window.open(fileUrl, "_blank")}
                      >
                        View
                      </button>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md"
                        onClick={() => handleFileDelete(fileUrl, row)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
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
                    className="font-normal"
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
  const [isOpen, setIsOpen] = useState(false);
  const ticketData = useSelector((state) => state.admin.ticketById);

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
}) {
  const dispatch = useDispatch();
  const handleRemoveFile = async (id, fileUrl) => {
    try {
      if (!fileUrl) {
        toast.error("File URL is missing.");
        return;
      }
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      const res = await removeDocument(id);
      dispatch(getDocumentAll());

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
                    {row.docName}
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
                    href="#"
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
                {tableType === "upload" && (
                  <td className="">
                    <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue-gray"
                      className="font-medium"
                    >
                      <span
                        onClick={() => handleRemoveFile(row.docId, row.url)}
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
  const handleOpen =(id)=>{
    setIsId(id)
    setIsOpen(true)

  }  
  const closePopUp =()=>{
    setIsOpen(false)
  }
  const handleRemove = async (id) => {
    try {
      const path =
        location.pathname === `/admin/agent-directory/`
          ? `/admin/delete-agent/${id}`
          : `/admin/remove-student/${id}`;

      const res = await removeAgentorStudent(path);
      // navigate("/removed-user")
      location.pathname === `/admin/agent-directory/` ?
      dispatch(getAllAgentList({})) :
      dispatch(getAllStudentList({})) 


      toast.success(res.message || "Removed successfully");
      if (socketServiceInstance.isConnected()) {
        //from agent to admin
        const data = { userId: id, reason: "Removed by admin" };

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
                    href="#"
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
                {console.log(row)}

                {row.viewList && (
                  <td className="p-4">
                    <Typography
                      as="a"
                      href="#"
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
                {/* {console.log(row.data._id)} */}
                <td className="">
                  <Typography
                    as="a"
                    href="#"
                    variant="small"
                    color="blue-gray"
                    className="font-medium"
                  >
                    <span
                      onClick={() => handleOpen(row.data?._id)}
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
                    {row.submittedby === "student" ? "Student" : `Agent(${row.submittedby}) ` }
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
