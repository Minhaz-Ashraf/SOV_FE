import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import { useLocation } from "react-router-dom";
import Register from "../components/reusable/Register";
import PhoneInputComponent from "../components/reusable/PhoneInputComponent";
import {
  CountrySelect,
  CustomInput,
  InstituteComponent,
  SelectComponent,
} from "../components/reusable/Input";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../components/reusable/DragAndDrop";
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
import {
  clearInstituteOption,
  getInstituteOption,
  studentById,
} from "../features/generalSlice";
import FormSection, {
  ScoreInputForm,
} from "../components/reusable/FormSection";
import { intakeOption } from "../constant/data";
import {
  deleteDocument,
  getStudentDataById,
  newOfferLetter,
  uploadDocument,
} from "../features/generalApi";
import AgentSidebar from "../components/dashboardComp/AgentSidebar";
import PopUp from "../components/reusable/PopUp";
import { greenTick } from "../assets";
import { RiDeleteBin6Line } from "react-icons/ri";
import Sidebar from "../components/dashboardComp/Sidebar";
import socketServiceInstance from "./../services/socket";

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
const initialIELTS = {
  reading: "",
  speaking: "",
  writing: "",
  listening: "",
  overallBand: "",
};
const initialPTES = {
  reading: "",
  speaking: "",
  writing: "",
  listening: "",
  overallBand: "",
};
const initialTOEFL = {
  reading: "",
  speaking: "",
  writing: "",
  listening: "",
  overallBand: "",
};
const initialPreferences = {
  country: "",
  institution: "",
  course: "",
  offerLetterPrice: "",
  intake: "",
};
const initialdocumentDetails = {
  urls: [],
};

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
import { v4 as uuidv4 } from "uuid";
import { createSprinklesEffect } from "../components/SprinklesParty";
const ApplyOfferLater = () => {
  const role = localStorage.getItem("role");
  const studentUserId = useSelector((state) => state.student.studentInfoData);
  // const { agentData } = useSelector((state) => state.agent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { agentData } = useSelector((state) => state.agent);

  const location = useLocation();
  const studentId =
    role === "3"
      ? studentUserId?.data?.studentInformation?._id
      : location?.state?.id || location?.state;
  const { courses } = useSelector((state) => state.general);
  const { countryOption, studentData, prefCountryOption } = useSelector(
    (state) => state.general
  );
  const { studentInfoData } = useSelector((state) => state.student);
  const StudentDataToGet = role === "2" ? studentData : studentInfoData?.data;
  console.log(studentId, "testing");
  const prefCountry =
    role === "3" ? location?.state?.country : location?.state?.prefCountry;
  const prefInstitute =
    role === "3" ? location?.state?.institute : location?.state?.prefInstitute;
  const { instituteOption } = useSelector((state) => state.general);
  const [isFileType, seFileType] = useState();
  const dispatch = useDispatch();
  const [isPopUp, setIsPopUp] = useState(false);
  const [isConfirmPopUp, setIsConfirmPopUp] = useState(false);
  const [offerLater, setOfferLater] = useState({
    personalInformation: { ...initialPersonalInfo },
    educationDetails: { ...initialEducationDetails },
    preferences: { ...initialPreferences },
    certificate: { ...initialdocumentDetails },
    PTE: { ...initialPTES },
    TOEFL: { ...initialTOEFL },
    IELTS: { ...initialIELTS },
  });
  const [selectedEducation, setSelectedEducation] = useState("");
  const [errors, setErrors] = useState({});
  const [resetDoc, setResetDoc] = useState(false);
  const [resetSecondDoc, setResetSecondDoc] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  useEffect(() => {
    dispatch(studentById(studentId));
  }, [dispatch]);

  useEffect(() => {
    if (offerLater?.preferences?.country) {
      dispatch(getInstituteOption(offerLater.preferences.country));
    }
  }, [dispatch, offerLater?.preferences?.country]);

  const PopUpOpen = () => {
    setResetDoc(false);
    setIsPopUp(true);
  };
  const PopUpClose = () => {
    setIsPopUp(false);
  };
  const confirmPopUpOpen = () => {
    setIsConfirmPopUp(true);
  };
  const confirmPopUpClose = () => {
    setIsConfirmPopUp(false);
  };
  // General input change handler
  const handleInput = (e, sectionType) => {
    const { name, value, type } = e.target;

    // Split the name by dots (e.g., personalInformation.address.street)
    const nameParts = name.split(".");

    // Check if the input type is 'radio' to handle education level
    if (type === "radio") {
      setSelectedEducation(value);
      setOfferLater({
        ...offerLater,
        educationDetails: { ...initialEducationDetails, educationLevel: value },
      });
    }

    // Update nested object fields
    setOfferLater((prevState) => {
      let updatedState = { ...prevState };

      // Use the nameParts array to drill down into the state and set the value
      let stateLevel = updatedState;
      for (let i = 0; i < nameParts.length - 1; i++) {
        stateLevel = stateLevel[nameParts[i]];
      }

      // Set the value at the correct key
      stateLevel[nameParts[nameParts.length - 1]] = value;

      return updatedState;
    });
  };

  const validateFields = () => {
    const errors = {};

    // Full name validation (only alphabets and spaces allowed)
    if (!offerLater.personalInformation.fullName?.trim()) {
      errors.fullName = "Full name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(offerLater.personalInformation.fullName)) {
      errors.fullName = "Full name can only contain alphabets and spaces.";
    }

    // Email validation (valid format)
    if (!offerLater.personalInformation.email) {
      errors.email = "Email is required.";
    } else if (
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
        offerLater.personalInformation.email
      )
    ) {
      errors.email = "Invalid email format.";
    }

    // Phone number validation
    if (!offerLater.personalInformation.phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    }

    // Address validation
    if (!offerLater.personalInformation.address.street?.trim()) {
      errors.street = "Street address is required.";
    }
    if (!offerLater.personalInformation.address.city?.trim()) {
      errors.city = "City is required.";
    }
    if (!offerLater.personalInformation.address.state?.trim()) {
      errors.state = "State is required.";
    }
    if (!offerLater.personalInformation.address.postalCode?.trim()) {
      errors.postalCode = "Postal Code is required.";
    }
    if (!offerLater.personalInformation.address.country?.trim()) {
      errors.country = "Country is required.";
    }

    // Education Details validation
    if (!offerLater.educationDetails.educationLevel) {
      errors.educationLevel = "Education level is required.";
    }

    if (!selectedEducation) {
      errors.educationLevel = "Please select an education level.";
    }

    const requiredDocs = educationLevels[selectedEducation] || [];
    requiredDocs.forEach((doc) => {
      if (!offerLater.educationDetails[doc]) {
        errors[doc] = `Please upload ${doc.replace("markSheet", "Marksheet")}.`;
      }
    });
    // Preferences validation
    if (!offerLater.preferences.country?.trim()) {
      errors.prefCountry = "Preferred country is required.";
    }
    if (!offerLater.preferences.institution?.trim()) {
      errors.prefInstitution = "Preferred institution is required.";
    }
    if (!offerLater.preferences.course?.trim()) {
      errors.prefCourse = "Preferred course is required.";
    }
    if (!offerLater.preferences.intake?.trim()) {
      errors.prefIntake = "Preferred intake is required.";
    }
    // if (!offerLater.preferences.offerLetterPrice?.trim()) {
    //   errors.prefOfferLetter = "Preferred offer Letter is required.";
    // }

    const isTOEFLFilled = Object.values(offerLater.TOEFL).some(
      (val) => val.trim() !== ""
    );
    const isIELTSFilled = Object.values(offerLater.IELTS).some(
      (val) => val.trim() !== ""
    );
    const isPTEFilled = Object.values(offerLater.PTE).some(
      (val) => val.trim() !== ""
    );

    if (!isTOEFLFilled && !isIELTSFilled && !isPTEFilled) {
      errors.testScore =
        "At least one test score (TOEFL, IELTS, or PTE) is required.";
    }
    return errors;
  };

  // Handle phone number separatel
  const handlePhoneChange = (phoneNumber) => {
    setOfferLater((prevState) => ({
      ...prevState,
      personalInformation: {
        ...prevState.personalInformation,
        phoneNumber: phoneNumber.number,
      },
    }));
  };

  // Handle phone number separatel

  // const fileObjects = filesOrUrls.filter((item) => item instanceof File); to be research

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

      // Update only educationDetails with the blob URL
      setOfferLater((prevState) => ({
        ...prevState,
        educationDetails: {
          ...prevState.educationDetails,
          [uploadType]: blobUrl, // Set blob URL temporarily for preview
        },
        ...(uploadType === "certificate" && {
          certificate: {
            ...prevState.certificate,
            urls: [
              ...(Array.isArray(prevState.certificate.urls)
                ? prevState.certificate.urls
                : []),
              blobUrl, // Append the blob URL only for certificates
            ],
          },
        }),
      }));

      toast.info(`${fileOrUrl.name} will be uploaded upon saving.`);
    } else if (typeof fileOrUrl === "string") {
      // Handle URL strings
      setOfferLater((prevState) => ({
        ...prevState,
        educationDetails: {
          ...prevState.educationDetails,
          [uploadType]: fileOrUrl, // Set the URL directly in educationDetails
        },
        ...(uploadType === "certificate" && {
          certificate: {
            ...prevState.certificate,
            urls: [
              ...(Array.isArray(prevState.certificate.urls)
                ? prevState.certificate.urls
                : []),
              fileOrUrl, // Append the URL only for certificates
            ],
          },
        }),
      }));

      // toast.info("Document URL has been set.");
    }
  };

  const deleteFile = async (fileUrl, uploadType) => {
    if (!fileUrl) return;

    // Add file to deletedFiles array for deferred deletion
    setDeletedFiles((prevState) => [...prevState, { fileUrl, uploadType }]);

    // Clear the respective field in the state
    setOfferLater((prevState) => ({
      ...prevState,
      educationDetails: {
        ...prevState.educationDetails,
        [uploadType]: "",
      },
      certificate: {
        urls: prevState?.certificate?.urls?.filter((url) => url !== fileUrl),
      },
    }));
    setNewFiles((prevState) =>
      prevState.filter((file) => !fileUrl.includes(file.name))
    );

    // toast.info("File marked for deletion. Changes will be applied upon saving.");
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
      toast.error("Please fill required fields");
      console.log("Form has errors", validationErrors);
      return; // Stop the submission process if there are validation errors
    }

    try {
      setIsSubmitting(true);

      // Prepare updated education details
      const updatedEducationDetails = { ...offerLater.educationDetails };

      // Upload new files
      await Promise.all(
        newFiles.map(async ({ file, uploadType }) => {
          const uniqueFileName = `${uuidv4()}-${file.name}`;
          const storageRef = ref(
            storage,
            `uploads/offerLetter/${uniqueFileName}`
          );

          try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);

            // Update education details with uploaded file URL
            updatedEducationDetails[uploadType] = downloadURL;

            // Upload document metadata
            const uploadData = {
              viewUrl: downloadURL,
              documentName: file.name,
              userId: studentId,
            };
            await uploadDocument(uploadData);

            // toast.success(`${file.name} uploaded successfully.`);
          } catch (error) {
            // toast.error(`Error uploading ${file.name}. Please try again.`);
            console.error(error);
          }
        })
      );

      // Upload existing certificates if any
      if (Array.isArray(offerLater.certificate?.urls)) {
        await Promise.all(
          offerLater.certificate.urls.map(async (certUrl) => {
            try {
              const response = await fetch(certUrl);
              const blob = await response.blob();
              const uniqueFileName = `${uuidv4()}-${certUrl.split("/").pop()}`;
              const storageRef = ref(
                storage,
                `uploads/offerLetter/${uniqueFileName}`
              );

              const snapshot = await uploadBytes(storageRef, blob);
              const downloadURL = await getDownloadURL(snapshot.ref);
            

              // Add to education details certificate URLs
              if (!updatedEducationDetails.certificate?.url) {
                updatedEducationDetails.certificate = { url: [] };
              }
              updatedEducationDetails.certificate.url.push(downloadURL);

              // Upload document metadata
          

              // toast.success(`${uniqueFileName} uploaded successfully.`);
            } catch (error) {
              // toast.error(`Error uploading certificate. Please try again.`);
              console.error(error);
            }
          })
        );
      }

      // Convert TOEFL, PTE, IELTS scores
      const convertToNumber = (scoreData) =>
        scoreData
          ? {
              reading: Number(scoreData.reading || 0),
              speaking: Number(scoreData.speaking || 0),
              writing: Number(scoreData.writing || 0),
              listening: Number(scoreData.listening || 0),
              overallBand: Number(scoreData.overallBand || 0),
            }
          : null;

      const updatedOfferLater = {
        ...offerLater,
        educationDetails: updatedEducationDetails,
        certificate: {
          url: updatedEducationDetails.certificate?.url || [],
        },
        studentInformationId: studentId,
      };

      // Add scores if present
      if (
        offerLater.TOEFL &&
        Object.values(offerLater.TOEFL).some((val) => val)
      ) {
        updatedOfferLater.toefl = convertToNumber(offerLater.TOEFL);
      }
      if (offerLater.PTE && Object.values(offerLater.PTE).some((val) => val)) {
        updatedOfferLater.ptes = convertToNumber(offerLater.PTE);
      }
      if (
        offerLater.IELTS &&
        Object.values(offerLater.IELTS).some((val) => val)
      ) {
        updatedOfferLater.ieltsScore = convertToNumber(offerLater.IELTS);
      }

      // Remove temporary TOEFL, PTE, IELTS from the final submission
      delete updatedOfferLater.TOEFL;
      delete updatedOfferLater.PTE;
      delete updatedOfferLater.IELTS;

      // Submit the form data

      const response = await newOfferLetter(updatedOfferLater);
      // console.log(response)
      // Handle successful submission
      confirmPopUpOpen();
      startSprinkles();
      toast.success(response.message || "Data added successfully.");
      if (role === "2") {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " AGENT_SUBMITTED_OFFER_LETTER",
            message: `${agentData?.companyDetails?.businessName} ${
              agentData?.agId
            } has submitted the offer letter application ${response.data.applicationId} of ${
              offerLater.preferences.institution
            } ${offerLater.preferences.country}  for the student ${
              studentData?.studentInformation?.personalInformation?.firstName +
              " " +
              studentData?.studentInformation?.personalInformation?.lastName
            } ${studentData?.studentInformation?.stId}
`,           path: "/admin/applications-review",
            agentId: agentData?._id,
            agId: agentData?.agId,
            agentName: agentData?.companyDetails?.businessName,
            studentId: studentId,
            stId: "",
            studentName:
              studentData?.studentInformation?.personalInformation?.firstName +
              " " +
              studentData?.studentInformation?.personalInformation?.lastName,
            countryName: offerLater.preferences.country,
            collegeName: offerLater.preferences.institution,
            applicationId: "",
            ticketId: "",
            appId: "",
            ticId: "",
            recieverId: agentData?._id,
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_AGENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (role === "3") {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: " STUDENT_SUBMITTED_OFFER_LETTER",
            message: `${
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.firstName +
                " " +
                studentInfoData?.data?.studentInformation?.personalInformation
                  ?.lastName || ""
            } ${
              studentInfoData?.data?.studentInformation?.stId || ""
            } has submitted the offer letter application ${response.data.applicationId}.`,
            path: "/admin/applications-review",
            recieverId: "",
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_STUDENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
    
    
  

      // Clear temporary states
      setNewFiles([]);
      setIsSubmitting(false);
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Submission Error:", error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (StudentDataToGet?.studentInformation) {
      setOfferLater((prevState) => ({
        ...prevState,
        preferences: {
          ...prevState.preferences,
          country: prefCountry || "",
          institution: prefInstitute || "",
        },
        personalInformation: {
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

  const educationLevelLabels = {
    diploma: "Diploma",
    underGraduate: "Under Graduate",
    postGraduate: "Post Graduate",
    diplomaPG: "Diploma (PG)",
    certificationCourse: "Certification Course",
  };
  return (
    <>
      <Header
        icon={location.pathname === "/student/shortlist" ? <FaStar /> : null}
      />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
          {role === "3" ? <Sidebar /> : role === "2" ? <AgentSidebar /> : null}
        </span>
        <div className="ml-[17%] pt-16 pb-8 bg-white border-b-2 border-[#E8E8E8]  ">
          <span className="flex items-center">
            <p className="text-[28px] font-bold text-sidebar mt-6 md:ml-9  sm:ml-20">
              Apply Offer Letter
            </p>
          </span>
          <p className="text-sidebar text-[15px]  md:ml-9  sm:ml-20">
            Check your details and make sure everything looks good. <br /> It's
            no big deal if it's not - you can always change it.
          </p>
        </div>
        <div className="md:ml-[30%] md:mr-[15%] sm:mr-[8%] sm:ml-[27%]">
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-8 ">
            <span className="font-bold text-[25px] text-secondary ">
              Personal Information
            </span>
            <Register
              imp="*"
              name="personalInformation.fullName"
              type="text"
              label="Full Name"
              handleInput={handleInput}
              value={offerLater.personalInformation.fullName}
              errors={errors.fullName}
            />
            <Register
              imp="*"
              name="personalInformation.email"
              type="email"
              label="Email"
              handleInput={handleInput}
              value={offerLater.personalInformation.email}
              errors={errors.email}
            />
            <div className="mt-5">
              <PhoneInputComponent
                label="Phone Number"
                phoneData={offerLater.personalInformation.phoneNumber}
                onPhoneChange={(phoneData) => {
                  handlePhoneChange(phoneData);
                }}
              />
              {errors.phoneNumber && (
                <p className="text-red-500 mt-2  text-sm">
                  {errors.phoneNumber}
                </p>
              )}
            </div>
            <Register
              label="Address"
              imp="*"
              name="personalInformation.address.street"
              value={offerLater.personalInformation.address.street}
              handleInput={handleInput}
              placeHolder="Address"
              errors={errors.street}
            />
            <Register
              imp="*"
              name="personalInformation.address.state"
              type="text"
              label="Province/State"
              handleInput={handleInput}
              value={offerLater.personalInformation.address.state}
              errors={errors.state}
            />
            <Register
              imp="*"
              name="personalInformation.address.city"
              type="text"
              label="City/Town"
              handleInput={handleInput}
              value={offerLater.personalInformation.address.city}
              errors={errors.city}
            />
            <Register
              imp="*"
              name="personalInformation.address.postalCode"
              type="number"
              label="Postal/Zip Code"
              handleInput={handleInput}
              value={offerLater.personalInformation.address.postalCode}
              errors={errors.postalCode}
            />
            <CountrySelect
              name="personalInformation.address.country"
              label="Country"
              customClass="bg-input"
              options={countryOption}
              value={offerLater.personalInformation.address.country}
              handleChange={handleInput}
            />
            {errors.country && (
              <p className="text-red-500 mt-1 text-sm">{errors.country}</p>
            )}
          </div>

          <div className="bg-white  rounded-xl md:px-8  py-4 pb-12 mt-6">
            <span className="font-bold text-[25px] text-secondary  sm:px-6">
              Education Details
            </span>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-2 mt-4 md:px-8 sm:px-6 gap-6 text-body">
              {Object.keys(educationLevels).map((level) => (
                <span
                  key={level}
                  className="flex items-center gap-4 border border-[#CFCFD7] rounded-md py-3 w-52 justify-evenly"
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
          </div>
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-6">
            <span className="font-bold text-[25px] text-secondary ">
              Preferences
            </span>
            <CountrySelect
              name="preferences.country"
              label="Country"
              customClass="bg-input"
              options={prefCountryOption}
              value={offerLater.preferences.country}
              handleChange={handleInput}
            />
            {errors.prefCountry && (
              <p className="text-red-500 mt-1 text-sm">{errors.prefCountry}</p>
            )}

            <InstituteComponent
              name="preferences.institution"
              label="Institute"
              customClass="bg-input"
              options={offerLater.preferences.country ? instituteOption : []}
              value={offerLater.preferences.institution}
              handleChange={handleInput}
            />
            {errors.prefInstitution && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.prefInstitution}
              </p>
            )}

            <SelectComponent
              name="preferences.course"
              label="Course"
              options={courses}
              value={offerLater.preferences.course}
              handleChange={handleInput}
            />
            {errors.prefCourse && (
              <p className="text-red-500 mt-1 text-sm">{errors.prefCourse}</p>
            )}
            {/* <Register
              imp="*"
              name="preferences.offerLetterPrice"
              type="number"
              label="Offer letter price in USD"
              handleInput={handleInput}
              value={offerLater.preferences.offerLetterPrice}
              errors={errors.prefOfferLetter}
            /> */}

            <SelectComponent
              name="preferences.intake"
              label="Intake"
              options={intakeOption}
              value={offerLater.preferences.intake}
              handleChange={handleInput}
            />
            {errors.prefIntake && (
              <p className="text-red-500 mt-1 text-sm">{errors.prefIntake}</p>
            )}
          </div>
          <div className="px-8 bg-white">
            {errors.testScore && (
              <p className="text-red-500 mt-1 text-md">{errors.testScore}</p>
            )}
            <ScoreInputForm
              namePrefix="IELTS"
              handleInput={handleInput}
              scoreType="IELTS Score"
              scoreData={offerLater.IELTS}
              errors={errors.IELTS}
            />
            <ScoreInputForm
              namePrefix="PTE"
              handleInput={handleInput}
              scoreType="PTE Score"
              scoreData={offerLater.PTE}
              errors={errors.PTE}
            />
            <ScoreInputForm
              namePrefix="TOEFL"
              handleInput={handleInput}
              scoreType="TOEFL Score"
              scoreData={offerLater.TOEFL}
              errors={errors.TOEFL}
            />
          </div>
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-6">
            <span className="font-bold text-[25px] text-secondary ">
              Upload Documents
            </span>
            <p className="text-[15px] mt-3 text-body">
              IELTS/PTE/TOEFL/Certificate*
            </p>
            <div className="flex flex-col justify-center items-center border-2 border-dashed border-body rounded-md py-9 mt-9 mb-4">
              <button
                className="text-black flex items-center"
                onClick={() => handleFilePopupOpen("certificate")}
              >
                <FiUpload className="mr-2 text-primary text-[29px]" />
              </button>
              <p>Upload Certificates</p>
            </div>

            {Array.isArray(offerLater.certificate.urls) &&
              offerLater.certificate.urls?.length > 0 && (
                <div className="mt-4">
                  <p className="text-secondary font-semibold">
                    Uploaded Documents:
                  </p>
                  <ul>
                    {offerLater.certificate?.urls
                      .filter(
                        (url) =>
                          typeof url === "string" &&
                          (url.startsWith("http") || url.startsWith("blob:")) // Include blob URLs
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
                            className="ml-4 text-red-500"
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
          </div>
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
        docLabel="Upload Marksheet"
        resetDoc={resetDoc}
        PopUpClose={PopUpClose}
        setResetDoc={setResetDoc}
        handleFileUpload={(files) => handleFileUpload(files, isFileType)}
        uploadedFiles={offerLater.educationDetails[selectedEducation]}
        // handleDeleteFile={(fileUrl) => deleteFile(fileUrl, isFileType)}
        errors={errors}
        studentId={
          role === "2"
            ? studentId
            : role === "3"
            ? studentInfoData?.data?.studentInformation?.studentId
            : null
        }
        onSubmit={() => {
          console.log("Form Submitted");
        }}
      />

      <PopUp
        src={greenTick}
        PopUpClose={confirmPopUpClose}
        isPopUp={isConfirmPopUp}
        heading="Offer Letter Form Submitted"
        text1="Thank you for completing the form. We'll review your information and process your request soon.
Check your email and portal for updates.."
        // text3="All good things take time."
        // text4="Thanks for your patience!"
        // text="You may start exploring SOV Portal. However, for a proper quality review and writing process, allow us up to 24 to 48 hours to confirm that your application has been successful."
      />
    </>
  );
};

export default ApplyOfferLater;
