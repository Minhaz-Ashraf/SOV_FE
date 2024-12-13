import React, { useState } from "react";
import { FaRegEye, FaRegIdCard } from "react-icons/fa";
import { TbPencilMinus } from "react-icons/tb";
import Form1 from "../../../student/Form1";
import Form2 from "./../../../student/Form2";
import { IoHomeOutline } from "react-icons/io5";
import { RxSlider } from "react-icons/rx";
import Form3 from "./../../../student/Form3";
import { BsFillPassportFill } from "react-icons/bs";

const StudentEdit = ({
  data,
  profileView,
  updateData,
  studentId,
  adminPath,
}) => {
  // console.log(data, "check")

  const [isEditing, setIsEditing] = useState(false);
  const [isResidenceProfile, setIsResidenceProfile] = useState(false);
  const [isPrefenceProfile, setIsPreferenceProfile] = useState(false);

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };
  const handleResidenceToggle = () => {
    setIsResidenceProfile((prev) => !prev);
  };
  const handlePreferenceToggle = () => {
    setIsPreferenceProfile((prev) => !prev);
  };

  const handleCancelProfileInfo = () => {
    setIsEditing(false);
  };
  const handleCancelResidence = () => {
    setIsResidenceProfile(false);
  };
  const handleCancelPreference = () => {
    setIsPreferenceProfile(false);
  };
  // console.log(data)

  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins ">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <FaRegIdCard />
            </span>
            <span className="font-semibold text-[22px]">
              Personal Information
            </span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review" 
    
            ? ""
            : !isEditing && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={handleEditToggle}
                  style={{ opacity: isEditing ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Profile Picture</span>
            {data?.personalInformation?.profilePicture ? (
              <a
                className="flex items-center gap-3 text-primary font-medium"
                href={data?.personalInformation?.profilePicture}
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
            <span className="font-light mt-4">Gender</span>
            <span className="font-medium">
              {data?.personalInformation?.gender || "NA"}
            </span>
            <span className="font-light mt-4">First Language</span>
            <span className="font-medium">
              {data?.personalInformation?.firstLanguage || "NA"}
            </span>
            <span className="font-light mt-4">Phone Number</span>
            <span className="font-medium">
              {data?.personalInformation?.phone?.phone || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Full Name</span>
            <span className="font-medium">
              {data?.personalInformation?.firstName +
                " " +
                data?.personalInformation?.lastName || "NA"}
            </span>
            <span className="font-light mt-4">Marital Status</span>
            <span className="font-medium">
              {data?.personalInformation?.maritalStatus || "NA"}
            </span>
            <span className="font-light mt-4">Email Id</span>
            <span className="font-medium">
              {data?.personalInformation?.email || "NA"}
            </span>
            <span className="font-light mt-4">Date of Birth</span>
            <span className="font-medium">
              {data?.personalInformation?.dob || "NA"}
            </span>
          </span>
        </div>

        <div className="bg-white rounded-md  py-4 font-poppins">
          <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
            <span className="flex flex-row gap-4 items-center pb-3">
              <span className="text-[24px]">
                <BsFillPassportFill />
              </span>
              <span className="font-semibold text-[22px]">
                Passport Details
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">upload Passport </span>
            {data?.passportDetails?.passportUpload ? (
              <a
                className="flex items-center gap-3 text-primary font-medium"
                href={data.passportDetails.passportUpload}
                target="_blank"
                rel="noopener noreferrer"
              >
                Uploaded
                <span>
                  <FaRegEye />
                </span>
              </a>
            ) : (
              <span>NA</span>
            )}

            <span className="font-light mt-4">Passport Number</span>
            <span className="font-medium">
              {data?.passportDetails?.passportNumber || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Country of Citizenship</span>
            <span className="font-medium">
              {data?.passportDetails?.countryOfCitizenship || "NA"}
            </span>
            <span className="font-light mt-4">Expiry Date</span>
            <span className="font-medium">
              {data?.passportDetails?.expireDate || "NA"}
            </span>
          </span>
        </div>
        {/* Smooth slide transition for editable section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isEditing
              ? "min-h-[100vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {isEditing && (
            <div className="mt-4">
              <Form1
                hide={true}
                handleCancel={handleCancelProfileInfo}
                studentFormId={data?._id}
                updateData={updateData}
              />
            </div>
          )}
        </div>
      </div>
      {/* residence address */}

      <div className="bg-white rounded-md px-6 py-4 font-poppins mt-6">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <IoHomeOutline />
            </span>
            <span className="font-semibold text-[22px]">Residence Address</span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review" 
            ? ""
            : !isResidenceProfile && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={handleResidenceToggle}
                  style={{ opacity: isResidenceProfile ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Residence Address</span>
            <span className="font-medium">
              {data?.residenceAddress?.address || "NA"}
            </span>

            <span className="font-light mt-4">Province/State</span>
            <span className="font-medium">
              {data?.residenceAddress?.state || "NA"}
            </span>
            <span className="font-light mt-4">Postal/Zip Code</span>
            <span className="font-medium">
              {data?.residenceAddress?.zipcode || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Coutry</span>
            <span className="font-medium">
              {data?.residenceAddress?.country || "NA"}
            </span>
            <span className="font-light mt-4">City/Town</span>
            <span className="font-medium">
              {data?.residenceAddress?.city || "NA"}
            </span>
          </span>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isResidenceProfile
              ? "min-h-[100vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {isResidenceProfile && (
            <div className="mt-4">
              <Form2
                hide={true}
                handleCancel={handleCancelResidence}
                studentFormId={data?._id}
                updateData={updateData}
              />
            </div>
          )}
        </div>
      </div>
      {/* Preferencess */}

      <div className="bg-white rounded-md px-6 py-4 font-poppins mt-6">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <RxSlider />
            </span>
            <span className="font-semibold text-[22px]">Preferences</span>
          </span>
          {profileView === "/admin/approvals" ||
          profileView === "/admin/applications-review" 
            ? ""
            : !isPrefenceProfile && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={handlePreferenceToggle}
                  style={{ opacity: isPrefenceProfile ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="flex flex-row w-full justify-between mt-6 mb-20">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Preferred Country</span>
            <span className="font-medium">
              {data?.preferences?.preferredCountry || "NA"}
            </span>

            <span className="font-light mt-4">Preferred Program</span>
            <span className="font-medium">
              {data?.preferences?.preferredProgram || "NA"}
            </span>
            <span className="font-light mt-4">preferred Province/State</span>
            <span className="font-medium">
              {data?.preferences?.preferredState || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Preffered Institution</span>
            <span className="font-medium">
              {data?.preferences?.preferredInstitution || "NA"}
            </span>
            <span className="font-light mt-4">
              Preferred Level of Education
            </span>
            <span className="font-medium">
              {data?.preferences?.preferredLevelOfEducation || "NA"}
            </span>
          </span>
        </div>
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isPrefenceProfile
              ? "min-h-[50vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {isPrefenceProfile && (
            <div className="">
              <Form3
                hide={true}
                handleCancel={handleCancelPreference}
                studentFormId={data?._id}
                updateData={updateData}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentEdit;
