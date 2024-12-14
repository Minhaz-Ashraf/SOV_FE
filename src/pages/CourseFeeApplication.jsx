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

import {
  courseFeeAdd,
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
import { v4 as uuidv4 } from "uuid";
import socketServiceInstance from "../services/socket";

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
  aadharCard: "",
  panCard: "",
};

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

const initialofferLetterAnsPassport = {
  offerLetter: "",
  passport: "",
};

const courseFeeApplication = () => {
  const role = localStorage.getItem("role");
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const studentUserId = useSelector((state) => state.student.studentInfoData);
  const { agentData } = useSelector((state) => state.agent);
  const location = useLocation();
  const studentId =
    role === "3"
      ? studentUserId?.data?.studentInformation?._id
      : location?.state?.id || location?.state;
      const {applicationDataById} = useSelector((state) => state.admin);
  const { countryOption, studentData } = useSelector((state) => state.general);
  const { studentInfoData } = useSelector((state) => state.student);
  const StudentDataToGet = role === "2" ? studentData : studentInfoData?.data;
  console.log(StudentDataToGet, "testing");
  const [isFileType, seFileType] = useState();
  const dispatch = useDispatch();
  const [isPopUp, setIsPopUp] = useState(false);
  const [isConfirmPopUp, setIsConfirmPopUp] = useState(false);
  const [courseFee, setCourseFee] = useState({
    personalDetails: { ...initialPersonalInfo },
    studentDocument: { ...initialStudentDocument },
    parentDocument: { ...initialParentDocument },
    siblingsDocument: { ...initialSiblingDocument },
    offerLetterAnsPassport: { ...initialofferLetterAnsPassport },
  });
  const [errors, setErrors] = useState({});
  const [selectedOption, setSelectedOption] = useState("parent");
  const [resetDoc, setResetDoc] = useState(false);
  const handleInput = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    setCourseFee((prevState) => {
      let tempState = { ...prevState };
      keys.reduce((acc, key, index) => {
        if (index === keys.length - 1) acc[key] = value;
        return acc[key];
      }, tempState);
      return tempState;
    });
  };
  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  useEffect(() => {
    dispatch(studentById(studentId));
  }, [dispatch]);

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

  const validateFields = () => {
    const errors = {};

    // Full name validation (only alphabets and spaces allowed)
    if (!courseFee.personalDetails.fullName?.trim()) {
      errors.fullName = "Full name is required.";
    } else if (!/^[a-zA-Z\s]+$/.test(courseFee.personalDetails.fullName)) {
      errors.fullName = "Full name can only contain alphabets and spaces.";
    }

    // Email validation (valid format)
    if (!courseFee.personalDetails.email) {
      errors.email = "Email is required.";
    } else if (
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(courseFee.personalDetails.email)
    ) {
      errors.email = "Invalid email format.";
    }

    // Phone number validation
    if (!courseFee.personalDetails.phoneNumber) {
      errors.phoneNumber = "Phone number is required.";
    }
    // Address validation
    if (!courseFee.personalDetails.address.street?.trim()) {
      errors.street = "Street address is required.";
    }
    if (!courseFee.personalDetails.address.city?.trim()) {
      errors.city = "City is required.";
    }
    if (!courseFee.personalDetails.address.state?.trim()) {
      errors.state = "State is required.";
    }
    if (!courseFee.personalDetails.address.postalCode?.trim()) {
      errors.postalCode = "Postal Code is required.";
    } else if (
      !/^[0-9]{5,6}$/.test(courseFee.personalDetails.address.postalCode)
    ) {
      errors.postalCode = "Postal Code must be 5-6 digits.";
    }
    if (!courseFee.personalDetails.address.country?.trim()) {
      errors.country = "Country is required.";
    }

    // Document Upload Validation (for required documents)
    if (!courseFee.studentDocument.aadharCard) {
      errors.aadharCard = "Aadhar card is required.";
    }
    if (!courseFee.studentDocument.panCard) {
      errors.panCard = "Pan card is required.";
    }

    // Parent and Sibling Document Upload Validation (conditionally required based on selection)
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
      Object.keys(courseFee.siblingsDocument).forEach((docType) => {
        if (!courseFee.siblingsDocument[docType]) {
          errors[docType] = `${docType.replace(
            /([A-Z])/g,
            " $1"
          )} is required.`;
        }
      });
    }

    // Offer Letter and Passport Validation
    if (!courseFee.offerLetterAnsPassport.offerLetter) {
      errors.offerLetter = "Offer letter is required.";
    }
    if (!courseFee.offerLetterAnsPassport.passport) {
      errors.passport = "Passport is required.";
    }

    return errors;
  };

  // Handle phone number separatel
  const handlePhoneChange = (phoneNumber) => {
    setCourseFee((prevState) => ({
      ...prevState,
      personalDetails: {
        ...prevState.personalDetails,
        phoneNumber: phoneNumber.number,
      },
    }));
  };

    const handleFilePopupOpen = (fileType) => {
      seFileType(fileType);
      PopUpOpen();
    };
    const handleFileUpload = (files) => {
      if (!files || files.length === 0) return;

      const fileOrUrl = files[0];

      if (typeof fileOrUrl === "string" && fileOrUrl.startsWith("http")) {
        // Handle Firebase URL case
        setCourseFee((prevState) => {
          const updatedState = { ...prevState };
          if (isFileType in updatedState.studentDocument) {
            updatedState.studentDocument[isFileType] = fileOrUrl;
          } else if (isFileType in updatedState.parentDocument) {
            updatedState.parentDocument[isFileType] = fileOrUrl;
          } else if (isFileType in updatedState.siblingsDocument) {
            updatedState.siblingsDocument[isFileType] = fileOrUrl;
          } else if (isFileType in updatedState.offerLetterAnsPassport) {
            updatedState.offerLetterAnsPassport[isFileType] = fileOrUrl;
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
          if (isFileType in updatedState.studentDocument) {
            updatedState.studentDocument[isFileType] = blobUrl;
          } else if (isFileType in updatedState.parentDocument) {
            updatedState.parentDocument[isFileType] = blobUrl;
          } else if (isFileType in updatedState.siblingsDocument) {
            updatedState.siblingsDocument[isFileType] = blobUrl;
          } else if (isFileType in updatedState.offerLetterAnsPassport) {
            updatedState.offerLetterAnsPassport[isFileType] = blobUrl;
          }
          return updatedState;
        });
      } else {
        console.warn("Unsupported file type or URL format.");
      }
    };

    const deleteFile = (fileUrl, fileType) => {
      if (!fileUrl) return;

      setDeletedFiles((prevFiles) => [...prevFiles, { fileUrl, fileType }]);

      setCourseFee((prevState) => {
        const updatedState = { ...prevState };
        if (fileType in updatedState.studentDocument) {
          updatedState.studentDocument[fileType] = "";
        } else if (fileType in updatedState.parentDocument) {
          updatedState.parentDocument[fileType] = "";
        } else if (fileType in updatedState.siblingsDocument) {
          updatedState.siblingsDocument[fileType] = "";
        } else if (fileType in updatedState.offerLetterAnsPassport) {
          updatedState.offerLetterAnsPassport[fileType] = "";
        }
        return updatedState;
      });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const validationErrors = validateFields();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error("Please fill required fields");
        return;
      }

      // Upload new files to Firebase
      for (const newFile of newFiles) {
        const { file, fileType } = newFile;
        const uniqueFileName = `${uuidv4()}-${file.name}`;
        const storageRef = ref(
          storage,
          `uploads/courseFeeApplication/${uniqueFileName}`
        );
        try {
        setIsSubmitting(true);

          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          setCourseFee((prevState) => {
            const updatedState = { ...prevState };
            if (fileType in updatedState.studentDocument) {
              updatedState.studentDocument[fileType] = downloadURL;
            } else if (fileType in updatedState.parentDocument) {
              updatedState.parentDocument[fileType] = downloadURL;
            } else if (fileType in updatedState.siblingsDocument) {
              updatedState.siblingsDocument[fileType] = downloadURL;
            } else if (fileType in updatedState.offerLetterAnsPassport) {
              updatedState.offerLetterAnsPassport[fileType] = downloadURL;
            }
            return updatedState;
          });
          const uploadData = {
            viewUrl: downloadURL,
            documentName: file.name,
            userId: studentId,
          };
          await uploadDocument(uploadData);
          // toast.success(`${file.name} uploaded successfully!`);
        } catch (error) {
          // toast.error(`Error uploading ${file.name}. Please try again.`);
        }
      }

      // Delete files from Firebase
      // for (const deletedFile of deletedFiles) {
      //   const { fileUrl, fileType } = deletedFile;
      //   const storageRef = ref(storage, fileUrl);
      //   try {
      //     await deleteObject(storageRef);
      //     toast.success("File deleted successfully!");
      //   } catch (error) {
      //     toast.error("Error deleting file. Please try again.");
      //   }
      // }

      // const payload = {
      //   ...courseFee,
      //   studentInformationId: studentId,
      // };


      const filteredPayload = Object.fromEntries(
        Object.entries({
          ...courseFee,
          studentInformationId: studentId,
        }).filter(([key, value]) => {
          if (key === "parentDocument" || key === "siblingsDocument") {
            return Object.values(value).some((v) => v); // Keep only if there's at least one non-empty value
          }
          return true; 
        })
      );
    
      try {
        const res = await courseFeeAdd(filteredPayload);
        confirmPopUpOpen();
        toast.success(res?.message || "Form Submitted");
      // Trigger notifications based on role
      if (role === "2" ) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: " AGENT_SUBMITTED_COURSE_FEE",
            message: `${agentData?.companyDetails?.businessName} ${
              agentData?.agId
            } has submitted the course fee application   ${
              applicationDataById?.applicationId
            } for the student ${
              studentData?.studentInformation?.personalInformation?.firstName +
              " " +
              studentData?.studentInformation?.personalInformation?.lastName
            } ${studentData?.studentInformation?.stId}`,
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
      if (role === "3" ) {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: " STUDENT_SUBMITTED_COURSE_FEE",
            message: `${
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.firstName +
              " " +
              studentInfoData?.data?.studentInformation?.personalInformation
                ?.lastName
            } ${
              studentInfoData?.data?.studentInformation?.stId
            }  has submitted the course fee application.  `,
            agentId: agentData?._id,
            agId: agentData?.agId,
            agentName: agentData?.companyDetails?.businessName,
            studentId: studentId,
            stId: studentInfoData?.data?.studentInformation?.stId,
            studentName: courseFee.personalDetails.fullName,
            path: "/admin/applications-review",
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
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }finally{
      setIsSubmitting(false);

    }
  };

  useEffect(() => {
    if (StudentDataToGet?.studentInformation) {
      setCourseFee((prevState) => ({
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
        icon={location.pathname === "/student/shortlist" ? <FaStar /> : null}
      />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white ">
          {role === "3" ? <Sidebar /> : role === "2" ? <AgentSidebar /> : null}
        </span>
        <div className="ml-[17%] pt-16 pb-8 bg-white border-b-2 border-[#E8E8E8]  ">
          <span className="flex items-center">
            <p className="text-[28px] font-bold text-sidebar mt-6 md:ml-9  sm:ml-20">
              Apply Course Fee Application
            </p>
          </span>
          <p className="text-sidebar ml-9 text-[15px]">
            Check your details and make sure everything looks good. <br /> It's
            no big deal if it's not - you can always change it.
          </p>
        </div>
        <div className="ml-[30%] mr-[15%]">
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-8 ">
            <span className="font-bold text-[25px] text-secondary ">
              Personal Information
            </span>
            <Register
              imp="*"
              name="personalDetails.fullName"
              type="text"
              label="Full Name"
              handleInput={handleInput}
              value={courseFee.personalDetails.fullName}
              errors={errors.fullName}
            />
            <Register
              imp="*"
              name="personalDetails.email"
              type="email"
              label="Email"
              handleInput={handleInput}
              value={courseFee.personalDetails.email}
              errors={errors.email}
            />
            <div className="mt-5">
              <PhoneInputComponent
                label="Phone Number"
                phoneData={courseFee.personalDetails.phoneNumber}
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
              name="personalDetails.address.street"
              value={courseFee.personalDetails.address.street}
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
              value={courseFee.personalDetails.address.state}
              errors={errors.state}
            />
            <Register
              imp="*"
              name="personalDetails.address.city"
              type="text"
              label="City/Town"
              handleInput={handleInput}
              value={courseFee.personalDetails.address.city}
              errors={errors.city}
            />
            <Register
              imp="*"
              name="personalDetails.address.postalCode"
              type="number"
              label="Postal/Zip Code"
              handleInput={handleInput}
              value={courseFee.personalDetails.address.postalCode}
              errors={errors.postalCode}
            />
            <CountrySelect
              name="personalDetails.address.country"
              label="Country"
              customClass="bg-input"
              options={countryOption}
              value={courseFee.personalDetails.address.country}
              handleChange={handleInput}
            />
            {errors.country && (
              <p className="text-red-500 mt-1 text-sm">{errors.country}</p>
            )}
          </div>
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-6">
            <span className="font-bold text-[25px] text-secondary ">
              Student Document Upload
            </span>
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
          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-6">
            <span className="font-bold text-[25px] text-secondary">
              Document Upload
            </span>

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
                        .trim()
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
                {Object.keys(courseFee.siblingsDocument).map((docType) => (
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
                    {courseFee.siblingsDocument[docType] && (
                      <div className="mt-2 flex items-center">
                        <a
                          href={courseFee.siblingsDocument[docType]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary"
                        >
                          View Uploaded Document
                        </a>
                        <button
                          onClick={() =>
                            deleteFile(
                              courseFee.siblingsDocument[docType],
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

          <div className="bg-white rounded-xl px-8 py-4 pb-12 mt-6">
            <span className="font-bold text-[25px] text-secondary ">
              Document Upload
            </span>
            <p className="text-[15px] mt-3 text-body">Offer Letter</p>
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
                "string" && (
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
              typeof courseFee.offerLetterAnsPassport.passport === "string" && (
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
        setResetDoc={setResetDoc}
        PopUpClose={PopUpClose}
        handleFileUpload={(files) => handleFileUpload(files, isFileType)}
        errors={errors}
        onSubmit={() => {
          console.log("Form Submitted");
        }}
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
        PopUpClose={confirmPopUpClose}
        isPopUp={isConfirmPopUp}
        heading="Course Fee Form Submitted"
        text1="Thank you for completing the form. We'll review your information and process your request soon.
Check your email and portal for updates.."
        // text3="All good things take time."
        // text4="Thanks for your patience!"
        // text="You may start exploring SOV Portal. However, for a proper quality review and writing process, allow us up to 24 to 48 hours to confirm that your application has been successful."
      />
    </>
  );
};

export default courseFeeApplication;
