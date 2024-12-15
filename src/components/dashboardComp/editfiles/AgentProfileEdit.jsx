import React, { useEffect, useState } from "react";
import AgentForm1 from "../../../agent/AgentForm1";
import { BsFillBuildingsFill } from "react-icons/bs";
import { TbPencilMinus } from "react-icons/tb";
import AgentForm2 from "./../../../agent/AgentForm2";
import { MdCall } from "react-icons/md";
import { FaRegEye, FaUser } from "react-icons/fa";
import { RiBankLine } from "react-icons/ri";
import AgentForm3 from "./../../../agent/AgentForm3";
import AgentForm4 from "./../../../agent/AgentForm4";
import { HiBuildingOffice2 } from "react-icons/hi2";
import AgentForm5 from "./../../../agent/AgentForm5";
import { FaBuildingFlag } from "react-icons/fa6";
import AgentForm6 from "./../../../agent/AgentForm6";

const AgentProfileEdit = ({
  agentData,
  locationPath,
  updateData,
  adminId,
  agentId,
}) => {
  const profileView = locationPath?.state?.isprofileView;
  const [toggleStates, setToggleStates] = useState({
    isOne: false,
    isTwo: false,
    isThree: false,
    isFour: false,
    isFive: false,
    isSix: false,
  });

  const handleToggle = (key) => {
    setToggleStates((prevStates) => ({
      ...prevStates,
      [key]: !prevStates[key],
    }));
  };

  const handleCancel = (key) => {
    setToggleStates((prevStates) => ({
      ...prevStates,
      [key]: false,
    }));
  };
  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <BsFillBuildingsFill />
            </span>
            <span className="font-semibold text-[22px]">Company Details</span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review"
            ? ""
            : !toggleStates.isOne && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={() => handleToggle("isOne")}
                  style={{ opacity: toggleStates.isOne ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Business Name </span>
            <span className="font-medium">
              {agentData?.companyDetails?.businessName || "NA"}
            </span>
            <span className="font-light mt-4">Country</span>
            <span className="font-medium">
              {agentData?.companyDetails?.country || "NA"}
            </span>
            <span className="font-light mt-4">City</span>
            <span className="font-medium">
              {agentData?.companyDetails?.city || "NA"}
            </span>
            <span className="font-light mt-4">Direct Phone Number</span>
            <span className="font-medium">
              {agentData?.companyDetails?.phoneNumber || "NA"}
            </span>
            <span className="font-light mt-4">Company LinkedIn</span>
            <span className="font-medium ">
              {agentData?.companyDetails?.linkedin ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={
                    agentData?.companyDetails?.linkedin?.startsWith("http")
                      ? agentData.companyDetails.linkedin
                      : `https://${agentData?.companyDetails?.linkedin}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Linkedin link
                  <span>
                    <FaRegEye />
                  </span>
                </a>
              ) : (
                "NA"
              )}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Address</span>
            <span className="font-medium">
              {agentData?.companyDetails?.address || "NA"}
            </span>
            <span className="font-light mt-4">Province/State</span>
            <span className="font-medium">
              {agentData?.companyDetails?.provinceState || "NA"}
            </span>
            <span className="font-light mt-4">Postal/Zip Code</span>
            <span className="font-medium">
              {agentData?.companyDetails?.postalCode || "NA"}
            </span>
            <span className="font-light mt-4">Website</span>
            <span className="font-medium">
              {agentData?.companyDetails?.website ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={
                    agentData?.companyDetails?.website?.startsWith("http")
                      ? agentData.companyDetails.website
                      : `https://${agentData?.companyDetails?.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website link
                  <span>
                    <FaRegEye />
                  </span>
                </a>
              ) : (
                "NA"
              )}
            </span>
            <span className="font-light mt-4">Whatsapp Number</span>
            <span className="font-medium">
              {agentData?.companyDetails?.whatsappNumber || "NA"}
            </span>
          </span>
        </div>

        {/* Smooth slide transition for editable section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            toggleStates.isOne
                 ? "md:h-[100vh] lg:h-[130vh] sm:h-[87vh]  translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {toggleStates.isOne && (
            <div className="mt-4">
              <AgentForm1
                hide={true}
                handleCancel={handleCancel}
                updateData={updateData}
                adminId={adminId}
                agentId={agentId}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md px-6 py-4 font-poppins mt-6">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <MdCall />
            </span>
            <span className="font-semibold text-[22px]">
              Primary Contact for Company
            </span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review"
            ? ""
            : !toggleStates.isTwo && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={() => handleToggle("isTwo")}
                  style={{ opacity: toggleStates.isTwo ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Full Name </span>
            <span className="font-medium">
              {agentData?.primaryContact?.firstName +
                " " +
                agentData?.primaryContact?.lastName || "NA"}
            </span>
            <span className="font-light mt-4">Email/Username</span>
            <span className="font-medium">
              {agentData?.primaryContact?.emailUsername || "NA"}
            </span>
            <span className="font-light mt-4">Mobile</span>
            <span className="font-medium">
              {agentData?.primaryContact?.phoneNumber || "NA"}
            </span>
            {/* <span className="font-light mt-4">Linkedin</span>
            <span className="font-medium">
              {agentData?.primaryContact?.linkedin || "NA"}
            </span> */}
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Position/Job Title</span>
            <span className="font-medium">
              {agentData?.primaryContact?.positionJobTitle || "NA"}
            </span>
            <span className="font-light mt-4">Country</span>
            <span className="font-medium">
              {agentData?.primaryContact?.country || "NA"}
            </span>
            <span className="font-light mt-4">Profile Picture</span>
            {agentData?.primaryContact?.profilePicture ? (
              <a
                className="flex items-center gap-3 text-primary font-medium"
                href={agentData?.primaryContact?.profilePicture}
                target="_blank"
                rel="noopener noreferrer"
              >
                Uploaded
                <span>
                  <FaRegEye />
                </span>
              </a>
            ) : (
              "NA"
            )}
          </span>
        </div>
        {/* comission */}
        <div className="flex flex-row text-sidebar items-center mt-10 justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <MdCall />
            </span>
            <span className="font-semibold text-[22px]">
              Primary Contact for Commission and Invoices
            </span>
          </span>
        </div>

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Full Name </span>
            <span className="font-medium">
              {agentData?.commissionContact?.fullName || "NA"}
            </span>
            <span className="font-light mt-4">Email/Username</span>
            <span className="font-medium">
              {agentData?.commissionContact?.email || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Position/Job Title</span>
            <span className="font-medium">
              {agentData?.commissionContact?.positionJobTitle || "NA"}
            </span>
            <span className="font-light mt-4">Mobile</span>
            <span className="font-medium">
              {agentData?.commissionContact?.phoneNumber || "NA"}
            </span>
          </span>
        </div>

        <div className="flex flex-row text-sidebar items-center mt-10 justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <MdCall />
            </span>
            <span className="font-semibold text-[22px]">
              Primary Contact for Admissions
            </span>
          </span>
        </div>
        {agentData?.admissionsContacts?.map((data, index) => (
          <div
            key={index}
            className={`flex flex-row w-full justify-between mt-6 ${
              index > 0 ? "border-t border-greyish" : "border-none"
            } `}
          >
            <span className="w-1/2 flex flex-col text-[15px] mt-3">
              <span className="font-light">Country </span>
              <span className="font-medium">{data?.fullName || "NA"}</span>
              <span className="font-light mt-4">Position/Job Title</span>
              <span className="font-medium">
                {data?.positionJobTitle || "NA"}
              </span>
              <span className="font-light mt-4">Email</span>
              <span className="font-medium">{data?.email || "NA"}</span>
            </span>
            <span className="w-1/2 flex flex-col text-[15px]">
              <span className="font-light mt-4">Full Name</span>
              <span className="font-medium">{data?.fullName || "NA"}</span>
              <span className="font-light mt-4">Mobile</span>
              <span className="font-medium">{data?.mobileNumber || "NA"}</span>
            </span>
          </div>
        ))}
        {/* Smooth slide transition for editable section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            toggleStates.isTwo
                ? "md:min-h-[70vh] lg:min-h-[100vh] sm:min-h-[60vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {toggleStates.isTwo && (
            <div className="mt-4">
              <AgentForm2
                adminId={adminId}
                hide={true}
                handleCancel={handleCancel}
                updateData={updateData}
                agentId={agentId}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md py-4 px-6  mt-10 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <RiBankLine />
            </span>
            <span className="font-semibold text-[22px]">Bank Details</span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review"
            ? ""
            : !toggleStates.isThree && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={() => handleToggle("isThree")}
                  style={{ opacity: toggleStates.isThree ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="flex flex-row w-full justify-between mt-8">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Bank Name </span>
            <span className="font-medium">
              {agentData?.bankDetails?.bankName || "NA"}
            </span>
            <span className="font-light mt-4">Country</span>
            <span className="font-medium">
              {agentData?.bankDetails?.country || "NA"}
            </span>
            <span className="font-light mt-4">Address</span>
            <span className="font-medium">
              {agentData?.bankDetails?.address || "NA"}
            </span>
            <span className="font-light mt-4">Postal/Zip Code</span>
            <span className="font-medium">
              {agentData?.bankDetails?.postalCode || "NA"}
            </span>
            <span className="font-light mt-4">Sort Code/BSB Number</span>
            <span className="font-medium">
              {agentData?.bankDetails?.sortCode || "NA"}
            </span>
            <span className="font-light mt-4">Bank Account Number</span>
            <span className="font-medium">
              {agentData?.bankDetails?.bankAccountNumber || "NA"}
            </span>
            <span className="font-light mt-4">Intermediary Swift Code </span>
            <span className="font-medium">
              {agentData?.bankDetails?.intermediarySwiftCode || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Branch Name</span>
            <span className="font-medium">
              {agentData?.bankDetails?.branchName || "NA"}
            </span>
            <span className="font-light mt-4">City</span>
            <span className="font-medium">
              {agentData?.bankDetails?.city || "NA"}
            </span>
            <span className="font-light mt-4">Province/State</span>
            <span className="font-medium">
              {agentData?.bankDetails?.provinceState || "NA"}
            </span>
            <span className="font-light mt-4">Swift/BIC Code</span>
            <span className="font-medium">
              {agentData?.bankDetails?.swiftBicCode || "NA"}
            </span>
            <span className="font-light mt-4">Bank Account Name</span>
            <span className="font-medium">
              {agentData?.bankDetails?.bankAccountName || "NA"}
            </span>
            <span className="font-light mt-4">IBAN</span>
            <span className="font-medium">
              {agentData?.bankDetails?.iban || "NA"}
            </span>
          </span>
        </div>

        {/* Smooth slide transition for editable section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            toggleStates.isThree
                              ? "md:h-[100vh] lg:h-[130vh] sm:h-[87vh]  translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {toggleStates.isThree && (
            <div className="mt-4">
              <AgentForm3
                adminId={adminId}
                hide={true}
                handleCancel={handleCancel}
                updateData={updateData}
                agentId={agentId}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md py-4 px-8 mt-9 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <HiBuildingOffice2 />
            </span>
            <span className="font-semibold text-[22px]">Company Overview</span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review"
            ? ""
            : !toggleStates.isFour && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={() => handleToggle("isFour")}
                  style={{ opacity: toggleStates.isFour ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="  w-full  mt-6">
          <span className=" flex flex-col text-[15px]">
            <span className="font-light">
              {" "}
              Starting Year of Business Operation
            </span>
            <span className="font-medium">
              {agentData?.companyOverview?.businessOperationStartYear || "NA"}
            </span>
            <span className="font-light mt-4">
              How many students have you sent so far?
            </span>
            <span className="font-medium">
              {agentData?.companyOverview?.numberOfStudents || "NA"}
            </span>
            <span className="font-light mt-4">
              From which country/countries you send your students?*
            </span>
            <span className="font-medium">
              {agentData?.companyOverview?.studentSourceCountry || "NA"}
            </span>
            <span className="font-light mt-4 pr-72">
              In your market, which countries are the most popular destinations?
              Please rank them from the most to least popular.
            </span>
            {agentData.companyOverview?.popularDestinations?.map(
              (data, index) => (
                <span className="font-medium" key={index}>
                  {data || "NA"}
                </span>
              )
            )}
            <span className="font-light mt-4">
              Is your business licensed by the government of your country?
            </span>
            <span className="font-medium">
              {agentData?.companyOverview?.governmentLicensed || "NA"}
            </span>
          </span>
          <span className="flex flex-row  items-center justify-between   w-full ">
            <span className="flex flex-col   items-start w-1/2">
              <span className="font-light mt-4">
                Business Registration Number
              </span>

              <span className="font-medium">
                {agentData?.companyOverview?.businessRegistrationNumber || "NA"}
              </span>
              <span className="font-light mt-4">
                Business Registration Document
              </span>
              {agentData?.companyOverview?.businessRegistrationDocument ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={
                    agentData?.companyOverview?.businessRegistrationDocument
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Uploaded
                  <span>
                    <FaRegEye />
                  </span>
                </a>
              ) : (
                "NA"
              )}

              <span className="font-light mt-4">Company GST</span>
              {agentData?.companyOverview?.companyGST ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={agentData?.companyOverview?.companyGST}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Uploaded
                  <span>
                    <FaRegEye />
                  </span>
                </a>
              ) : (
                "NA"
              )}
            </span>

            <span className="flex flex-col items-start w-1/2">
              <span className="font-light mt-4">
                What type of Business Registration?{" "}
              </span>
              <span className="font-medium">
                {agentData?.companyOverview?.businessRegistrationType || "NA"}
              </span>
              <span className="font-light mt-4">Company/Business Profile </span>
              {agentData?.companyOverview?.businessProfileDocument ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={agentData?.companyOverview?.businessProfileDocument}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Uploaded
                  <span>
                    <FaRegEye />
                  </span>
                </a>
              ) : (
                "NA"
              )}
              <span className="font-light mt-4">Company PAN Card </span>
              {agentData?.companyOverview?.companyPan ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={agentData?.companyOverview?.companyPan}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Uploaded
                  <span>
                    <FaRegEye />
                  </span>
                </a>
              ) : (
                "NA"
              )}
            </span>
          </span>

          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">
              What type of Higher Education Programmes are your Customer
              interested in?
            </span>
            {agentData?.companyOverview?.higherEducationProgrammes?.length ? (
              agentData.companyOverview.higherEducationProgrammes.map(
                (data, index) => (
                  <span className="font-medium" key={index}>
                    {data || "NA"}
                  </span>
                )
              )
            ) : (
              <span className="font-medium">NA</span>
            )}

            <span className="font-light mt-4">
              What are the most common sources of finance of your students?
            </span>
            {agentData?.companyOverview?.financeSources?.length ? (
              agentData.companyOverview.financeSources.map((data, index) => (
                <span className="font-medium" key={index}>
                  {data || "NA"}
                </span>
              ))
            ) : (
              <span className="font-medium">NA</span>
            )}

            <span className="font-light mt-4">
              I am interested in receiving product information on the following
              destination?
            </span>
            {agentData?.companyOverview?.studyDestinations?.length ? (
              agentData.companyOverview.studyDestinations.map((data, index) => (
                <span className="font-medium" key={index}>
                  {data || "NA"}
                </span>
              ))
            ) : (
              <span className="font-medium">NA</span>
            )}
          </span>
        </div>

        {/* Smooth slide transition for editable section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            toggleStates.isFour
                ? "md:min-h-[80vh] lg:min-h-[100vh] sm:min-h-[60vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {toggleStates.isFour && (
            <div className="mt-4">
              <AgentForm4
                adminId={adminId}
                hide={true}
                handleCancel={handleCancel}
                updateData={updateData}
                agentId={agentId}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md px-6 py-4 font-poppins mt-9">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <FaBuildingFlag />
            </span>
            <span className="font-semibold text-[22px]">
              Comapny Operations
            </span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review"
            ? ""
            : !toggleStates.isFive && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={() => handleToggle("isFive")}
                  style={{ opacity: toggleStates.isFive ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">
              How many counsellors do you employ?{" "}
            </span>
            <span className="font-medium">
              {agentData?.companyOperations?.numberOfCounselors || "NA"}
            </span>
            <span className="font-light mt-4">
              On average how many years of relevant experience do your
              counsellors have?
            </span>
            <span className="font-medium">
              {agentData?.companyOperations?.averageExperienceYears || "NA"}
            </span>
            <span className="font-light mt-4">
              How do you advertise your services?
            </span>
            <span className="font-medium">
              {agentData?.companyOperations?.advertisementMethods?.length ? (
                agentData.companyOperations.advertisementMethods.map(
                  (data, index) => (
                    <span className="font-medium" key={index}>
                      {data || "NA"}
                    </span>
                  )
                )
              ) : (
                <span className="font-medium">NA</span>
              )}
            </span>
            <span className="font-light mt-4">Social Media</span>
            {agentData?.companyOperations?.socialMediaPlatforms?.length ? (
              agentData.companyOperations.socialMediaPlatforms.map(
                (data, index) => (
                  <span className="font-medium" key={index}>
                    {data || "NA"}
                  </span>
                )
              )
            ) : (
              <span className="font-medium">NA</span>
            )}
          </span>
        </div>

        {/* Smooth slide transition for editable section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            toggleStates.isFive
                 ? "md:h-[70vh] lg:h-[100vh] sm:h-[72vh]  translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {toggleStates.isFive && (
            <div className="mt-4">
              <AgentForm5
                adminId={adminId}
                hide={true}
                handleCancel={handleCancel}
                updateData={updateData}
                agentId={agentId}
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-md px-6 py-4 font-poppins mb-16 mt-9">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <FaUser />
            </span>
            <span className="font-semibold text-[22px]">References</span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review"
            ? ""
            : !toggleStates.isSix && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={() => handleToggle("isSix")}
                  style={{ opacity: toggleStates.isSix ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>
        {agentData?.references?.map((data, index) => (
          <div className="w-full mt-6" key={index}>
            <span className="font-medium text-[20px]">
              {" "}
              {index === 0 ? "First Reference" : "Second Reference"}
            </span>

            <span className=" flex flex-col text-[15px] mt-3">
              <span className="font-light">Reference Type ? </span>
              <span className="font-medium">{data?.referenceType || "NA"}</span>
              <span className="flex flex-row items-center justify-between">
                <span className=" flex flex-col text-[15px] w-1/2">
                  <span className="font-light mt-4">Contact Person</span>
                  <span className="font-medium">
                    {data?.contactPerson || "NA"}
                  </span>
                  <span className="font-light mt-4">Designation</span>
                  <span className="font-medium">
                    {data?.designation || "NA"}
                  </span>
                  <span className="font-light mt-4">Contact Number</span>

                  <span className="font-medium">
                    {data.contactNumber || "NA"}
                  </span>
                </span>
                <span className=" flex flex-col text-[15px] w-1/2">
                  <span className="font-light mt-4">Institution Name</span>
                  <span className="font-medium">
                    {data?.institutionName || "NA"}
                  </span>
                  <span className="font-light mt-4">Country</span>
                  <span className="font-medium">{data?.country || "NA"}</span>
                  <span className="font-light mt-4">Email</span>

                  <span className="font-medium">{data.email || "NA"}</span>
                </span>
              </span>
            </span>
          </div>
        ))}
        {/* Smooth slide transition for editable section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            toggleStates.isSix
              ? "md:min-h-[80vh] lg:min-h-[100vh] sm:min-h-[60vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {toggleStates.isSix && (
            <div className="mt-4">
              <AgentForm6
                adminId={adminId}
                agentId={agentId}
                hide={true}
                handleCancel={handleCancel}
                updateData={updateData}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgentProfileEdit;
