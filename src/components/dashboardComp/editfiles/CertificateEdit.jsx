import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import { storage } from "../../../utils/fireBase";
import { toast } from "react-toastify";
import OfferLetterPop from "../OfferLetterPop";
import { FiUpload } from "react-icons/fi";
import { TbPencilMinus } from "react-icons/tb";
import { FaFileUpload, FaRegEye } from "react-icons/fa";
import { deleteDocument, OfferLetterCertificate, uploadDocument } from "../../../features/generalApi";
import { useSelector } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";

const CertificateEdit = ({ appId, updatedData, profileViewPath, userId }) => {

  const [offerLater, setOfferLater] = useState({
    certificate: { url: [] },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPopUp, setIsPopUp] = useState(false);
  const [isFileType, seFileType] = useState();
  const [errors, setErrors] = useState({});
  const [isOne, setIsOne] = useState(false);
  const [resetDoc, setResetDoc] = useState(false);
  const [newFiles, setNewFiles] = useState([]); // For new files to be uploaded
  const [deletedFiles, setDeletedFiles] = useState([]); // For files marked for deletion
  const { applicationDataById } = useSelector((state) => state.agent);

  const PopUpOpen = () => setIsPopUp(true);
  const PopUpClose = () => setIsPopUp(false);
  const handleOneToggle = () => setIsOne((prev) => !prev);
  const handleCancelOne = () => setIsOne(false);
  const validateFields = () => {
    const errors = {};
  
    // Check if there are any files in the certificate URL list
    if (!offerLater.certificate.url.length) {
      errors.certificate = "At least one certificate file is required.";
    }
  
    // Return the errors object
    return errors;
  };
  const handleFilePopupOpen = (fileType) => {
    seFileType(fileType);
    PopUpOpen();
  };
  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;
  
    // Filter files to ensure no duplicates or deleted files are re-added
    const uniqueFiles = files.filter((file) => {
      const fileName = file.name || file.split('/').pop(); // Handle file objects or URLs
      return (
        !newFiles.some((existingFile) => existingFile.name === fileName) &&
        !deletedFiles.some((deletedFileUrl) => deletedFileUrl.includes(fileName))
      );
    });
  
    if (uniqueFiles.length === 0) {
      toast.warn("Duplicate or previously deleted files are not allowed.");
      return;
    }
  
    // Check if the input contains URLs or File objects
    const isFileObjects = uniqueFiles[0] instanceof File;
  
    if (isFileObjects) {
      // Handle File objects
      setNewFiles((prevState) => [...prevState, ...uniqueFiles]);
  
      // Temporarily set blob URLs for preview
      const blobUrls = uniqueFiles.map((file) => URL.createObjectURL(file));
      setOfferLater((prevData) => ({
        ...prevData,
        certificate: {
          url: [...prevData.certificate.url, ...blobUrls], // Append blob URLs
        },
      }));
    } else {
      // Handle URLs directly
      setOfferLater((prevData) => ({
        ...prevData,
        certificate: {
          url: [...prevData.certificate.url, ...uniqueFiles], // Append URLs
        },
      }));
    }
  
  
  };
  
  
  const deleteFile = async(fileUrl) => {
    if (!fileUrl) return;

    const isFirebaseUrl = fileUrl.startsWith("http");
  
    if (isFirebaseUrl) {
      // Add Firebase URL to deletedFiles for server-side deletion
      setDeletedFiles((prevState) => [...prevState, fileUrl]);
    }
  
    // Remove the URL from state (blob or Firebase)
    setOfferLater((prevData) => ({
      ...prevData,
      certificate: {
        url: prevData.certificate.url.filter((url) => url !== fileUrl),
      },
    }));
  
    // Remove blob URL from newFiles array
    setNewFiles((prevState) =>
      prevState.filter((file) => !fileUrl.includes(file.name))
    );
  
    // toast.info("File has been marked for deletion.");
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
  
      // Step 1: Delete files marked for deletion
    //   for (const fileUrl of deletedFiles) {
    //     const storageRef = ref(storage, fileUrl);
    //     try {
    //       await deleteObject(storageRef);
    // await deleteDocument(fileUrl)

    //       // toast.success(`File ${fileUrl} deleted successfully.`);
    //     } catch (error) {
    //       // toast.error(`Error deleting file: ${fileUrl}`);
    //     }
    //   }
  
      // Step 2: Upload new files if any
      let uploadedUrls = [];
      if (newFiles.length > 0) {
        for (const file of newFiles) {
          const storageRef = ref(storage, `uploads/offerLetter/${file.name}`);
          try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            uploadedUrls.push(downloadURL);
            const uploadData = { viewUrl: downloadURL, documentName: file.name, userId:userId };
            await uploadDocument(uploadData);
            // Replace blob URLs with Firebase URLs in state
            setOfferLater((prevData) => ({
              ...prevData,
              certificate: {
                url: prevData.certificate.url.map((url) =>
                  url.startsWith("blob:") ? downloadURL : url
                ),
              },
            }));
          } catch (error) {
            // toast.error(`Error uploading ${file.name}.`);
          }
        }
      }
  
      // Step 3: Prepare updated URLs
      const updatedUrls = [
        ...offerLater.certificate.url.filter((url) => !url.startsWith("blob:")), // Retain Firebase URLs
        ...uploadedUrls, // Add newly uploaded Firebase URLs
      ];
  
      setOfferLater((prevData) => ({
        ...prevData,
        certificate: { url: updatedUrls },
      }));
  
      // Step 4: Prepare payload
      const payload = { certificates: updatedUrls };
      const section = "offerLetter";
  
      const res = await OfferLetterCertificate(appId, payload, section);
      toast.success("Data added successfully.");
  
      updatedData();
  
      // Step 5: Clear temporary states
      setDeletedFiles([]);
      setNewFiles([]);
      setIsSubmitting(false);
      handleCancelOne();
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong.");
    }
  };
  
  useEffect(() => {
    if (applicationDataById) {
      setOfferLater({
        certificate: {
          url: applicationDataById?.offerLetter?.certificate?.url || [],
        },
      });
    }
  }, [applicationDataById]);
  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins mb-20 ">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <FaFileUpload />
            </span>
            <span className="font-semibold text-[22px]">
              Certificate Details
            </span>
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
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">IELTS/PTE/TOEFL/Certificate*</span>
            <span className="font-medium mt-2">
            {applicationDataById?.offerLetter?.certificate?.url?.length > 0 ? (
  applicationDataById.offerLetter.certificate.url.map((url, index) => (
    <a
      key={index} // Always add a key when mapping over an array
      className="flex items-center gap-3 text-primary font-medium"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
    >
      Uploaded Document {index + 1}
      <span>
        <FaRegEye />
      </span>
    </a>
  ))
) : (
  <span>NA</span>
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
          <div className="bg-white rounded-xl  py-4 pb-12 mt-6">
            <div className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-9 mb-4">
              <button
                className="text-black flex items-center"
                onClick={() => handleFilePopupOpen("certificate")}
              >
                <FiUpload className="mr-2 text-primary text-[29px]" />
              </button>
              <p>Upload Certificates</p>
            </div>

            {Array.isArray(offerLater.certificate.url) && offerLater.certificate.url.length > 0 && (
  <div className="mt-4">
    <p className="text-secondary font-semibold">Uploaded Documents:</p>
    <ul>
      {offerLater.certificate.url
        .filter(
          (url) => typeof url === "string" && (url.startsWith("http") || url.startsWith("blob:")) // Include blob URLs
        )
        .map((url, index) => (
          <li key={index} className="flex items-center mt-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary rounded-sm px-6 py-2 border border-greyish"
            >
              Uploaded Document
            </a>
            <button
              onClick={() => deleteFile(url, "certificate")}
              className="ml-4 text-red-500 text-[21px]"
            >
              <RiDeleteBin6Line />
            </button>
          </li>
        ))}
    </ul>
  </div>
)}

          </div>

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
        <OfferLetterPop
          isPopUp={isPopUp}
          docLabel="Upload Marksheet"
          resetDoc={resetDoc}
          PopUpClose={PopUpClose}
          setResetDoc={setResetDoc}
          handleFileUpload={(files) => handleFileUpload(files, isFileType)}
          // handleDeleteFile={(fileUrl) => deleteFile(fileUrl, isFileType)}
          errors={errors}
          studentId={userId}
          onSubmit={() => {
            console.log("Form Submitted");
          }}
        />
      </div>
    </>
  );
};

export default CertificateEdit;
