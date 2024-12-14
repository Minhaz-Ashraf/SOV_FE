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
  updateCourseFeeDoc,
  updateCourseFeeStudentDoc,
  updateVisaDocument,
  uploadDocument,
} from "../../../features/generalApi";
import { toast } from "react-toastify";
const initialofferLetterAnsPassport = {
  offerLetter: "",
  passport: "",
};
import { v4 as uuidv4 } from "uuid";

const CourseFeeDocUpdate = ({
  appId,
  updatedData,
  profileViewPath,
  userId,
}) => {
  const { applicationDataById } = useSelector((state) => state.agent);
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isOne, setIsOne] = useState(false);
  const [courseFee, setCourseFee] = useState({
    offerLetterAnsPassport: { ...initialofferLetterAnsPassport },
  });
  const dispatch = useDispatch();

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

  const handleOneToggle = () => {
    setIsOne((prev) => !prev); // Toggle the form visibility
  };

  const handleCancelOne = () => {
    setIsOne(false);
  };

  const validateFields = () => {
    const errors = {};
    const { offerLetterAnsPassport } = courseFee;

    Object.keys(initialofferLetterAnsPassport).forEach((docType) => {
      if (!offerLetterAnsPassport[docType]) {
        errors[docType] = `${docType.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });

    return errors;
  };

  const handleFileUpload = (files) => {
    if (!files || files.length === 0 || !isFileType) {
      // toast.error("File type or file is missing.");
      return;
    }

    const fileOrUrl = files[0];

    if (fileOrUrl instanceof File) {
      // Handle File objects
      const blobUrl = URL.createObjectURL(fileOrUrl);

      setNewFiles((prevFiles) => [
        ...prevFiles.filter((f) => f.fileType !== isFileType),
        { file: fileOrUrl, fileType: isFileType, blobUrl },
      ]);

      // Update state with blob URL for preview
      setCourseFee((prevState) => ({
        ...prevState,
        offerLetterAnsPassport: {
          ...prevState.offerLetterAnsPassport,
          [isFileType]: blobUrl, // Set blob URL temporarily
        },
      }));

      toast.success(`${fileOrUrl.name} has been selected.`);
    } else if (typeof fileOrUrl === "string") {
      // Handle URL strings: directly set in the courseFee state
      setCourseFee((prevState) => ({
        ...prevState,
        offerLetterAnsPassport: {
          ...prevState.offerLetterAnsPassport,
          [isFileType]: fileOrUrl, // Set the URL directly
        },
      }));

      toast.success("Document URL has been set.");
    }
  };

  const deleteFile = async (fileUrl, fileType) => {
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
      offerLetterAnsPassport: {
        ...prevState.offerLetterAnsPassport,
        [fileType]: "", // Clear file locally
      },
    }));

    setNewFiles((prevFiles) =>
      prevFiles.filter((file) => file.fileType !== fileType)
    );

    // toast.info("File marked for deletion.");
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields");
      return;
    }

    try {
      // Handle deletions
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

      // Upload new files and replace blob URLs with Firebase URLs
      const updatedOfferLetterAnsPassport = {
        ...courseFee.offerLetterAnsPassport,
      };

      await Promise.all(
        newFiles.map(async ({ file, fileType, blobUrl }) => {
          // console.log( file, fileType, blobUrl )
          const uniqueFileName = `${uuidv4()}-${file.name}`;
          const storageRef = ref(
            storage,
            `uploads/courseFeeApplication/${uniqueFileName}`
          );

          try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            updatedOfferLetterAnsPassport[fileType] = downloadURL;
            const uploadData = {
              viewUrl: downloadURL,
              documentName: file.name,
              userId: userId,
            };
            await uploadDocument(uploadData);
            setCourseFee((prevState) => ({
              ...prevState,
              offerLetterAnsPassport: updatedOfferLetterAnsPassport
            }));

          
          } catch (error) {
            // toast.error(`Error uploading ${file.name}.`);
          }
        })
      );
   
      // const payload = {
      //   passport: courseFee.offerLetterAnsPassport.passport,
      //   offerLetter: courseFee.offerLetterAnsPassport.offerLetter,
      // };
      const res = await updateCourseFeeDoc(appId, updatedOfferLetterAnsPassport);

      toast.success(res.message || "Data added successfully.");
      updatedData();
      setNewFiles([]);
      setDeletedFiles([]);
      handleCancelOne();
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong.");
    }
  };
  useEffect(() => {
    if (applicationDataById) {
      setCourseFee((prevState) => ({
        ...prevState,
        offerLetterAnsPassport: {
          offerLetter:
            applicationDataById?.courseFeeApplication?.offerLetterAnsPassport
              ?.offerLetter || "",
          passport:
            applicationDataById?.courseFeeApplication?.offerLetterAnsPassport
              ?.passport || "",
        },
      }));
    }
  }, [applicationDataById]);
  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins mb-20">
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
            <span className="font-light">Offer Letter</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.offerLetterAnsPassport
                ?.offerLetter ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={
                    applicationDataById?.courseFeeApplication
                      ?.offerLetterAnsPassport?.offerLetter
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
            <span className="font-light mt-4">Passport</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.offerLetterAnsPassport
                ?.passport ? (
                <a
                  className="flex items-center gap-3 text-primary font-medium"
                  href={
                    applicationDataById?.courseFeeApplication
                      ?.offerLetterAnsPassport?.passport
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
                <p className="text-[15px] mt-3 text-body">OfferLetter</p>
                <div className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-9 mb-4">
                  <button
                    className="text-black flex items-center"
                    onClick={() => handleFilePopupOpen("offerLetter")}
                  >
                    <FiUpload className="mr-2 text-primary text-[29px]" />
                  </button>
                  <p>Upload Offer Letter</p>
                </div>
                {courseFee.offerLetterAnsPassport?.offerLetter &&
                  typeof courseFee.offerLetterAnsPassport.offerLetter ===
                    "string" 
                 
                   && (
                    <div className="mt-4">
                      <p className="text-secondary font-semibold">
                        Uploaded Document:
                      </p>
                      <ul>
                        <li className="flex items-center mt-2">
                          <a
                            href={courseFee.offerLetterAnsPassport.offerLetter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary rounded-sm px-6 py-2 border border-greyish"
                          >
                            Uploaded Document
                          </a>
                          <button
                            onClick={() =>
                              deleteFile(
                                courseFee.offerLetterAnsPassport.offerLetter,
                                "offerLetter"
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
                <p className="text-[15px] mt-3 text-body">Passport</p>
                <div className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-9 mb-4">
                  <button
                    className="text-black flex items-center"
                    onClick={() => handleFilePopupOpen("passport")}
                  >
                    <FiUpload className="mr-2 text-primary text-[29px]" />
                  </button>
                  <p>Upload Passport</p>
                </div>

                {courseFee.offerLetterAnsPassport?.passport &&
                  typeof courseFee.offerLetterAnsPassport.passport ===
                    "string" &&
                  (
                    <div className="mt-4">
                      <p className="text-secondary font-semibold">
                        Uploaded Document:
                      </p>
                      <ul>
                        <li className="flex items-center mt-2">
                          <a
                            href={courseFee.offerLetterAnsPassport.passport}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary rounded-sm px-6 py-2 border border-greyish"
                          >
                            Uploaded Document
                          </a>
                          <button
                            onClick={() =>
                              deleteFile(
                                courseFee.offerLetterAnsPassport.passport,
                                "passport"
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
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseFeeDocUpdate;
