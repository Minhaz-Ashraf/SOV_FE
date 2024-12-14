import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { GiGraduateCap } from "react-icons/gi";
import { CustomInput } from "../../reusable/Input";
import OfferLetterPop from "../OfferLetterPop";
import { deleteDocument, OfferLetterEduInfoEdit, uploadDocument } from "../../../features/generalApi";
import { useSelector } from "react-redux";
import { FiUpload } from "react-icons/fi";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../../utils/fireBase";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbPencilMinus } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";

// Define required marksheets for each education level
const educationLevels = {
  diploma: ["markSheet10"],
  underGraduate: ["markSheet10", "markSheet12"],
  postGraduate: ["markSheet10", "markSheet12", "markSheetUnderGraduate"],
  diplomaPG: [
    "markSheet10",
    "markSheet12",
    "markSheetUnderGraduate",
    "markSheetPostGraduate",
  ],
  certificationCourse: [
    "markSheet10",
    "markSheet12",
    "markSheetUnderGraduate",
    "markSheetPostGraduate",
  ],
};

const initialEducationDetails = {
  educationLevel: "",
  markSheet10: "",
  markSheet12: "",
  markSheetUnderGraduate: "",
  markSheetPostGraduate: "",
};

const OfferLetterEducationDetails = ({ appId, updatedData, profileViewPath, userId }) => {
  const [offerLater, setOfferLater] = useState({
    educationDetails: { ...initialEducationDetails },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopUp, setIsPopUp] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState("");
  const [isFileType, seFileType] = useState();
  const [isOne, setIsOne] = useState(false);
  const [errors, setErrors] = useState({});
  const { applicationDataById } = useSelector((state) => state.agent);
  const [resetDoc, setResetDoc] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState([]);
const [newFiles, setNewFiles] = useState([]);


  const PopUpOpen = () => setIsPopUp(true);
  const PopUpClose = () => setIsPopUp(false);
  const handleOneToggle = () => {
    setIsOne((prev) => !prev);
  };
  const handleCancelOne = () => {
    setIsOne(false);
  };

  const handleInput = (e) => {
    const { name, value, type } = e.target;

    if (type === "radio") {
      setSelectedEducation(value);
      setOfferLater({
        ...offerLater,
        educationDetails: { ...initialEducationDetails, educationLevel: value },
      });
    }
  };

  const handleFilePopupOpen = (fileType) => {
    seFileType(fileType);
    PopUpOpen();
  };
  const handleFileUpload = (files, uploadType) => {
    if (!files || files.length === 0 || !uploadType) return;
  
    const fileOrUrl = files[0];
  
    if (fileOrUrl instanceof File) {
      // Handle File objects
      const blobUrl = URL.createObjectURL(fileOrUrl);
  
      // Save file locally to be uploaded later
      setNewFiles((prevState) => [
        ...prevState,
        { file: fileOrUrl, uploadType },
      ]);
  
      // Show a temporary file URL for preview
      setOfferLater((prevState) => ({
        ...prevState,
        educationDetails: {
          ...prevState.educationDetails,
          [uploadType]: blobUrl, // Set blob URL temporarily
        },
      }));
  
      // toast.info(`${fileOrUrl.name} will be uploaded upon saving.`);
    } else if (typeof fileOrUrl === "string") {
      // Handle URL strings: directly set in the educationDetails state
      setOfferLater((prevState) => ({
        ...prevState,
        educationDetails: {
          ...prevState.educationDetails,
          [uploadType]: fileOrUrl, // Set the URL directly
        },
      }));
  
      // toast.info("Document URL has been set.");
    }
  };
  
  const deleteFile = async(fileUrl, uploadType) => {
    if (!fileUrl) return;

    // Add file to deletedFiles array for deferred deletion
    setDeletedFiles((prevState) => [
      ...prevState,
      { fileUrl, uploadType },
    ]);
  
    // Clear the respective field in the state
    setOfferLater((prevState) => ({
      ...prevState,
      educationDetails: {
        ...prevState.educationDetails,
        [uploadType]: "",
      },
    }));
  
    // toast.info("File marked for deletion. Changes will be applied upon saving.");
  };
  

  const validateFields = () => {
    const errors = {};

    if (!selectedEducation) {
      errors.educationLevel = "Please select an education level.";
    }

    const requiredDocs = educationLevels[selectedEducation] || [];
    requiredDocs.forEach((doc) => {
      if (!offerLater.educationDetails[doc]) {
        errors[doc] = `Please upload ${doc.replace("markSheet", "Marksheet")}.`;
      }
    });

    return errors;
  };

const handleSubmit = async () => {
  const validationErrors = validateFields();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    toast.error("Form contains errors.");
    return;
  }

  try {
    setIsSubmitting(true);
    // Delete files marked for deletion
    // for (const { fileUrl } of deletedFiles) {
    //   const storageRef = ref(storage, fileUrl);
    //   try {
    //     await deleteObject(storageRef);
    // await deleteDocument(fileUrl)

    //     // toast.success(`File ${fileUrl} deleted successfully.`);
    //   } catch (error) {
    //     // toast.error(`Error deleting file: ${fileUrl}`);
    //   }
    // }

    // Prepare to upload files and collect Firebase URLs
    const updatedEducationDetails = { ...offerLater.educationDetails };

    await Promise.all(
      newFiles.map(async ({ file, uploadType }) => {
       const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `uploads/offerLetter/${uniqueFileName}`);
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          // Update temporary object with Firebase URL
          updatedEducationDetails[uploadType] = downloadURL;
          const uploadData = { viewUrl: downloadURL, documentName: file.name, userId: userId };
          await uploadDocument(uploadData);
          toast.success(`${file.name} uploaded successfully.`);
        } catch (error) {
          toast.error(`Error uploading ${file.name}. Please try again.`);
        }
      })
    );

    // Update state with Firebase URLs
    setOfferLater((prevState) => ({
      ...prevState,
      educationDetails: updatedEducationDetails,
    }));

    // Ensure state is fully updated before sending to backend
    const updatedOfferLater = {
      ...offerLater,
      educationDetails: updatedEducationDetails,
    };

    // Send updated data to backend
    const section = "offerLetter";
    const res = await OfferLetterEduInfoEdit(appId, updatedOfferLater, section);
    updatedData();
    toast.success(res.message || "Data added successfully.");


    // Clear temporary states
    setDeletedFiles([]);
    setNewFiles([]);
    setIsSubmitting(false);
    handleCancelOne();
  } catch (error) {
    toast.error("Something went wrong.");
  }
};

  useEffect(() => {
    if (applicationDataById?.offerLetter?.educationDetails) {
      setOfferLater((prevState) => ({
        ...prevState,
        educationDetails: {
          educationLevel:
            applicationDataById?.offerLetter.educationDetails.educationLevel || "",
          markSheet10: applicationDataById?.offerLetter.educationDetails.markSheet10 || "",
          markSheet12: applicationDataById?.offerLetter.educationDetails.markSheet12 || "",
          markSheetUnderGraduate:
            applicationDataById?.offerLetter.educationDetails.markSheetUnderGraduate || "",
          markSheetPostGraduate:
            applicationDataById?.offerLetter.educationDetails.markSheetPostGraduate || "",
        },
      }));

      setSelectedEducation(
        applicationDataById?.offerLetter.educationDetails.educationLevel || ""
      );
    }
  }, [applicationDataById]);
console.log(applicationDataById)
  const educationLevelLabels = {
    diploma: "Diploma",
    underGraduate: "Under Graduate",
    postGraduate: "Post Graduate",
    diplomaPG: "Diploma (PG)",
    certificationCourse: "Certification Course",
  };
  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins ">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <GiGraduateCap />
            </span>
            <span className="font-semibold text-[22px]">Education Details</span>
          </span>
          {profileViewPath 
            ? ""
            : !isOne && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={handleOneToggle}
                  style={{ opacity: isOne ? 0 : 1 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-full flex flex-row  text-[15px] justify-between">
            <span className="w-1/2 ">
              <span className="flex flex-col ">
                {" "}
                <span className="font-light">Level of Education</span>
                <span className="font-medium ">
                  {educationLevelLabels[
                    applicationDataById?.offerLetter?.educationDetails?.educationLevel
                  ] || "NA"}
                </span>
              </span>

              <span className="flex flex-col ">
                <span className="font-light mt-4">10th Marksheet</span>

                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={
                    applicationDataById?.offerLetter?.educationDetails?.markSheet10 || "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {applicationDataById?.offerLetter?.educationDetails?.markSheet10 &&
                     "Uploaded"
                    }
                  <span>
                    <FaRegEye />
                  </span>
                </a>
              </span>

              {applicationDataById?.offerLetter?.educationDetails?.markSheet12 && (
                <>
                  <span className="font-light mt-4">12th Marksheet</span>
                  <a
                    className="flex items-center gap-3 text-primary font-medium"
                    href={applicationDataById?.offerLetter?.educationDetails?.markSheet12}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {applicationDataById?.offerLetter?.educationDetails?.markSheet12
                      ? "Uploaded"
                      : "NA"}
                    <span>
                      <FaRegEye />
                    </span>
                  </a>
                </>
              )}
            </span>
            <span className="w-1/2">
              {applicationDataById?.offerLetter?.educationDetails
                ?.markSheetUnderGraduate && (
                <>
                  <span className="font-light mt-4">Under Graduate</span>
                  <a
                    className="flex items-center gap-3 text-primary font-medium"
                    href={
                      applicationDataById?.offerLetter?.educationDetails
                        ?.markSheetUnderGraduate
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {applicationDataById?.offerLetter?.educationDetails
                      ?.markSheetUnderGraduate
                      ? "Uploaded"
                      : "NA"}
                    <span>
                      <FaRegEye />
                    </span>
                  </a>
                </>
              )}

              {applicationDataById?.offerLetter?.educationDetails?.markSheetPostGraduate && (
                <>
                  <span className="font-light mt-4">Post Graduate</span>
                  <a
                    className="flex items-center gap-3 text-primary font-medium"
                    href={
                      applicationDataById?.offerLetter?.educationDetails
                        ?.markSheetPostGraduate
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {applicationDataById?.offerLetter?.educationDetails
                      ?.markSheetPostGraduate
                      ? "Uploaded"
                      : "NA"}
                    <span>
                      <FaRegEye />
                    </span>
                  </a>
                </>
              )}
            </span>
          </span>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isOne
              ? "min-h-[50vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {isOne && (
            <div className="bg-white  rounded-xl  py-4 pb-12 mt-6">
              {/* Education Level Selection */}
              <div className="flex flex-wrap mt-4 gap-6 text-body">
                {Object.keys(educationLevels).map((level) => (
                  <span
                    key={level}
                    className="flex items-center gap-4 border border-[#CFCFD7] rounded-md py-3 w-64 justify-evenly"
                  >
                    {educationLevelLabels[level] ||
                      level.replace(/([A-Z])/g, " $1")}{" "}
                    {/* Convert camelCase to readable format */}
                    <CustomInput
                      type="radio"
                      label={level}
                      value={level}
                      name="educationLevel"
                      onChange={handleInput}
                      checked={selectedEducation === level}
                    />
                  </span>
                ))}
              </div>

              {/* File Upload Section */}
              {selectedEducation && (
                <div className="mt-6">
                  {educationLevels[selectedEducation].map((fileType) => (
                    <div
                      key={fileType}
                      className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-9 mb-4"
                    >
                      <button
                        className="text-black flex items-center"
                        onClick={() => handleFilePopupOpen(fileType)}
                      >
                        <FiUpload className="mr-2 text-primary text-[29px]" />
                      </button>
                      <p className="mt-6">
                        {fileType.replace("markSheet", "Marksheet ")}
                      </p>

                      {/* Display uploaded file */}
                      {offerLater.educationDetails[fileType] && (
                        <div className="mt-4 flex items-center">
                          <a
                            href={offerLater.educationDetails[fileType]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary rounded-sm px-6 py-2 border border-greyish"
                          >
                            View Uploaded Document
                          </a>
                          <button
                            onClick={() =>
                              deleteFile(
                                offerLater.educationDetails[fileType],
                                fileType
                              )
                            }
                            className="ml-4 text-red-500 text-[21px]"
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
{console.log(offerLater.educationDetails)}
              {/* Error Display */}
              {Object.keys(errors).length > 0 && (
                <div className="mt-6">
                  {Object.values(errors).map((error, index) => (
                    <p key={index} className="text-red-500">
                      {error}
                    </p>
                  ))}
                </div>
              )}

              {/* Save Button */}
              {isOne && (
                <div className="flex justify-end gap-4 mt-20">
                  <button
                    className="border border-greyish text-black px-4 py-2 rounded"
                    onClick={handleCancelOne}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-primary text-white px-6 py-2 rounded"
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <OfferLetterPop
        isPopUp={isPopUp}
        docLabel="Upload Marksheet"
        PopUpClose={PopUpClose}
        setResetDoc={setResetDoc}
        studentId={userId}
        handleFileUpload={(files) => handleFileUpload(files, isFileType)}
        onSubmit={() => {
          console.log("Form Submitted");
        }}
      />
    </>
  );
};

export default OfferLetterEducationDetails;
