import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "./Pagination";
import { getRecievedDocument } from "../../features/generalSlice";
import { CustomTableSeven } from "../Table";
import { extractFileName, formatDate } from "../../constant/commonfunction";
import Loader from "../Loader";
import Dnf from "../Dnf";
import { dnf } from "../../assets";
import { FaRegEye } from "react-icons/fa6";
import { CustomInput } from "../reusable/Input";
import { applicationTypeOption } from "../../constant/data";
import { IoSearchOutline } from "react-icons/io5";

const StudentRecieveDocument = ({ studentId }) => {
  const { recieveDocs } = useSelector((state) => state.general);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [isType, setIsType] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const totalUsersCount = recieveDocs?.documents?.total || 0;
  const currentPage = recieveDocs?.documents?.currentPage || 1;
  const totalPagesCount = recieveDocs?.documents?.totalPages || 1;

  const perPageOptions = Array.from(
    { length: Math.min(totalUsersCount, 100) / 10 },
    (_, i) => (i + 1) * 10
  );

  const handlePerPageChange = (e) => {
    setPerPage(parseInt(e.target.value));
    setPage(1);
  };

  const handleApplicationTypeChange = (e) => {
    setIsType(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (pageNumber) => setPage(pageNumber);

  useEffect(() => {
    dispatch(getRecievedDocument({ studentId, page, perPage, search, isType }));
    // setIsLoading(false);
  }, [dispatch, studentId, page, perPage, search, isType]);

  const TABLE_HEAD = [
    "S.No.",
    "Document Name",
    "Document Type",
    "Recieve Date",
    "Action",
  ];

  const TABLE_ROWS = recieveDocs?.documents?.map((data, index) => ({
    sno:(currentPage - 1) * perPage + index + 1,
    docName: extractFileName(data.document[0]) || "NA",
    docType: data?.documentType === "coursefeeApplication" ? "Course Fee Application" : data?.documentType === "offerletter" ? "Offer Letter" : data?.documentType === "visa" ? "Visa" : null,
    date: formatDate(data.createdAt) || "NA",
    url: data.document[0] || "NA",
  }));
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
              {/* <span className="text-body">Show</span>
              <select
                className="ml-3 border px-2 py-1 w-10 h-11 rounded outline-none"
                value={perPage}
                onChange={handlePerPageChange}
              >
                {perPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span className="px-3 text-body">entries</span> */}
              <select
                className="ml-3 border px-2 py-1 w-40 h-11 rounded outline-none"
                value={isType}
                onChange={handleApplicationTypeChange}
              >
                <option value="">Type</option>
                {applicationTypeOption.map((option) => (
                  <option key={option.option} value={option.option}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span className="flex flex-row items-center  ml-9">
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
          </span>
        </span>
      </div>

      <div className="mt-6 mr-6">
        {isLoading ? (
          <div className="w-1 ml-[48%] mt-12">
            <Loader />
          </div>
        ) : recieveDocs && recieveDocs.length === 0 ? (
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
            action="View/Download"
            icon={<FaRegEye />}
            tableType={"recieve"}
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

export default StudentRecieveDocument;
