import React, { useState } from "react";
import FileUpload from "../reusable/DragAndDrop";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../utils/fireBase";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { updateDocs } from "../../features/generalApi";
import { v4 as uuidv4 } from "uuid";
import { chngeApplicationStatus } from "../../features/adminApi";
import { useDispatch, useSelector } from "react-redux";
import { visaStatusData } from "../../features/generalSlice";
import { createSprinklesEffect } from "../SprinklesParty";
import socketServiceInstance from "../../services/socket";

const VisaCompleteUpload = ({appId, studId}) => {
    const { studentData } = useSelector((state) => state.general);
  const role = localStorage.getItem('role')
  const { agentData } = useSelector((state) => state.agent);
  const { studentInfoData } = useSelector((state) => state.student);
  const { visaStatus } = useSelector((state) => state.general);
   const dispatch = useDispatch()
  const [visaComplete, setVisaComplete] = useState({
    ppr: "",
    visaStamp: "",
  });
  const [resetppr, setresetPpr] = useState(false);
  const [resetvisaStamp, setresetVisaStamp] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileUpload = async (files, uploadType) => {
    if (!files || files.length === 0) return;

    const file = files[0]; 
    
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `uploads/withdrawal/${uniqueFileName}`);

    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      toast.success(`${file.name} uploaded successfully!`);

      // Update the state based on the upload type
      if (uploadType === "ppr") {
        setVisaComplete((prevData) => ({
          ...prevData,
          ppr: downloadURL, // Set single URL
        }));
      } else if (uploadType === "visaStamp") {
        setVisaComplete((prevData) => ({
          ...prevData,
          visaStamp: downloadURL, // Set single URL
        }));
      }

      console.log("Updated visaComplete:", visaComplete);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Error uploading ${file.name}. Please try again.`);
    }
  };

  //delete image and file from firebase

  const deleteFile = async (fileUrl, uploadType) => {
    if (!fileUrl) return;
  
    const storageRef = ref(storage, fileUrl);
  
    try {
      await deleteObject(storageRef);
      toast.success("File deleted successfully!");
      setresetVisaStamp(true)
      setresetPpr(true)

  
      // Update the state based on the upload type
      setVisaComplete((prevData) => {
        const updatedData = { ...prevData };
  
        // Clear the appropriate field based on upload type
        if (uploadType === "ppr") {
          updatedData.ppr = ""; // Clear ppr
        } else if (uploadType === "visaStamp") {
          updatedData.visaStamp = ""; // Clear visaStamp
        }
  
        // If you need to filter out specific files from an array, do it here
        // Assuming you have an array for certificates or similar:
        if (uploadType === "certificate") {
          updatedData.certificate = updatedData.certificate.filter(cert => cert !== fileUrl);
        }
        setresetVisaStamp(true)
        setresetPpr(true)

        return updatedData;
      });
  
      console.log("Updated visaComplete after delete:", visaComplete);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file. Please try again.");
    }
  };
  
  const validateFields = () => {
    const newErrors = {};

    if (!visaComplete.ppr) {
      newErrors.ppr = "PPR document is required.";
    }
    if (!visaComplete.visaStamp) {
      newErrors.visaStamp = "Visa Stamp document is required.";
    }

    setErrors(newErrors);

    // If there are no errors, return true
    return Object.keys(newErrors).length === 0;
  };
  function startSprinkles() {
    const stopSprinkles = createSprinklesEffect();
  
    // Stop the sprinkles after 10 seconds
    setTimeout(() => {
      stopSprinkles();
    }, 12000);
  }
const handleSubmit = async()=>{
    if (!validateFields()) {
        toast.error("Please upload all required documents before submitting.");
        return; 
      }
  
    try{
    const res = await updateDocs(appId, visaComplete);
    await chngeApplicationStatus(visaStatus?._id, "visagranted", "visa");
    dispatch(visaStatusData(studId));

    toast.success(res.message || "Document Submitted Successfully")
    startSprinkles()

    if (role === "2" ) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: "   AGENT_STUDENT_VISA_STAMP",
            message: `${agentData?.companyDetails?.businessName} ${agentData?.agId} has submitted Visa Stamp and PPR  ${visaStatus?.applicationId} for  ${studentData?.studentInformation?.personalInformation?.firstName} ${studentData?.studentInformation?.personalInformation?.lastName} ${studentData?.studentInformation?.stId}`,
            path: "/student-profile",
            pathData: {
              studentId: studentData?.studentInformation?._id,
            },
            recieverId: "",
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_AGENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (role === "3" ) {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: "    STUDENT_STUDENT_VISA_STAMP",
            message: `${
              studentInfoData?.data?.studentInformation?.personalInformation
                .firstName +
              " " +
              studentInfoData?.data?.studentInformation?.personalInformation
                .lastName
            }  ${
              studentInfoData?.data?.studentInformation?.stId
            }  has submitted the Visa Stamp and PPR ${visaStatus?.applicationId} `,
            path: "/student-profile",
            pathData: {
              studentId: studentInfoData?.data?.studentInformation?._id,
            },

            recieverId: "",
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_STUDENT_TO_ADMIN",
            notificationData
          )
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
    }catch(error){
        console.log(error)
        toast.error(error.message || "Error while submitting")
    }
}

  return (
    <>
      <div className="bg-white rounded-xl w-full py-4 pb-12 -mt-4 mb-7">
        <FileUpload
          label="Upload PPR"
          acceptedFormats={{
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
            "application/msword": [".doc"],
          }}
          reset={resetppr}
          setReset={setresetPpr}
          onFilesUploaded={(files) => handleFileUpload(files, "ppr")}
          customClass="border-dashed"
          value={visaComplete.ppr}
        />
        {errors.ppr && (
          <p className="text-red-500 mt-1 text-sm">{errors.ppr}</p>
        )}
        {visaComplete.ppr && (
          <div className="mt-4">
            <p className="text-secondary font-semibold">Uploaded Document:</p>
            <div className="flex items-center mt-2">
              <a
                href={visaComplete.ppr}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary rounded-sm px-6 py-2 border border-greyish"
              >
                Uploaded PPR
              </a>
              <button
                onClick={() => deleteFile(visaComplete.ppr, "ppr")}
                className="ml-4 text-red-500 text-[21px]"
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          </div>
        )}

        <FileUpload
          label="Upload Visa Stamp"
          acceptedFormats={{
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
              [".docx"],
            "application/msword": [".doc"],
          }}
          reset={resetvisaStamp}
          setReset={setresetVisaStamp}
          onFilesUploaded={(files) => handleFileUpload(files, "visaStamp")}
          customClass="border-dashed"
          value={visaComplete.visaStamp}
        />
        {errors.visaStamp && (
          <p className="text-red-500 mt-1 text-sm">{errors.visaStamp}</p>
        )}
        {visaComplete.visaStamp && (
          <div className="mt-4">
            <p className="text-secondary font-semibold">Uploaded Document:</p>
            <div className="flex items-center mt-2">
              <a
                href={visaComplete.visaStamp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary rounded-sm px-6 py-2 border border-greyish "
              >
                Uploaded Visa Stamp
              </a>
              <button
                onClick={() => deleteFile(visaComplete.visaStamp, "visaStamp")}
                className="ml-4 text-red-500 text-[21px]"
              >
                <RiDeleteBin6Line />
              </button>
            </div>
          </div>
        )}
      </div>
      <div onClick={handleSubmit} className="bg-primary cursor-pointer rounded-md text-white px-6 py-2">Submit</div>
    </>
  );
};

export default VisaCompleteUpload;
