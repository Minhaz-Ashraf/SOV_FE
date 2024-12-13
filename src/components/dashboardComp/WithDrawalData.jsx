import React, { useEffect } from "react";
import { RiBankLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { withdrawalDataGet } from "../../features/generalSlice";
import { IoDocumentText } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const WithDrawalData = ({ userId, agentData }) => {
  const dispatch = useDispatch();
  const { withdrawalData } = useSelector((state) => state.general);
 const location = useLocation()
  console.log(withdrawalData);
  useEffect(() => {
    dispatch(withdrawalDataGet(userId));
  }, [dispatch]);
  return (
    // <div>WithDrawalData</div>
    <>
      <div className={`bg-white rounded-md py-4 px-6  mt-10 font-poppins ${location.pathname === "/student/visa-update" ? "md:mx-20 md:ml-[22%] sm:mx-9 sm:ml-[28%]  mt-36 ":null}  `}>
      <p className="text-[15px] text-body mt-3 mb-5 font-medium">
          {`Student requested for the ${
            withdrawalData?.appliedFor === "courseFeeAndGic"
              ? "Course Fee and GIC"
              : withdrawalData?.appliedFor === "courseFee"
              ? "Course "
              : withdrawalData?.appliedFor === "gic"
              ? "GIC"
              : null
          } Fee amount withdrawal.`}
        </p>
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <RiBankLine />
            </span>
            <span className="font-semibold text-[22px]">Student Bank Details</span>
          </span>
        </div>
      
        <div className="flex flex-row w-full justify-between mt-8">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Bank Name </span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.bankName || "NA"}
            </span>

            <span className="font-light mt-4">Country</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.country || "NA"}
            </span>
            <span className="font-light mt-4">Address</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.address || "NA"}
            </span>
            <span className="font-light mt-4">Postal/Zip Code</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.postalCode || "NA"}
            </span>
            {/* <span className="font-light mt-4">Sort Code/BSB Number</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.sortCode || "NA"}
            </span> */}
            <span className="font-light mt-4">Bank Account Number</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.bankAccountNumber || "NA"}
            </span>
            {/* <span className="font-light mt-4">Intermediary Swift Code </span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.intermediarySwiftCode || "NA"}
            </span> */}
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">City</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.city || "NA"}
            </span>
            <span className="font-light mt-4">Province/State</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.province || "NA"}
            </span>
            <span className="font-light mt-4">Swift/BIC Code</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.swiftBicCode || "NA"}
            </span>
            <span className="font-light mt-4">Bank Account Name</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.bankAccountName || "NA"}
            </span>
            <span className="font-light mt-4">IBAN</span>
            <span className="font-medium">
              {withdrawalData?.studentBankDetails?.iban || "NA"}
            </span>
          </span>
        </div>
      </div>

      <div className={`bg-white rounded-md py-4 px-6 mt-9  font-poppins ${location.pathname === "/student/visa-update" ? "md:mx-20 md:ml-[22%] sm:mx-9 sm:ml-[28%]   ":null}  `}>
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <IoDocumentText />
            </span>
            <span className="font-semibold font-poppins text-[22px]">
           Student Documents
            </span>
          </span>
        </div>
        <span className="flex flex-row items-center justify-between w-full mt-6 mb-20 text-[16px] font-poppins">
          <span className="w-1/2">
            <span className="font-light mt-4">Aadhar Card</span>
            <a
              className="flex items-center gap-3 text-primary font-medium"
              href={withdrawalData?.documentUpload?.aadharCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Adhar Card
              <span>
                <FaRegEye />
              </span>
            </a>
          </span>
          <span className="w-1/2">
            <span className="font-light mt-4">Pan Card</span>
            <a
              className="flex items-center gap-3 text-primary font-medium"
              href={withdrawalData?.documentUpload?.panCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Pan Card
              <span>
                <FaRegEye />
              </span>
            </a>
          </span>
        </span>
      </div>

      {withdrawalData?.parentBankDetails && (
        <>
        <div className={`bg-white rounded-md py-4 px-6 mt-9  font-poppins ${location.pathname === "/student/visa-update" ? "md:mx-20 md:ml-[22%] sm:mx-9 sm:ml-[28%]  ":null}  `}>
            <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
              <span className="flex flex-row gap-4 items-center pb-3">
                <span className="text-[24px]">
                  <RiBankLine />
                </span>
                <span className="font-semibold text-[22px]">
                  Parent Bank Details
                </span>
              </span>
            </div>

            <div className="flex flex-row w-full justify-between mt-8">
              <span className="w-1/2 flex flex-col text-[15px]">
                <span className="font-light">Bank Name </span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.bankName || "NA"}
                </span>

                <span className="font-light mt-4">Country</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.country || "NA"}
                </span>
                <span className="font-light mt-4">Address</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.address || "NA"}
                </span>
                <span className="font-light mt-4">Postal/Zip Code</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.postalCode || "NA"}
                </span>
                {/* <span className="font-light mt-4">Sort Code/BSB Number</span>
            <span className="font-medium">
              {withdrawalData?.parentBankDetails?.sortCode || "NA"}
            </span> */}
                <span className="font-light mt-4">Bank Account Number</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.bankAccountNumber || "NA"}
                </span>
                {/* <span className="font-light mt-4">Intermediary Swift Code </span>
            <span className="font-medium">
              {withdrawalData?.parentBankDetails?.intermediarySwiftCode || "NA"}
            </span> */}
              </span>
              <span className="w-1/2 flex flex-col text-[15px]">
                <span className="font-light mt-4">City</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.city || "NA"}
                </span>
                <span className="font-light mt-4">Province/State</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.province || "NA"}
                </span>
                <span className="font-light mt-4">Swift/BIC Code</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.swiftBicCode || "NA"}
                </span>
                <span className="font-light mt-4">Bank Account Name</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.bankAccountName || "NA"}
                </span>
                <span className="font-light mt-4">IBAN</span>
                <span className="font-medium">
                  {withdrawalData?.parentBankDetails?.iban || "NA"}
                </span>
              </span>
            </div>
          </div>

          <div className={`bg-white rounded-md py-4 px-6 mt-9 md:mb-20 font-poppins ${location.pathname === "/student/visa-update" ? "md:mx-20 md:ml-[22%] sm:mx-9 sm:ml-[28%]   ":null}  `}>
            <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
              <span className="flex flex-row gap-4 items-center pb-3">
                <span className="text-[24px]">
                  <IoDocumentText />
                </span>
                <span className="font-semibold font-poppins text-[22px]">
                 Parent Documents
                </span>
              </span>
            </div>
            <span className="flex flex-row items-center justify-between w-full mt-6 mb-20 text-[16px] font-poppins">
              <span className="w-1/2">
                <span className="font-light mt-4">Aadhar Card</span>
                {withdrawalData?.documentUpload?.parentAadharCard ? (
                  <a
                    className="flex items-center gap-3 text-primary font-medium"
                    href={withdrawalData?.documentUpload?.parentAadharCard}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Adhar Card
                    <span>
                      <FaRegEye />
                    </span>
                  </a>
                ) : (
                  <p>NA</p>
                )}
              </span>
              <span className="w-1/2">
                <span className="font-light mt-4">Pan Card</span>
                {withdrawalData?.documentUpload?.parentPanCard ? (
                  <a
                    className="flex items-center gap-3 text-primary font-medium"
                    href={withdrawalData?.documentUpload?.parentPanCard}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Pan Card
                    <span>
                      <FaRegEye />
                    </span>
                  </a>
                ) : (
                  <p>NA</p>
                )}
              </span>
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default WithDrawalData;
