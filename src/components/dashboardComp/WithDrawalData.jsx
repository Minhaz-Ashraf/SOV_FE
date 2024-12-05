import React, { useEffect } from "react";
import { RiBankLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { withdrawalDataGet } from "../../features/generalSlice";
import { IoDocumentText } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";

const WithDrawalData = ({ userId, agentData }) => {
  const dispatch = useDispatch();
  const { withdrawalData } = useSelector((state) => state.general);

  console.log(withdrawalData);
  useEffect(() => {
    dispatch(withdrawalDataGet(userId));
  }, [dispatch]);
  return (
    // <div>WithDrawalData</div>
    <>
      <div className="bg-white rounded-md py-4 px-6  mt-10 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <RiBankLine />
            </span>
            <span className="font-semibold text-[22px]">Bank Details</span>
          </span>
        </div>

        <div className="flex flex-row w-full justify-between mt-8">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Bank Name </span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.bankName || "NA"}
            </span>

            <span className="font-light mt-4">Country</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.country || "NA"}
            </span>
            <span className="font-light mt-4">Address</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.address || "NA"}
            </span>
            <span className="font-light mt-4">Postal/Zip Code</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.postalCode || "NA"}
            </span>
            {/* <span className="font-light mt-4">Sort Code/BSB Number</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.sortCode || "NA"}
            </span> */}
            <span className="font-light mt-4">Bank Account Number</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.bankAccountNumber || "NA"}
            </span>
            {/* <span className="font-light mt-4">Intermediary Swift Code </span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.intermediarySwiftCode || "NA"}
            </span> */}
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">City</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.city || "NA"}
            </span>
            <span className="font-light mt-4">Province/State</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.province || "NA"}
            </span>
            <span className="font-light mt-4">Swift/BIC Code</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.swiftBicCode || "NA"}
            </span>
            <span className="font-light mt-4">Bank Account Name</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.bankAccountName || "NA"}
            </span>
            <span className="font-light mt-4">IBAN</span>
            <span className="font-medium">
              {withdrawalData?.bankDetails?.iban || "NA"}
            </span>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-md py-4 px-6  mt-10 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <IoDocumentText />
            </span>
            <span className="font-semibold font-poppins text-[22px]">
              Documents
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
    </>
  );
};

export default WithDrawalData;
