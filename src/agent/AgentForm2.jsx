import React, { useEffect, useState } from "react";
import { hearAboutOption, titleOption } from "../constant/data";
import PhoneInputComponent from "../components/reusable/PhoneInputComponent";
import ImageComponent, {
  CountrySelect,
  FormNavigationButtons,
  SelectComponent,
} from "../components/reusable/Input";
import Register from "../components/reusable/Register";
import { toast } from "react-toastify";
import { formTwoSubmit } from "../features/agentApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FileUpload from "../components/reusable/DragAndDrop";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../utils/fireBase";
import { agentInformation } from "../features/agentSlice";
import { ImBin } from "react-icons/im";
import { v4 as uuidv4 } from "uuid";
import { editAgentAdmin } from "../features/adminApi";
import { agentDataProfile } from "../features/adminSlice";
const initialContactData = {
  title: "",
  firstName: "",
  lastName: "",
  positionJobTitle: "",
  emailUsername: "",
  country: "",
  phoneNumber: "",
  profilePicture: "",
};
const initialcommissionContactData = {
  fullName: "",
  positionJobTitle: "",
  email: "",
  phoneNumber: "",
};
const initialAdmissionData = {
  destinationCountry: "",
  fullName: "",
  positionJobTitle: "",
  email: "",
  mobileNumber: "",
};

const maxadmissionsContacts = 5; // Define the maximum number of admissions contacts

const AgentForm2 = ({ hide, handleCancel, updateData, adminId, agentId }) => {
  const role = localStorage.getItem('role')
  const { agentProfile } = useSelector((state) => state.admin);
  const { countryOption } = useSelector((state) => state.general);
  const { agentData } = useSelector((state) => state.agent);
  const [resetProfilePic, setResetProfilePic] = useState(false);
  const contactDetails = role === "0" ? agentProfile : agentData;
  const [contactData, setContactData] = useState({
    primaryContact: { ...initialContactData },
    commissionContact: { ...initialcommissionContactData },
    admissionsContacts: [{ ...initialAdmissionData }],
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const editForm = hide === true ? "edit" : null;

  useEffect(() => {
    dispatch(agentInformation());
  }, [dispatch]);
  // Handle Input Changes
  const handleInput = (e, section, index) => {
    const { name, value } = e.target;
    const nameRegex = /^[A-Za-z\s]*$/;
    console.log(name);
    if (
      (name === "firstName" || name === "lastName" || name === "fullName") &&
      !nameRegex.test(value)
    ) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "Only alphabets and spaces are allowed.",
      }));
      return;
    }
    if (section === "admissionsContacts") {
      const updatedAdmissionsContacts = [...contactData.admissionsContacts];
      updatedAdmissionsContacts[index][name] = value;
      setContactData({
        ...contactData,
        admissionsContacts: updatedAdmissionsContacts,
      });
    } else {
      setContactData({
        ...contactData,
        [section]: {
          ...contactData[section],
          [name]: value,
        },
      });
    }
  };
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    const uploadedUrls = [];

    for (const file of files) {
      console.log(`Uploading file: ${file.name}`);

      const uniqueFileName = `${uuidv4()}-${file.name}`;
      const storageRef = ref(storage, `uploads/agentData/${uniqueFileName}`);
      try {
        // Upload each file
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref); // Get the download URL

        uploadedUrls.push(downloadURL); // Add the download URL to the array

        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Error uploading ${file.name}. Please try again.`);
      }
    }
    console.log("Uploaded URLs:", uploadedUrls);
    // Update state with all uploaded file URLs after the loop
    if (uploadedUrls.length > 0) {
      setContactData((prevData) => ({
        ...prevData,
        primaryContact: {
          ...prevData.primaryContact,
          profilePicture: [
            // ...(prevData.primaryContact.profilePicture || []),
            ...uploadedUrls,
          ],
        },
      }));
    }
  };

  // Phone Input Change Handler
  const handlePhoneChange = (phoneData, section, index) => {
    if (section === "admissionsContacts") {
      const updatedAdmissionsContacts = [...contactData.admissionsContacts];
      updatedAdmissionsContacts[index].mobileNumber = phoneData.number;
      setContactData({
        ...contactData,
        admissionsContacts: updatedAdmissionsContacts,
      });
    } else {
      setContactData((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          phoneNumber: phoneData.number,
        },
      }));
    }
  };

  // Validate Form Fields
  const validateFields = () => {
    let validationErrors = {};

    // Validate primaryContact data
    Object.keys(contactData.primaryContact).forEach((key) => {
      if (!contactData.primaryContact[key]) {
        validationErrors[`${key}primaryContact`] = `${key} is required`;
      } else if (
        key === "emailUsername" &&
        !/\S+@\S+\.\S+/.test(contactData.primaryContact[key])
      ) {
        validationErrors[`${key}primaryContact`] = "Invalid email format";
      }
    });

    // Validate commissionContact data
    Object.keys(contactData.commissionContact).forEach((key) => {
      if (!contactData.commissionContact[key]) {
        validationErrors[`${key}commissionContact`] = `${key} is required`;
      } else if (
        key === "email" &&
        !/\S+@\S+\.\S+/.test(contactData.commissionContact[key])
      ) {
        validationErrors[`${key}commissionContact`] = "Invalid email format";
      }
    });

    // Validate admissionsContacts data
    // contactData.admissionsContacts.forEach((admission, index) => {
    //   Object.keys(admission).forEach((key) => {
    //     if (!admission[key]) {
    //       validationErrors[`${key}Admission${index}`] = `${key} is required`;
    //     } else if (key === "email" && !/\S+@\S+\.\S+/.test(admission[key])) {
    //       validationErrors[`${key}Admission${index}`] = "Invalid email format";
    //     }
    //   });
    // });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Add New Admission Entry
  const addNewAdmission = () => {
    if (contactData.admissionsContacts.length < maxadmissionsContacts) {
      setContactData((prevData) => ({
        ...prevData,
        admissionsContacts: [
          ...prevData.admissionsContacts,
          { ...initialAdmissionData },
        ],
      }));
    } else {
      alert("You can add up to 5 admissions contacts only.");
    }
  };
  const removeAdmission = (index) => {
    setContactData((prevData) => ({
      ...prevData,
      admissionsContacts: prevData.admissionsContacts.filter(
        (_, i) => i !== index
      ),
    }));
  };

  //firebase check for file existing
  // const checkFileExists = async (fileUrl) => {
  //   const storageRef = ref(storage, fileUrl);
  //   try {
  //     await getMetadata(storageRef);
  //     return true;
  //   } catch (error) {
  //     if (error.code === 'storage/object-not-found') {
  //       return false;
  //     }
  //     throw error;
  //   }
  // };

  const deleteFile = async (fileUrl) => {
    if (!fileUrl) return;

    // Check if file exists

    const storageRef = ref(storage, fileUrl);

    try {
      await deleteObject(storageRef);
      toast.success("File deleted successfully!");

      setContactData((prevData) => ({
        ...prevData,
        primaryContact: {
          ...prevData.primaryContact,
          profilePicture: prevData.primaryContact.profilePicture.filter(
            (url) => url !== fileUrl
          ),
        },
      }));
      setResetProfilePic(true);
    } catch (error) {
      console.error("Error deleting file:", error);
      if (error.code === "storage/object-not-found") {
        console.error("The file does not exist or has already been deleted.");
      } else if (error.code === "storage/unauthorized") {
        console.error("User does not have permission to access the object.");
      } else {
        console.error("Some other error occurred:", error);
      }
      toast.error("Error deleting file. Please try again.");
    }
  };
  // Get contact data
  useEffect(() => {
    if (contactDetails) {
      setContactData({
        companyId:adminId,
        primaryContact: {
          title: contactDetails.primaryContact?.title || "",
          firstName: contactDetails.primaryContact?.firstName || "",
          lastName: contactDetails.primaryContact?.lastName || "",
          positionJobTitle:
            contactDetails.primaryContact?.positionJobTitle || "",
          emailUsername: contactDetails.primaryContact?.emailUsername || "",
          country: contactDetails.primaryContact?.country || "",
          phoneNumber: contactDetails.primaryContact?.phoneNumber || "",
          profilePicture: contactDetails.primaryContact?.profilePicture
            ? [contactDetails.primaryContact.profilePicture]
            : [],
        },
        commissionContact: {
          fullName: contactDetails.commissionContact?.fullName || "",
          positionJobTitle:
            contactDetails.commissionContact?.positionJobTitle || "",
          email: contactDetails.commissionContact?.email || "",
          phoneNumber: contactDetails.commissionContact?.phoneNumber || "",
        },
        admissionsContacts: contactDetails.admissionsContacts?.length
          ? contactDetails.admissionsContacts.map((admission) => ({
              destinationCountry: admission.destinationCountry || "",
              fullName: admission.fullName || "",
              positionJobTitle: admission.positionJobTitle || "",
              email: admission.email || "",
              mobileNumber: admission.mobileNumber || "",
            }))
          : [{ ...initialAdmissionData }],
      });
    }
  }, [contactDetails]);
  console.log(contactDetails.primaryContact?.profilePicture || []);
  // Handle Submit form
  const handleSubmit = async () => {
    if (validateFields()) {
      try {
        const dataToSubmit = {
          ...contactData,
          primaryContact: {
            ...contactData.primaryContact,
            profilePicture: Array.isArray(
              contactData.primaryContact.profilePicture
            )
              ? contactData.primaryContact.profilePicture.join(",")
              : contactData.primaryContact.profilePicture,
          },
          admissionsContacts: contactData.admissionsContacts.map(
            (admission) => ({
              ...admission,
              mobileNumber: admission.mobileNumber,
            })
          ),
        };


        let res;

        if (role === "0") {
          await editAgentAdmin("/company/register-companyContact-admin", dataToSubmit, editForm);
        } else {
          res = await formTwoSubmit(dataToSubmit, editForm);
        }
      
        if(role === "0"){
          dispatch(agentDataProfile(agentId));
        }
        toast.success(res?.message || "Data added successfully");
        {
          hide === true
            ? updateData()
            : navigate("/agent-form/3", { state: "passPage" });
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something went wrong");
      }
    }
  };
  return (
    <div className="min-h-screen font-poppins">
      <div className={`${hide === true ? "" : "md:mx-48 sm:mx-10"}`}>
        {hide === true ? (
          ""
        ) : (
          <>
            <p className="text-heading font-semibold text-[25px] pt-7">
              Primary Contact Information
            </p>
          </>
        )}
        <div
          className={`bg-white rounded-xl ${
            hide === true ? "" : "px-8"
          } py-4 pb-12 mt-6`}
        >
          <div className="flex items-baseline justify-between gap-6 w-full">
            <span className="w-[20%] ">
              <SelectComponent
                name="title"
                label="Title"
                options={titleOption}
                value={contactData.primaryContact.title}
                handleChange={(e) => handleInput(e, "primaryContact")}
                errors={errors.titleprimaryContact}
              />
            </span>
            {/* First Name Input */}
            <span className="w-[40%]">
              <Register
                imp="*"
                name="firstName"
                type="text"
                label="First Name"
                handleInput={(e) => handleInput(e, "primaryContact")}
                value={contactData.primaryContact.firstName}
                errors={errors.firstNameprimaryContact}
              />
            </span>
            {/* Last Name Input */}
            <span className="w-[40%]">
              <Register
                imp="*"
                name="lastName"
                type="text"
                label="Last Name"
                handleInput={(e) => handleInput(e, "primaryContact")}
                value={contactData.primaryContact.lastName}
                errors={errors.lastNameprimaryContact}
              />
            </span>
          </div>
          {/* Job Title and Country Inputs */}
          <div className="flex items-baseline justify-between gap-6 w-full">
            <span className="w-[50%]">
              <Register
                imp="*"
                name="positionJobTitle"
                type="text"
                label="Position/Job Title"
                handleInput={(e) => handleInput(e, "primaryContact")}
                value={contactData.primaryContact.positionJobTitle}
                errors={errors.positionJobTitleprimaryContact}
              />
              <CountrySelect
                name="country"
                label="Country"
                customClass="bg-input"
                options={countryOption}
                value={contactData.primaryContact.country}
                handleChange={(e) => handleInput(e, "primaryContact")}
                errors={errors.countryprimaryContact}
              />
            </span>
            {/* Email and Phone Number Inputs */}
            <span className="w-[50%]">
              <Register
                imp="*"
                name="emailUsername"
                type="email"
                label="Email"
                handleInput={(e) => handleInput(e, "primaryContact")}
                value={contactData.primaryContact.emailUsername}
                errors={errors.emailUsernameprimaryContact}
              />
              <div className="mt-6">
                <PhoneInputComponent
                  label="Phone Number"
                  phoneData={contactData.primaryContact.phoneNumber}
                  onPhoneChange={(phoneData) =>
                    handlePhoneChange(phoneData, "primaryContact")
                  }
                />
                {errors.phoneNumberprimaryContact && (
                  <span className="text-red-500 text-xs">
                    {errors.phoneNumberprimaryContact}
                  </span>
                )}
              </div>
            </span>
          </div>

          {console.log(contactData.primaryContact.profilePicture)}
          <FileUpload
            label="Upload Profile Picture"
            acceptedFormats={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg", ".jpg"],
            }}
            onFilesUploaded={handleFileUpload}
            customClass=" border-dashed text-[14px]"
            reset={resetProfilePic}
            setReset={setResetProfilePic}
            value={contactData.primaryContact.profilePicture}
          />
          {errors.passportUpload && (
            <p className="text-red-500 mt-1 text-sm">{errors.passportUpload}</p>
          )}
          {Array.isArray(contactData.primaryContact.profilePicture) &&
            contactData.primaryContact.profilePicture
              .filter(
                (fileUrl) =>
                  fileUrl &&
                  typeof fileUrl === "string" &&
                  fileUrl.startsWith("http")
              )
              .filter((value, index, self) => self.indexOf(value) === index)
              .map((fileUrl, index) => (
                <div key={index} className="relative">
                  <ImageComponent
                    src={fileUrl}
                    className="w-24 h-24 rounded-md border border-black mt-6"
                    alt={`Uploaded profile picture ${index + 1}`}
                  />
                  <span
                    onClick={() => deleteFile(fileUrl)}
                    className="absolute text-primary top-1 left-[70px] text-[20px] cursor-pointer rounded-md"
                  >
                    <ImBin />
                  </span>
                </div>
              ))}
        </div>
        {/* Commission Contact Information */}
        <p className="text-heading font-semibold text-[25px] pt-7">
          Commission Contact Information
        </p>
        <div
          className={`bg-white rounded-xl ${
            hide === true ? "" : "px-8"
          } py-4 pb-12 mt-6`}
        >
          <div className="flex items-center justify-between gap-6 w-full">
            <span className="w-[50%]">
              <Register
                imp="*"
                name="fullName"
                type="text"
                label="Full Name"
                handleInput={(e) => handleInput(e, "commissionContact")}
                value={contactData.commissionContact.fullName}
                errors={errors.fullName}
              />
            </span>
            <span className="w-[50%]">
              <Register
                imp="*"
                name="positionJobTitle"
                type="text"
                label="Position/Job Title"
                handleInput={(e) => handleInput(e, "commissionContact")}
                value={contactData.commissionContact.positionJobTitle}
                errors={errors.positionJobTitlecommissionContact}
              />
            </span>
          </div>
          <div className="flex items-center justify-between gap-6 w-full">
            <span className="w-[50%]">
              <Register
                imp="*"
                name="email"
                type="email"
                label="Email"
                handleInput={(e) => handleInput(e, "commissionContact")}
                value={contactData.commissionContact.email}
                errors={errors.emailcommissionContact}
              />
            </span>
            <span className="w-[50%] mt-6">
              <PhoneInputComponent
                label="Phone Number"
                phoneData={contactData.commissionContact.phoneNumber}
                onPhoneChange={(phoneData) =>
                  handlePhoneChange(phoneData, "commissionContact")
                }
              />
              {errors.phoneNumbercommissionContact && (
                <span className="text-red-500 text-xs">
                  {errors.phoneNumbercommissionContact}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Admissions Contacts */}
        <p className="text-heading font-semibold text-[25px] pt-7">
          Admissions Contact Information
        </p>
        {contactData.admissionsContacts.map((admission, index) => (
          <>
            <div
              key={index}
              className={`bg-white rounded-xl ${
                hide === true ? "" : "px-8"
              } py-4 pb-12 mt-6`}
            >
              {/* Inputs for admission contact */}
              <div className="flex items-baseline justify-between gap-6 w-full">
                <span className="w-[50%]">
                  <Register
                    // imp="*"
                    name="fullName"
                    type="text"
                    label="Full Name"
                    handleInput={(e) =>
                      handleInput(e, "admissionsContacts", index)
                    }
                    value={admission.fullName}
                    errors={errors[`fullNameAdmission${index}`]}
                  />
                </span>
                <span className="w-[50%]">
                  <Register
                    // imp="*"
                    name="positionJobTitle"
                    type="text"
                    label="Position/Job Title"
                    handleInput={(e) =>
                      handleInput(e, "admissionsContacts", index)
                    }
                    value={admission.positionJobTitle}
                    errors={errors[`positionJobTitleAdmission${index}`]}
                  />
                </span>
              </div>
              {/* Additional Fields */}
              <div className="flex items-baseline justify-between gap-6 w-full">
                <span className="w-[50%]">
                  <CountrySelect
                    name="destinationCountry"
                    customClass="bg-input"
                    notImp={true}
                    label="Country"
                    options={countryOption}
                    value={admission.destinationCountry}
                    handleChange={(e) =>
                      handleInput(e, "admissionsContacts", index)
                    }
                    errors={errors[`destinationCountryAdmission${index}`]}
                  />
                </span>
                <span className="w-[50%]">
                  <Register
                    name="email"
                    type="email"
                    label="Email"
                    handleInput={(e) =>
                      handleInput(e, "admissionsContacts", index)
                    }
                    value={admission.email}
                    errors={errors[`emailAdmission${index}`]}
                  />
                </span>
              </div>
              <div className="mt-8">
                <PhoneInputComponent
                  notImp={true}
                  label="Phone Number"
                  phoneData={admission.mobileNumber}
                  onPhoneChange={(phoneData) =>
                    handlePhoneChange(phoneData, "admissionsContacts", index)
                  }
                />
                {errors[`mobileNumberAdmission${index}`] && (
                  <span className="text-red-500 text-xs">
                    {errors[`mobileNumberAdmission${index}`]}
                  </span>
                )}
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  className="bg-primary text-white px-6 py-2 rounded-md mt-4 "
                  onClick={() => removeAdmission(index)}
                >
                  Remove Admission Contact
                </button>
              </div>
            </div>
          </>
        ))}

        {/* Add More Admissions Button */}
        <div className="flex justify-start items-center gap-4 mt-5">
          {contactData.admissionsContacts.length < maxadmissionsContacts && (
            <button
              type="button"
              className="bg-primary text-white py-2 px-6 rounded-lg"
              onClick={addNewAdmission}
            >
              Add More +
            </button>
          )}
        </div>
        {hide === true ? (
          <div className="flex justify-end mt-9 gap-4 ">
            <button
              className="border border-greyish text-black px-4 py-2 rounded"
              onClick={() => handleCancel("isTwo")}
            >
              Cancel
            </button>
            <button
              className="bg-primary text-white px-6 py-2 rounded"
              onClick={() => {
                handleSubmit();
                handleCancel("isTwo");
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <FormNavigationButtons
            backLink="/agent-form/1"
            backText="Back"
            buttonText="Submit and Continue"
            handleButtonClick={handleSubmit}
          />
        )}
      </div>

      {/* Submit Button */}
    </div>
  );
};

export default AgentForm2;
