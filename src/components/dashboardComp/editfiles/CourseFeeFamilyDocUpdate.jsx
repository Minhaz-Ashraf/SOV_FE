import React, { useEffect, useState } from "react";
import OfferLetterPop from "../OfferLetterPop";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { FaRegEye, FaRegIdCard } from "react-icons/fa6";
import { TbPencilMinus } from "react-icons/tb";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../../utils/fireBase";
import { useDispatch, useSelector } from "react-redux";
import { allApplication } from "../../../features/agentSlice";
import {
  deleteDocument,
  updateCourseFeeFamilyDoc,
  updateCourseFeeStudentDoc,
  updateVisaDocument,
  uploadDocument,
} from "../../../features/generalApi";
import { v4 as uuidv4 } from "uuid";

import { toast } from "react-toastify";
const initialParentDocument = {
  fatherAadharCard: "",
  fatherPanCard: "",
  motherAadharCard: "",
  motherPanCard: "",
};
const initialSiblingDocument = {
  siblingAadharCard: "",
  siblingPanCard: "",
};

const CourseFeeFamilyDocUpdate = ({
  appId,
  updatedData,
  profileViewPath,
  userId,
}) => {
  const { applicationDataById } = useSelector((state) => state.agent);
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isOne, setIsOne] = useState(false);
  const [courseFee, setCourseFee] = useState({
    parentDocument: { ...initialParentDocument },
    siblingDocument: { ...initialSiblingDocument },
  });
  const [selectedOption, setSelectedOption] = useState(
    courseFee?.parentDocument?.fatherAadharCard ||
      courseFee?.parentDocument?.motherAadharCard
      ? "parent"
      : "sibling"
  );


  useEffect(() => {
    dispatch(allApplication());
  }, [dispatch]);
  const [isPopUp, setIsPopUp] = useState(false);

  const [errors, setErrors] = useState({});
  const [isFileType, setFileType] = useState();
  const [resetDoc, setResetDoc] = useState(false);

  const handleFilePopupOpen = (fileType) => {
    setFileType(fileType);
    setIsPopUp(true);
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleOneToggle = () => {
    setIsOne((prev) => !prev); // Toggle the form visibility
  };

  const handleCancelOne = () => {
    setIsOne(false);
  };

  const validateFields = () => {
    const errors = {};

    // Personal Details Validation
    if (selectedOption === "parent") {
      Object.keys(courseFee.parentDocument).forEach((docType) => {
        if (!courseFee.parentDocument[docType]) {
          errors[docType] = `${docType.replace(
            /([A-Z])/g,
            " $1"
          )} is required.`;
        }
      });
    }

    if (selectedOption === "sibling") {
      Object.keys(courseFee.siblingDocument).forEach((docType) => {
        if (!courseFee.siblingDocument[docType]) {
          errors[docType] = `${docType.replace(
            /([A-Z])/g,
            " $1"
          )} is required.`;
        }
      });
    }

    return errors;
  };

  useEffect(() => {
    if (applicationDataById) {
      setCourseFee((prevState) => ({
        ...prevState,
        parentDocument: {
          fatherAadharCard:
            applicationDataById?.courseFeeApplication?.parentDocument
              ?.fatherAadharCard || "",
          fatherPanCard:
            applicationDataById?.courseFeeApplication?.parentDocument
              ?.fatherPanCard || "",
          motherAadharCard:
            applicationDataById?.courseFeeApplication?.parentDocument
              ?.motherAadharCard || "",
          motherPanCard:
            applicationDataById?.courseFeeApplication?.parentDocument
              ?.motherPanCard || "",
        },
        siblingDocument: {
          // Use siblingDocument here instead of studentDocument
          siblingAadharCard:
            applicationDataById?.courseFeeApplication?.siblingsDocument
              ?.siblingAadharCard || "",
          siblingPanCard:
            applicationDataById?.courseFeeApplication?.siblingsDocument
              ?.siblingPanCard || "",
        },
      }));
    }
  }, [applicationDataById]);

  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;

    const fileOrUrl = files[0];

    if (typeof fileOrUrl === "string" && fileOrUrl.startsWith("http")) {
      // Handle Firebase URL case
      setCourseFee((prevState) => {
        const updatedState = { ...prevState };
        if (isFileType in updatedState.parentDocument) {
          updatedState.parentDocument[isFileType] = fileOrUrl;
        } else if (isFileType in updatedState.siblingDocument) {
          updatedState.siblingDocument[isFileType] = fileOrUrl;
        }
        return updatedState;
      });
    } else if (fileOrUrl instanceof File) {
      // Handle File case
      const blobUrl = URL.createObjectURL(fileOrUrl);
      setNewFiles((prevFiles) => [
        ...prevFiles.filter((f) => f.fileType !== isFileType),
        { file: fileOrUrl, fileType: isFileType, blobUrl },
      ]);

      setCourseFee((prevState) => {
        const updatedState = { ...prevState };
        if (isFileType in updatedState.parentDocument) {
          updatedState.parentDocument[isFileType] = blobUrl;
        } else if (isFileType in updatedState.siblingDocument) {
          updatedState.siblingDocument[isFileType] = blobUrl;
        }
        return updatedState;
      });
    } else {
      console.warn("Unsupported file type or URL format.");
    }
  };
  console.log(
   courseFee
  );

  const deleteFile = (fileUrl, fileType) => {
    if (!fileUrl) return;

    setDeletedFiles((prevFiles) => [...prevFiles, { fileUrl, fileType }]);

    setCourseFee((prevState) => {
      const updatedState = { ...prevState };
      if (fileType in updatedState.parentDocument) {
        updatedState.parentDocument[fileType] = "";
      } else if (fileType in updatedState.siblingDocument) {
        updatedState.siblingDocument[fileType] = "";
      }
      return updatedState;
    });
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      const updatedCourseFee = { ...courseFee };

      await Promise.all(
        newFiles.map(async ({ file, fileType, blobUrl }) => {
          const uniqueFileName = `${uuidv4()}-${file.name}`;
          const storageRef = ref(
            storage,
            `uploads/courseFeeApplication/test${uniqueFileName}`
          );

          try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Replace blob URL with Firebase URL in `updatedCourseFee`
            if (fileType in updatedCourseFee.parentDocument) {
              updatedCourseFee.parentDocument[fileType] = downloadURL;
            } else if (fileType in updatedCourseFee.siblingDocument) {
              updatedCourseFee.siblingDocument[fileType] = downloadURL;
            }

            const uploadData = {
              viewUrl: downloadURL,
              documentName: file.name,
              userId: userId,
            };
            await uploadDocument(uploadData);

            // Update state with Firebase URL
            setCourseFee((prevState) => {
              const newState = { ...prevState };
              if (fileType in newState.parentDocument) {
                newState.parentDocument[fileType] = downloadURL;
              } else if (fileType in newState.siblingDocument) {
                newState.siblingDocument[fileType] = downloadURL;
              }
              return newState;
            });
            setIsSubmitting(false);

          } catch (error) {
            // toast.error(`Error uploading ${file.name}.`);
            setIsSubmitting(false);
          } 
        })
      );

      // Prepare filtered payload
      const filteredParentDocument = Object.fromEntries(
        Object.entries(updatedCourseFee.parentDocument).filter(
          ([, value]) => value.trim() !== ""
        )
      );

      const filteredSiblingDocument = Object.fromEntries(
        Object.entries(updatedCourseFee.siblingDocument).filter(
          ([, value]) => value.trim() !== ""
        )
      );

      const payload = {
        ...filteredParentDocument,
        ...(Object.keys(filteredSiblingDocument).length > 0 && {
        ...filteredSiblingDocument,
        }),
      };

      // If you want to log the payload for debugging
      console.log("Payload:", payload);

      const res = await updateCourseFeeFamilyDoc(appId, payload);

      toast.success(res.message || "Data added successfully.");
      updatedData();
      handleCancelOne();

      // Clear temporary states
      setNewFiles([]);
      setDeletedFiles([]);
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong.");
    }finally {
      setIsSubmitting(false);
    }
  };

  // console.log(courseFee);
  useEffect(() => {
    if (applicationDataById?.courseFeeApplication) {
      setCourseFee((prevState) => ({
        ...prevState,
        parentDocument: {
          fatherAadharCard:
            applicationDataById.courseFeeApplication.parentDocument
              ?.fatherAadharCard || "",
          fatherPanCard:
            applicationDataById.courseFeeApplication.parentDocument
              ?.fatherPanCard || "",
          motherAadharCard:
            applicationDataById.courseFeeApplication.parentDocument
              ?.motherAadharCard || "",
          motherPanCard:
            applicationDataById.courseFeeApplication.parentDocument
              ?.motherPanCard || "",
        },
        siblingDocument: {
          siblingAadharCard:
            applicationDataById.courseFeeApplication.siblingsDocument
              ?.siblingAadharCard || "",
          siblingPanCard:
            applicationDataById.courseFeeApplication.siblingsDocument
              ?.siblingPanCard || "",
        },
      }));
    }
  }, [applicationDataById]);
  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <FaRegIdCard />
            </span>
            <span className="font-semibold text-[22px]">
              Family Documents Upload
            </span>
          </span>
          {/* Pencil icon visible only when the form is hidden */}
          {profileViewPath
            ? ""
            : !isOne && (
                <span
                  className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                  onClick={handleOneToggle}
                  style={{ opacity: !isOne ? 1 : 0 }}
                >
                  <TbPencilMinus />
                </span>
              )}
        </div>
        {console.log(applicationDataById?.courseFeeApplication?.parentDocument)}
        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="flex flex-col">
              {applicationDataById?.courseFeeApplication?.parentDocument
                ?.fatherAadharCard && (
                <>
                  <span className="font-light">Father Aadhar Card</span>
                  <span className="font-medium">
                    {applicationDataById?.courseFeeApplication?.parentDocument
                      ?.fatherAadharCard ? (
                      <a
                        className="flex items-center gap-3 text-primary font-medium"
                        href={
                          applicationDataById?.courseFeeApplication
                            ?.parentDocument?.fatherAadharCard
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
                  </span>
                </>
              )}
              {applicationDataById?.courseFeeApplication?.parentDocument
                ?.motherAadharCard && (
                <>
                  <span className="font-light mt-6">Mother Aadhar Card</span>
                  <span className="font-medium">
                    {applicationDataById?.courseFeeApplication?.parentDocument
                      ?.motherAadharCard ? (
                      <a
                        className="flex items-center gap-3 text-primary font-medium"
                        href={
                          applicationDataById?.courseFeeApplication
                            ?.parentDocument?.motherAadharCard
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
                  </span>
                </>
              )}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="flex flex-col">
              {applicationDataById?.courseFeeApplication?.parentDocument
                ?.fatherPanCard && (
                <>
                  <span className="font-light mt-4">Father Pan Card</span>
                  <span className="font-medium">
                    {applicationDataById?.courseFeeApplication?.parentDocument
                      ?.fatherPanCard ? (
                      <a
                        className="flex items-center gap-3 text-primary font-medium"
                        href={
                          applicationDataById?.courseFeeApplication
                            ?.parentDocument?.fatherPanCard
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
                  </span>
                </>
              )}
              {applicationDataById?.courseFeeApplication?.parentDocument
                ?.motherPanCard && (
                <>
                  <span className="font-light mt-4">Mother Pan Card</span>
                  <span className="font-medium">
                    {applicationDataById?.courseFeeApplication?.parentDocument
                      ?.motherPanCard ? (
                      <a
                        className="flex items-center gap-3 text-primary font-medium"
                        href={
                          applicationDataById?.courseFeeApplication
                            ?.parentDocument?.motherPanCard
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
                  </span>
                </>
              )}
            </span>
          </span>
        </div>

        <div className="flex flex-row items-center w-full justify-between">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="flex flex-col">
              {applicationDataById?.courseFeeApplication?.siblingsDocument
                ?.siblingAadharCard && (
                <>
                  <span className="font-light mt-4">Sibling Aadhar Card</span>
                  <span className="font-medium">
                    {applicationDataById?.courseFeeApplication?.siblingsDocument
                      ?.siblingAadharCard ? (
                      <a
                        className="flex items-center gap-3 text-primary font-medium"
                        href={
                          applicationDataById?.courseFeeApplication
                            ?.siblingsDocument?.siblingAadharCard
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
                  </span>
                </>
              )}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="flex flex-col">
              {applicationDataById?.courseFeeApplication?.siblingsDocument
                ?.siblingPanCard && (
                <>
                  <span className="font-light mt-4">Sibling Pan Card</span>
                  <span className="font-medium">
                    {applicationDataById?.courseFeeApplication?.siblingsDocument
                      ?.siblingPanCard ? (
                      <a
                        className="flex items-center gap-3 text-primary font-medium"
                        href={
                          applicationDataById?.courseFeeApplication
                            ?.siblingsDocument?.siblingPanCard
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
                  </span>
                </>
              )}
            </span>
          </span>
        </div>

        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isOne
              ? "min-h-[100vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {isOne && (
            <>
              <div className="bg-white rounded-xl  py-4  mt-6">
                {/* Radio Options */}
                <div className="mt-4 flex  items-start gap-8">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="documentType"
                      value="parent"
                      checked={selectedOption === "parent"}
                      onChange={handleOptionChange}
                    />
                    <span>Parent Document</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="documentType"
                      value="sibling"
                      checked={selectedOption === "sibling"}
                      onChange={handleOptionChange}
                    />
                    <span> Sibling Documents</span>
                  </div>
                </div>

                {/* Conditional Rendering of Document Upload Fields */}
                {selectedOption === "parent" && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg">
                      Parent Document Upload
                    </h3>
                    {Object.keys(courseFee.parentDocument).map((docType) => (
                      <div
                        key={docType}
                        className="flex flex-col items-center border-2 border-dashed border-body rounded-md py-9 mt-4"
                      >
                        <button
                          onClick={() => handleFilePopupOpen(docType)}
                          className="text-black flex items-center"
                        >
                          <FiUpload className="mr-2 text-primary text-[29px]" />
                        </button>
                        <p className="mt-2">
                          {docType
                            .replace(/([A-Z])/g, " $1")
                            .replace(/^./, (str) => str.toUpperCase())}
                        </p>
                        {courseFee.parentDocument[docType] && (
                          <div className="mt-2 flex items-center">
                            <a
                              href={courseFee.parentDocument[docType]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary"
                            >
                              View Uploaded Document
                            </a>
                            <button
                              onClick={() =>
                                deleteFile(
                                  courseFee.parentDocument[docType],
                                  docType
                                )
                              }
                              className="ml-4 text-red-500"
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {selectedOption === "sibling" && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg">
                      Sibling Document Upload
                    </h3>
                    {Object.keys(courseFee.siblingDocument).map((docType) => (
                      <div
                        key={docType}
                        className="flex flex-col items-center border-2 border-dashed border-body rounded-md py-9 mt-4"
                      >
                        <button
                          onClick={() => handleFilePopupOpen(docType)}
                          className="text-black flex items-center"
                        >
                          <FiUpload className="mr-2 text-primary text-[29px]" />
                        </button>
                        <p className="mt-2">
                          {docType
                            .replace(/([A-Z])/g, " $1")
                            .trim()
                            .replace(/^./, (str) => str.toUpperCase())}
                        </p>
                        {courseFee.siblingDocument[docType] && (
                          <div className="mt-2 flex items-center">
                            <a
                              href={courseFee.siblingDocument[docType]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary"
                            >
                              View Uploaded Document
                            </a>
                            <button
                              onClick={() =>
                                deleteFile(
                                  courseFee.siblingDocument[docType],
                                  docType
                                )
                              }
                              className="ml-4 text-red-500"
                            >
                              <RiDeleteBin6Line />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <OfferLetterPop
          isPopUp={isPopUp}
          docLabel="Upload Documents"
          PopUpClose={() => setIsPopUp(false)}
          handleFileUpload={(files) => handleFileUpload(files, isFileType)}
          errors={errors}
          onSubmit={() => console.log("Form Submitted")}
          resetDoc={resetDoc}
          setResetDoc={setResetDoc}
          studentId={userId}
        />

        {/* Action Buttons */}
        {isOne && (
          <div className="flex justify-end  gap-4">
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
    </>
  );
};

export default CourseFeeFamilyDocUpdate;
