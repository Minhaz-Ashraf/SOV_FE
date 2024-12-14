import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./Pagination";
import { getDocumentAll } from "../../features/generalSlice";
import { toast } from "react-toastify";
import { uploadDocument } from "../../features/generalApi";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../utils/fireBase";
import { CustomTableSeven, CustomTableTwo } from "../Table";
import { formatDate } from "./../../constant/commonfunction";
import { FaRegEye } from "react-icons/fa";
import Dnf from "../Dnf";
import { dnf } from "../../assets";
import Loader from "../Loader";
import { CustomInput } from "../reusable/Input";
import { IoSearchOutline } from "react-icons/io5";

const StudentUploadDocument = ({ adminPath, studentId }) => {
console.log(studentId)
  const role = localStorage.getItem('role');
  const { getAllDocuments } = useSelector((state) => state.general);
  const dispatch = useDispatch();
  const [isUpload, setIsUpload] = useState({
    viewUrl: "",
    documentName: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [perPage, setPerPage] = useState(10);
  const path =
    role === "0"
      ? `/document/all-admin/${studentId}`
      : role === "2" || role === "3"
      ? `/document/all/${studentId}`
      : null;
  const totalUsersCount = getAllDocuments?.total || 0;
  const currentPage = getAllDocuments?.currentPage || 1;
  const totalPagesCount = getAllDocuments?.totalPages || 1;
  const perPageOptions = Array.from(
    { length: Math.min(totalUsersCount, 100) / 10 },
    (_, i) => (i + 1) * 10
  );

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (pageNumber) => setPage(pageNumber);

  useEffect(() => {
    dispatch(getDocumentAll({path, search, page, perPage }));

    // setIsLoading(false);
  }, [dispatch, search, page, perPage]);

  const TABLE_HEAD = [
    "S.No.",
    "Document Name",
    "Upload Date",
    "View",
    "Action",
  ];

  const TABLE_ROWS = getAllDocuments?.documents?.map((data, index) => ({
    // SNO: (currentPage - 1) * perPage + index + 1,
    sno: (currentPage - 1) * perPage + index + 1,
    docName: data.documentName || "NA",
    date: formatDate(data.createdAt) || "NA",
    url: data.viewUrl || "NA",
    docId: data._id || "NA",
  }));

  // File upload handler
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    for (const file of files) {
      const fileType = file.type;
      const validFileTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validFileTypes.includes(fileType)) {
        toast.error(
          `${file.name} is not a valid file type. Please upload PDF or Word files only.`
        );
        continue;
      }

      // console.log(file, "Uploading file");

      const storageRef = ref(storage, `uploads/documents/${file.name}`);

      try {
        // Upload each file
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        const uploadData = {
          viewUrl: downloadURL,
          documentName: file.name,
          userId: studentId
        };
        setIsUpload(uploadData);
        await handleUpload(uploadData);

      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Error uploading ${file.name}. Please try again.`);
      }
    }
    setIsUploading(false);
  };

  // Delete file handler

  const handleUpload = async (uploadData) => {
    try {
      const res = await uploadDocument(uploadData);
      await dispatch(getDocumentAll({path})).unwrap();

      toast.success(res.message || "Document Uploaded Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <div className="ml-6 mt-6 mr-6">
        <span className="flex flex-row items-center mb-3">
          <span className="flex flex-row justify-between w-full items-center">
            <span className="flex flex-row items-center">
             
              <span className="flex flex-row items-center  md:ml-9">
                <CustomInput
                  className="h-11 w-80 rounded-md text-body placeholder:px-3 pl-7 border border-[#E8E8E8] outline-none"
                  type="text"
                  placeHodler="Search by Document Name"
                  name="search"
                  value={search}
                  onChange={handleSearchChange}
                />
                <span className="absolute pl-2 text-[20px] text-body">
                  <IoSearchOutline />
                </span>
              </span>
            </span>
            {!adminPath && (
              <span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  style={{ display: "none" }}
                  id="fileInput"
                />
                <label
                  htmlFor="fileInput"
                  className={`bg-primary text-white px-4 rounded-md py-2 cursor-pointer ${
                    isUploading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isUploading ? "Uploading..." : "+ Add Document"}
                </label>
              </span>
            )}
          </span>
        </span>
      </div>

      <div className="mt-6 mr-6">
        {isLoading ? (
          <div className="w-1 ml-[48%] mt-12">
            <Loader />
          </div>
        ) : getAllDocuments && getAllDocuments.length === 0 ? (
          <div className="mt-8 font-medium text-body ml-[15%] mr-[15%]">
            <Dnf
              dnfImg={dnf}
              headingText="Start Your Journey!"
              bodyText="No Files Available to Show"
            />
          </div>
        ) : (
          <>
          <CustomTableSeven
            tableHead={TABLE_HEAD}
            tableRows={TABLE_ROWS}
            action="View"
            actionTwo={"Remove"}
            icon={<FaRegEye />}
            tableType="upload"
            customLinkState={TABLE_ROWS?.map((data) => data.appId)}
            studentId={studentId}
          />
     

      <div className="mt-16 mb-10 ">
        <Pagination
          currentPage={currentPage}
          hasNextPage={currentPage * perPage < totalUsersCount}
          hasPreviousPage={currentPage > 1}
          onPageChange={handlePageChange}
          totalPagesCount={totalPagesCount}
        />
      </div>
      </>
    )}
    
    </div>
    </>
  );
};

export default StudentUploadDocument;
