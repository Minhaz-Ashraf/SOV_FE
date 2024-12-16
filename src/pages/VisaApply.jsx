import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { useLocation } from "react-router-dom";
import Register from "../components/reusable/Register";
import PhoneInputComponent from "../components/reusable/PhoneInputComponent";
import { CountrySelect } from "../components/reusable/Input";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../utils/fireBase";
import OfferLetterPop from "../components/dashboardComp/OfferLetterPop";
import { FiUpload } from "react-icons/fi";
import { studentById, getInstituteOption } from "../features/generalSlice";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import PopUp from "../components/reusable/PopUp";
import { greenTick } from "../assets";
import { RiDeleteBin6Line } from "react-icons/ri";
import Sidebar from "../components/dashboardComp/Sidebar";
import {
  deleteDocument,
  uploadDocument,
  visaAdd,
} from "../features/generalApi";
import socketServiceInstance from "../services/socket";
import { v4 as uuidv4 } from "uuid";
import { createSprinklesEffect } from "../components/SprinklesParty";

// Initial states
const initialPersonalInfo = {
  fullName: "",
  email: "",
  phoneNumber: "",
  address: {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  },
};

const initialStudentDocument = {
  loa: "",
  offerLetter: "",
  gicLetter: "",
  medical: "",
  pcc: "",
  pal: "",
  certificate: "",
};

const VisaApply = () => {
  const role = localStorage.getItem("role");
  const [newFiles, setNewFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const { agentData } = useSelector((state) => state.agent);
  const studentUserId = useSelector((state) => state.student.studentInfoData);
  const location = useLocation();
  console.log(location);

  const studentId =
    role === "3"
      ? studentUserId?.data?.studentInformation?._id
      : location?.state?.id || location?.state?.state;
  const { countryOption, studentData } = useSelector((state) => state.general);
  const { studentInfoData } = useSelector((state) => state.student);
  const StudentDataToGet = role === "2" ? studentData : studentInfoData?.data;
  const [resetDoc, setResetDoc] = useState(false);
  const dispatch = useDispatch();
  const [isPopUp, setIsPopUp] = useState(false);
  const [isConfirmPopUp, setIsConfirmPopUp] = useState(false);
  const [visaLetter, setVisaLetter] = useState({
    personalDetails: { ...initialPersonalInfo },
    studentDocument: { ...initialStudentDocument },
  });
  const [errors, setErrors] = useState({});
  const [isFileType, setFileType] = useState();
  const { preferredCountry: countryName, state: studentFullId } =
    location?.state;

  useEffect(() => {
    if (studentId) dispatch(studentById(studentId));
  }, [dispatch, studentId]);

  useEffect(() => {
    if (visaLetter.personalDetails.address?.country) {
      dispatch(getInstituteOption(visaLetter.personalDetails.address.country));
    }
  }, [dispatch, visaLetter.personalDetails.address.country]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setVisaLetter((prevState) => {
      let tempState = { ...prevState };
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) acc[key] = value;
        return acc[key];
      }, tempState);
      return tempState;
    });
  };

  const handlePhoneChange = (phoneNumber) => {
    setVisaLetter((prevState) => ({
      ...prevState,
      personalDetails: {
        ...prevState.personalDetails,
        phoneNumber: phoneNumber.number,
      },
    }));
  };

  const validateFields = () => {
    const errors = {};
    const { personalDetails, studentDocument } = visaLetter;
  
    // Personal Details Validation
    if (!personalDetails.fullName?.trim()) {
      errors.fullName = "Full name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(personalDetails.fullName)) {
      errors.fullName = "Full name can only contain alphabets and spaces.";
    }
  
    if (!personalDetails.email) {
      errors.email = "Email is required.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(personalDetails.email)) {
      errors.email = "Invalid email format.";
    }
  
    if (!personalDetails.phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    }
  
    // Address Validation
    if (!personalDetails.address.street?.trim()) {
      errors.street = "Street address is required.";
    }
    if (!personalDetails.address.city?.trim()) {
      errors.city = "City is required.";
    }
    if (!personalDetails.address.state?.trim()) {
      errors.state = "State is required.";
    }
    if (!personalDetails.address.postalCode?.trim()) {
      errors.postalCode = "Postal Code is required.";
    } else if (!/^\d{5,6}$/.test(personalDetails.address.postalCode)) {
      errors.postalCode = "Postal Code must be 5-6 digits.";
    }
    if (!personalDetails.address.country?.trim()) {
      errors.country = "Country is required.";
    }
  
    // Student Document Validation
    Object.keys(initialStudentDocument).forEach((docType) => {
      // Skip 'pal' validation unless the country is Germany
      if (docType === "pal") {
        if (countryName === "Germany" && !studentDocument[docType]) {
          errors[docType] = `${docType.replace(/([A-Z])/g, " $1")} is required.`;
        }
      } else if (!studentDocument[docType]) {
        errors[docType] = `${docType.replace(/([A-Z])/g, " $1")} is required.`;
      }
    });
  
    return errors;
  };
  
  const handleFilePopupOpen = (fileType) => {
    setFileType(fileType);
    setIsPopUp(true);
  };

  // const handleFileUpload = async (filesOrUrls) => {
  //   if (!filesOrUrls || filesOrUrls.length === 0) return;

  //   let uploadedUrls = [];

  //   // Separate string URLs from files
  //   const stringUrls = filesOrUrls.filter((item) => typeof item === "string");
  //   const fileObjects = filesOrUrls.filter((item) => item instanceof File);

  //   // Add string URLs directly
  //   if (stringUrls.length > 0) {
  //     uploadedUrls.push(...stringUrls);
  //   }

  //   // Upload file objects to Firebase
  //   for (const file of fileObjects) {
  //     const uniqueFileName = `${uuidv4()}-${file.name}`;
  //     const storageRef = ref(storage, `uploads/visa/${uniqueFileName}`);
  //     try {
  //       const snapshot = await uploadBytes(storageRef, file);
  //       const downloadURL = await getDownloadURL(snapshot.ref);
  //       uploadedUrls.push(downloadURL);
  //       const uploadData = { viewUrl: downloadURL, documentName: file.name, userId: studentId };
  //       await uploadDocument(uploadData);
  //       toast.success(`${file.name} uploaded successfully!`);
  //     } catch (error) {
  //       toast.error(`Error uploading ${file.name}. Please try again.`);
  //     }
  //   }

  //   // Update the state dynamically
  //   if (uploadedUrls.length > 0) {
  //     setVisaLetter((prevState) => ({
  //       ...prevState,
  //       studentDocument: {
  //         ...prevState.studentDocument,
  //         [isFileType]: uploadedUrls[0], // Set the first uploaded URL under the document type key
  //       },
  //     }));
  //   }
  // };

  const handleFileUpload = (files) => {
    if (!files || files.length === 0 || !isFileType) return;

    const fileOrUrl = files[0];

    if (fileOrUrl instanceof File) {
      // Handle File objects
      const blobUrl = URL.createObjectURL(fileOrUrl);

      setNewFiles((prevFiles) => [
        ...prevFiles.filter((f) => f.fileType !== isFileType),
        { file: fileOrUrl, fileType: isFileType, blobUrl },
      ]);

      // Update state with blob URL for preview
      setVisaLetter((prevState) => ({
        ...prevState,
        studentDocument: {
          ...prevState.studentDocument,
          [isFileType]: blobUrl, // Set blob URL temporarily
        },
      }));

      // toast.success(`${fileOrUrl.name} has been selected.`);
    } else if (typeof fileOrUrl === "string") {
      // Handle URL strings: directly set in the VisaLetter state
      setVisaLetter((prevState) => ({
        ...prevState,
        studentDocument: {
          ...prevState.studentDocument,
          [isFileType]: fileOrUrl, // Set the URL directly
        },
      }));

      // toast.success("Document URL has been set.");
    }
  };

  const deleteFile = async (fileType) => {
    const fileUrl = visaLetter.studentDocument[fileType];
    if (!fileUrl) return;
    // await deleteDocument(fileUrl);

    const fileUrls = Array.isArray(fileUrl) ? fileUrl : [fileUrl];

    fileUrls.forEach((url) => {
      if (typeof url === "string" && url.startsWith("http")) {
        setDeletedFiles((prevFiles) => [
          ...prevFiles.filter((f) => f.fileType !== fileType),
          { fileUrl: url, fileType },
        ]);
      }
    });

    setVisaLetter((prevState) => ({
      ...prevState,
      studentDocument: {
        ...prevState.studentDocument,
        [fileType]: "",
      },
    }));

    setNewFiles((prevFiles) =>
      prevFiles.filter((file) => file.fileType !== fileType)
    );

    // toast.info("File marked for deletion.");
  };

   function startSprinkles() {
      const stopSprinkles = createSprinklesEffect();
    
      // Stop the sprinkles after 10 seconds
      setTimeout(() => {
        stopSprinkles();
      }, 12000);
    }
  const handleSubmit = async () => {
    const validationErrors = validateFields();
  
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill all required fields");
      return;
    }
  
    try {
      setIsSubmitting(true);
  
      // Initialize `certificate` as an array of strings
      const certificateArray = Array.isArray(visaLetter.studentDocument.certificate)
        ? visaLetter.studentDocument.certificate
        : visaLetter.studentDocument.certificate
        ? [visaLetter.studentDocument.certificate] // Convert string to array
        : [];
  
      const updatedStudentDocument = {
        country: countryName,
        studentInformationId: studentId,
        personalDetails: {
          ...visaLetter.personalDetails,
        },
        offerLetter: visaLetter.studentDocument.offerLetter,
        gicLetter: visaLetter.studentDocument.gicLetter,
        medical: visaLetter.studentDocument.medical,
        pcc: visaLetter.studentDocument.pcc,
        pal: visaLetter.studentDocument.pal,
        loa: visaLetter.studentDocument.loa,
        certificate: certificateArray, // Ensure it's always an array
      };
  
      // Handle new file uploads
      for (const { file, fileType, blobUrl } of newFiles) {
        const uniqueFileName = `${uuidv4()}-${file.name}`;
        const storageRef = ref(storage, `uploads/visa/${uniqueFileName}`);
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
  
          if (fileType === "certificate") {
            // Add the new URL to the certificate array
            updatedStudentDocument.certificate = [
              ...updatedStudentDocument.certificate,
              downloadURL,
            ];
          } else {
            // Replace the blob URL with the Firebase URL for non-certificate fields
            updatedStudentDocument[fileType] = downloadURL;
          }
  
          const uploadData = {
            viewUrl: downloadURL,
            documentName: file.name,
            userId: studentId,
          };
          await uploadDocument(uploadData);
  
          // Update state for dynamic updates
          setVisaLetter((prevState) => ({
            ...prevState,
            studentDocument: {
              ...prevState.studentDocument,
              [fileType]: fileType === "certificate"
                ? [...(prevState.studentDocument.certificate || []), downloadURL]
                : prevState.studentDocument[fileType] === blobUrl
                ? downloadURL
                : prevState.studentDocument[fileType],
            },
          }));
        } catch (error) {
          console.error("Error uploading file:", error);
          toast.error(`Error uploading ${file.name}.`);
        }
      }

      // Submit the updated data to the backend
      const res = await visaAdd(updatedStudentDocument);
      setIsConfirmPopUp(true);
      startSprinkles();
      toast.success(res.message || "Data added successfully.");
      if (role === "2") {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " AGENT_SUBMITTED_VISA_LODGEMENT",
            message: `${agentData?.companyDetails?.businessName} ${
              agentData?.agId
            } has submitted the  Visa lodgment application ${res?.data?.applicationId} of ${countryName} for the student ${
              studentData?.studentInformation?.personalInformation?.firstName +
              " " +
              studentData?.studentInformation?.personalInformation?.lastName
            } ${studentFullId}`,
            path: "/admin/applications-review",

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
      // if (role === "3" ) {
      //   if (socketServiceInstance.isConnected()) {
      //     //from agent to admin
      //     const notificationData = {
      //       title: " STUDENT_SUBMITTED_VISA_LODGEMENT",
      //       message: `${agentData?.companyDetails?.businessName} ${
      //         agentData?.agId
      //       } has submitted the  Visa lodgment application ${res?.data?.applicationId} of ${countryName}  for the student   ${
      //         studentData?.studentInformation?.personalInformation?.firstName +
      //         " " +
      //         studentData?.studentInformation?.personalInformation?.lastName
      //       } ${studentData?.studentInformation?.stId}`,

      //       path: "/admin/applications-review",
      //       pathData: {},
      //       recieverId: "",
      //     };

      //     socketServiceInstance.socket.emit(
      //       "NOTIFICATION_STUDENT_TO_ADMIN",
      //       notificationData
      //     );
      //   } else {
      //     console.error("Socket connection failed, cannot emit notification.");
      //   }
      // }
      if (role === "3") {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: " STUDENT_SUBMITTED_VISA_LODGEMENT",
            message: `${
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.firstName +
              " " +
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.lastName
            } ${
              studentInfoData?.data?.studentInformation?.stId
            }  has submitted the course fee application ${response.data.applicationId}.  `,
            agentId: agentData?._id,
            agId: agentData?.agId,
            agentName: agentData?.companyDetails?.businessName,
            studentId: studentId,
            stId: studentInfoData?.data?.studentInformation?.stId,
            studentName:
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.firstName +
              " " +
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.lastName,
            countryName: "",
            collegeName: "",
            applicationId: "",
            ticketId: "",
            appId: "",
            ticId: "",
            recieverId: agentData?._id,
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_STUDENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }

      setIsSubmitting(false);

      // Clear temporary states
      setNewFiles([]);
      setDeletedFiles([]);
    } catch (error) {
      toast.error(error.message || "Something went wrong.");
      console.error("Error during submission:", error);
    }
  };

  useEffect(() => {
    if (StudentDataToGet?.studentInformation) {
      setVisaLetter((prevState) => ({
        ...prevState,

        personalDetails: {
          ...prevState.personalInformation,
          fullName:
            (StudentDataToGet?.studentInformation?.personalInformation
              ?.firstName || "") +
            " " +
            (StudentDataToGet?.studentInformation?.personalInformation
              ?.lastName || ""),
          email:
            StudentDataToGet?.studentInformation?.personalInformation?.email ||
            "",
          phoneNumber:
            StudentDataToGet?.studentInformation?.personalInformation?.phone
              ?.phone || "",
          address: {
            ...prevState.personalInformation?.address,
            street:
              StudentDataToGet?.studentInformation?.residenceAddress?.address ||
              "",
            city:
              StudentDataToGet?.studentInformation?.residenceAddress?.city ||
              "",
            state:
              StudentDataToGet?.studentInformation?.residenceAddress?.state ||
              "",
            postalCode:
              StudentDataToGet?.studentInformation?.residenceAddress?.zipcode ||
              "",
            country:
              StudentDataToGet?.studentInformation?.residenceAddress?.country ||
              "",
          },
        },
      }));
    }
  }, [StudentDataToGet]);
  return (
    <>
      <Header
        icon={location?.pathname === "/student/shortlist" ? <FaStar /> : null}
      />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
          {role === "3" ? <Sidebar /> : role === "2" ? <AgentSidebar /> : null}
        </span>
        <div className="ml-[17%] pt-16 pb-8 bg-white border-b-2 border-[#E8E8E8]">
          <span className="flex  items-center">
            <p className="text-[28px] font-bold text-sidebar mt-6 md:ml-9 sm:ml-20">
              Apply Visa for ({countryName})
            </p>
          </span>
          <p className="text-sidebar ml-9 text-[15px]">
            Check your details and make sure everything looks good. <br /> It's
            no big deal if it's not - you can always change it.
          </p>
        </div>
        <div className="ml-[30%] mr-[15%]">
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-8">
            <span className="font-bold text-[25px] text-secondary">
              Personal Information
            </span>
            <Register
              imp="*"
              name="personalDetails.fullName"
              type="text"
              label="Full Name"
              handleInput={handleInput}
              value={visaLetter.personalDetails.fullName}
              errors={errors.fullName}
            />
            <Register
              imp="*"
              name="personalDetails.email"
              type="email"
              label="Email"
              handleInput={handleInput}
              value={visaLetter.personalDetails.email}
              errors={errors.email}
            />
            <div className="mt-5">
              <PhoneInputComponent
                label="Phone Number"
                phoneData={visaLetter.personalDetails.phoneNumber}
                onPhoneChange={handlePhoneChange}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 mt-2 text-sm">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            <Register
              label="Address"
              imp="*"
              name="personalDetails.address.street"
              value={visaLetter.personalDetails.address.street}
              handleInput={handleInput}
              placeHolder="Address"
              errors={errors.street}
            />
            <Register
              imp="*"
              name="personalDetails.address.state"
              type="text"
              label="Province/State"
              handleInput={handleInput}
              value={visaLetter.personalDetails.address.state}
              errors={errors.state}
            />
            <Register
              imp="*"
              name="personalDetails.address.city"
              type="text"
              label="City/Town"
              handleInput={handleInput}
              value={visaLetter.personalDetails.address.city}
              errors={errors.city}
            />
            <Register
              imp="*"
              name="personalDetails.address.postalCode"
              type="number"
              label="Postal/Zip Code"
              handleInput={handleInput}
              value={visaLetter.personalDetails.address.postalCode}
              errors={errors.postalCode}
            />
            <CountrySelect
              name="personalDetails.address.country"
              label="Country"
              customClass="bg-input"
              options={countryOption}
              value={visaLetter.personalDetails.address.country}
              handleChange={handleInput}
            />
            {errors.country && (
              <p className="text-red-500 mt-1 text-sm">{errors.country}</p>
            )}
          </div>

          {/* File upload sections */}
          {Object.keys(initialStudentDocument).map((docType) => (
            <div
              className="bg-white rounded-xl px-8 pt-4 pb-12 mt-6"
              key={docType}
            >
              <p className="text-[15px]  text-body">
                {docType
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .replace(/^./, (str) => str.toUpperCase()) } *
              </p>
              <div className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-5 mb-4">
                <button
                  className="text-black flex items-center"
                  onClick={() => handleFilePopupOpen(docType)}
                >
                  <FiUpload className="mr-2 text-primary text-[29px]" />
                </button>
                <p>Upload   {docType
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .replace(/^./, (str) => str.toUpperCase())}</p>
              </div>
              {visaLetter.studentDocument[docType] && (
                <div className="mt-2 flex items-center">
                  <a
                    href={visaLetter.studentDocument[docType]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary"
                  >
                    View Uploaded Document
                  </a>
                  <button
                    onClick={() => deleteFile(docType)}
                    className="ml-4 text-red-500"
                  >
                    <RiDeleteBin6Line />
                  </button>
                </div>
              )}
              {errors[docType] && (
                <p className="text-red-500 mt-2 text-sm">{errors[docType]}</p>
              )}
            </div>
          ))}

          <div className="flex justify-end mb-12 mt-12">
            <span
              onClick={handleSubmit}
              className="bg-primary text-white font-poppins rounded-md px-6 py-2 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </span>
          </div>
        </div>
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
        studentId={
            role === "2"
              ? studentId
              : role === "3"
              ? studentInfoData?.data?.studentInformation?._id
              : null
          }
    
      />

      <PopUp
        src={greenTick}
        PopUpClose={() => setIsConfirmPopUp(false)}
        isPopUp={isConfirmPopUp}
        heading="Visa Form Submitted"
        text1="Thank you for completing the form. We'll review your information and process your request soon. Check your email and portal for updates."
      />
    </>
  );
};

export default VisaApply;
