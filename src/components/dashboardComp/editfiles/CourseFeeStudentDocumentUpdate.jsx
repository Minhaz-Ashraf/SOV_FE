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
  updateCourseFeeStudentDoc,
  updateVisaDocument,
  uploadDocument,
} from "../../../features/generalApi";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

const initialStudentDocument = {
  aadharCard: "",
  panCard: "",
};

const CourseFeeStudentDocumentUpdate = ({
  appId,
  updatedData,
  profileViewPath,
  userId,
}) => {
  const { applicationDataById } = useSelector((state) => state.agent);
  const [isOne, setIsOne] = useState(false);
  const [courseFee, setCourseFee] = useState({
    studentDocument: { ...initialStudentDocument },
  });
  const [resetDoc, setResetDoc] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const dispatch = useDispatch();
  const [isPopUp, setIsPopUp] = useState(false);
  const [errors, setErrors] = useState({});
  const [isFileType, setFileType] = useState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(allApplication());
  }, [dispatch]);

  const handleFilePopupOpen = (fileType) => {
    setFileType(fileType);
    setIsPopUp(true);
  };
  const handleOneToggle = () => {
    setIsOne((prev) => !prev);
  };

  const handleCancelOne = () => {
    setIsOne(false);
  };
  const validateFields = () => {
    const errors = {};
    const { studentDocument } = courseFee;

    Object.keys(initialStudentDocument).forEach((docType) => {
      if (!studentDocument[docType]) {
        errors[docType] = `${docType.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    return errors;
  };

  const handleFileUpload = (files) => {
    console.log(files);
    if (!files || files.length === 0) return;

    const fileOrUrl = files[0]; // Either a File object or a URL string

    if (fileOrUrl instanceof File) {
      // Handle File objects
      const blobUrl = URL.createObjectURL(fileOrUrl);

      setNewFiles((prevFiles) => [
        ...prevFiles.filter((f) => f.fileType !== isFileType),
        { file: fileOrUrl, fileType: isFileType, blobUrl },
      ]);

      setCourseFee((prevState) => ({
        ...prevState,
        studentDocument: {
          ...prevState.studentDocument,
          [isFileType]: blobUrl,
        },
      }));

      // toast.success(`${fileOrUrl.name} has been selected.`);
    } else if (typeof fileOrUrl === "string") {
      // Handle URL strings: directly set in the courseFee state
      setCourseFee((prevState) => ({
        ...prevState,
        studentDocument: {
          ...prevState.studentDocument,
          [isFileType]: fileOrUrl,
        },
      }));

      // toast.success("Document URL has been set.");
    }
  };

  const deleteFile = async (fileUrl, fileType) => {
    // console.log("Attempting to delete fileType:", fileType);
    // console.log("File URL:", fileUrl);

    if (!fileUrl) return;

    const fileUrls = Array.isArray(fileUrl) ? fileUrl : [fileUrl];

    fileUrls.forEach((url) => {
      if (typeof url === "string" && url.startsWith("http")) {
        setDeletedFiles((prevFiles) => [
          ...prevFiles.filter((f) => f.fileType !== fileType),
          { fileUrl: url, fileType },
        ]);
      }
    });

    setCourseFee((prevState) => ({
      ...prevState,
      studentDocument: {
        ...prevState.studentDocument,
        [fileType]: "",
      },
    }));

    setNewFiles((prevFiles) =>
      prevFiles.filter((file) => file.fileType !== fileType)
    );

    console.log("File successfully marked for deletion.");
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill al required fields");
      return;
    }

    try {
      setIsSubmitting(true);

      // Delete files marked for deletion
      // for (const { fileUrl } of deletedFiles) {
      //   const storageRef = ref(storage, fileUrl);
      //   try {
      //     //       await deleteObject(storageRef);
      //     // await deleteDocument(fileUrl)
      //     // toast.success(`File ${fileUrl} deleted successfully.`);
      //   } catch (error) {
      //     // toast.error(`Error deleting file: ${fileUrl}`);
      //   }
      // }

      // Prepare to update `studentDocument` with Firebase URLs
      const updatedStudentDocument = { ...courseFee.studentDocument };

      // Upload new files and replace blob URLs with Firebase URLs
      for (const { file, fileType, blobUrl } of newFiles) {
        const uniqueFileName = `${uuidv4()}-${file.name}`;
        const storageRef = ref(
          storage,
          `uploads/courseFeeApplication/test${uniqueFileName}`
        );

        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          // Replace blob URL with Firebase URL in `updatedStudentDocument`
          updatedStudentDocument[fileType] = downloadURL;
          const uploadData = {
            viewUrl: downloadURL,
            documentName: file.name,
            userId: userId,
          };
          await uploadDocument(uploadData);
          // Update the state with Firebase URL
          setCourseFee((prevState) => ({
            ...prevState,
            studentDocument: updatedStudentDocument
          }));

          // toast.success(`${file.name} uploaded successfully.`);
        } catch (error) {
          // toast.error(`Error uploading ${file.name}.`);
        }
      }

      // Submit the updated `studentDocument` to the backend
      const payload = {
        ...courseFee,
        studentDocument: updatedStudentDocument,
      };
      const res = await updateCourseFeeStudentDoc(appId, payload);

      toast.success(res.message || "Data added successfully.");
      updatedData();
      handleCancelOne();

      // Clear temporary states
      setNewFiles([]);
      setDeletedFiles([]);
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong.");
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (applicationDataById) {
      setCourseFee((prevState) => ({
        ...prevState,
        studentDocument: {
          aadharCard:
            applicationDataById?.courseFeeApplication?.studentDocument
              ?.aadharCard || "",
          panCard:
            applicationDataById?.courseFeeApplication?.studentDocument
              ?.panCard || "",
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
              Student Documents Upload
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

        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Aadhar Card</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.studentDocument
                ?.aadharCard ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={
                    applicationDataById?.courseFeeApplication?.studentDocument
                      ?.aadharCard
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
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Pan Card</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.studentDocument
                ?.panCard ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={
                    applicationDataById?.courseFeeApplication?.studentDocument
                      ?.panCard
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
              <div className="bg-white rounded-xl  py-4 pb-12 mt-6">
                <p className="text-[15px] mt-3 text-body">Aadhar Card</p>
                <div className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-9 mb-4">
                  <button
                    className="text-black flex items-center"
                    onClick={() => handleFilePopupOpen("aadharCard")}
                  >
                    <FiUpload className="mr-2 text-primary text-[29px]" />
                  </button>
                  <p>Upload Aadhar Card</p>
                </div>
                {courseFee.studentDocument?.aadharCard &&
                  typeof courseFee.studentDocument.aadharCard === "string" && (
                    <div className="mt-4">
                      <p className="text-secondary font-semibold">
                        Uploaded Document:
                      </p>
                      <ul>
                        <li className="flex items-center mt-2">
                          <a
                            href={courseFee.studentDocument.aadharCard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary rounded-sm px-6 py-2 border border-greyish"
                          >
                            Uploaded Document
                          </a>
                          <button
                            onClick={() =>
                              deleteFile(
                                courseFee.studentDocument.aadharCard,
                                "aadharCard"
                              )
                            }
                            className="ml-4 text-red-500"
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}

                <p className="text-[15px] mt-3 text-body">Pan Card</p>
                <div className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-9 mb-4">
                  <button
                    className="text-black flex items-center"
                    onClick={() => handleFilePopupOpen("panCard")}
                  >
                    <FiUpload className="mr-2 text-primary text-[29px]" />
                  </button>
                  <p>Upload Pan Card</p>
                </div>
                {courseFee.studentDocument?.panCard &&
                  typeof courseFee.studentDocument.panCard === "string" && (
                    <div className="mt-4">
                      <p className="text-secondary font-semibold">
                        Uploaded Document:
                      </p>
                      <ul>
                        <li className="flex items-center mt-2">
                          <a
                            href={courseFee.studentDocument.panCard}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary rounded-sm px-6 py-2 border border-greyish"
                          >
                            Uploaded Document
                          </a>
                          <button
                            onClick={() =>
                              deleteFile(
                                courseFee.studentDocument.panCard,
                                "panCard"
                              )
                            }
                            className="ml-4 text-red-500"
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </li>
                      </ul>
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
          handleFileUpload={handleFileUpload}
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
              {isSubmitting ? "Submitting..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseFeeStudentDocumentUpdate;
