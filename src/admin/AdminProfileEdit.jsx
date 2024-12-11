import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import { ImBin } from "react-icons/im";
import ImageComponent, { CustomInput } from "../components/reusable/Input";
import FileUpload from "../components/reusable/DragAndDrop";
import Register from "../components/reusable/Register";
import PhoneInputComponent from "../components/reusable/PhoneInputComponent";
import { editProfile } from "../features/adminApi";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../utils/fireBase";
import { useDispatch, useSelector } from "react-redux";
import { adminProfileData } from "../features/adminSlice";

const AdminProfileEdit = () => {
  const dispatch = useDispatch()
  const [profileEdit, setProfileEdit] = useState({
    profilePicture: "",
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
  });
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetProfilePic, setResetProfilePic] = useState(false);
const {getAdminProfile} = useSelector((state)=>state.admin)
  // File upload handler
  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;

    const uniqueFiles = files.filter(
      (file) =>
        !newFiles.some((existingFile) => existingFile.name === file.name) &&
        !deletedFiles.some((deletedFileUrl) =>
          deletedFileUrl.includes(file.name)
        )
    );

    if (uniqueFiles.length === 0) {
      toast.warn("Duplicate or previously deleted files are not allowed.");
      return;
    }

    setNewFiles((prevState) => [...prevState, ...uniqueFiles]);

    const blobUrls = uniqueFiles.map((file) => URL.createObjectURL(file));
    setProfileEdit((prevData) => ({
      ...prevData,
      profilePicture: blobUrls[0], // Replace with the new blob URL
    }));
  };

  // File deletion handler
  const deleteFile = (fileUrl) => {
    if (!fileUrl) return;

    const isFirebaseUrl = fileUrl.startsWith("http");

    if (isFirebaseUrl) {
      setDeletedFiles((prevState) => [...prevState, fileUrl]);
    }

    setProfileEdit((prevData) => ({
      ...prevData,
      profilePicture: "",
    }));
setResetProfilePic(true)
    toast.info("File has been marked for deletion.");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    // Validation for firstName and lastName fields
    if (
      (name === "firstName" || name === "lastName") &&
      !/^[a-zA-Z\s]*$/.test(value)
    ) {
      return; // Prevent update if input contains invalid characters
    }

    setProfileEdit((prevData) => ({
      ...prevData,
      [name]: value, // Update the field dynamically based on the name
    }));

    // Clear any existing errors for the field
    setErrors((prevErrors) => {
      const { [name]: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
  };

  // Phone number change handler
  const handlePhoneChange = (phoneData) => {
    setProfileEdit((prevData) => ({
      ...prevData,
 
        phone: phoneData.number,
  
    }));
  };

  // Validation logic
  const validateFields = () => {
    const validationErrors = {};
    const { firstName, lastName, dob, phone, profilePicture } = profileEdit;

    if (!firstName) validationErrors.firstName = "First Name is required.";
    if (!lastName) validationErrors.lastName = "Last Name is required.";
    if (!dob) validationErrors.dob = "Date of Birth is required.";
    if (!phone)
      validationErrors.phone = "Phone number is required.";
    if (!profilePicture)
      validationErrors.profilePicture = "Profile picture is required.";

    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Form contains errors.");
      console.log(errors)
      return;
    }

    try {
      setIsSubmitting(true);

      // Handle deletions
      for (const fileUrl of deletedFiles) {
        const storageRef = ref(storage, fileUrl);
        try {
          await deleteObject(storageRef);
        } catch (error) {
          console.error(`Error deleting file: ${fileUrl}`);
        }
      }

      let profilePictureUrl = profileEdit.profilePicture;

      for (const file of newFiles) {
        const storageRef = ref(storage, `uploads/admin/${file.name}`);
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          profilePictureUrl = downloadURL;
          setProfileEdit((prevData) => ({
            ...prevData,
            profilePicture: downloadURL, // Replace blob URL with Firebase URL
          }));
        } catch (error) {
          toast.error(`Error uploading ${file.name}.`);
        }
      }

      const payload = {
        profilePicture: profilePictureUrl,
        firstName: profileEdit.firstName,
        lastName: profileEdit.lastName,
        dob: profileEdit.dob,
        phone: profileEdit.phone,
      };

      // Submit the data
      const res = await editProfile(payload);

      if (res?.statusCode === 200) {
        dispatch(adminProfileData())
        toast.success("Profile updated successfully.");
        setNewFiles([]);
        setDeletedFiles([]);
      } else {
        toast.error(res?.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

useEffect(() => {
  if (getAdminProfile?.data) {
    setProfileEdit((prevData) => ({
      ...prevData,
      profilePicture: getAdminProfile?.data.profilePicture || "",
      dob: getAdminProfile?.data?.dob || "",
      firstName: getAdminProfile?.data?.firstName || "",
      lastName: getAdminProfile?.data?.lastName || "",
      phone: getAdminProfile?.data?.phone || "",
    }));
  }

}, [getAdminProfile?.data]);
//  console.log(profileEdit.dob)
  return (
    <>
      <Header />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide bg-white">
          <AdminSidebar />
        </span>
      </div>

      <div className="font-poppins">
      <span className="flex items-center pt-16 md:ml-[16.5%] bg-white pb-6 sm:ml-[22%]">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-6 ml-9">
              Update Profile
            </p>
            <p className="mt-1 font-normal text-body ml-9 pr-[30%]">
              Please Review and Update Your Information
            </p>
          </span>
        </span>

        <div className=" mb-2 md:ml-[31.5%] md:mr-[16%] sm:ml-[26%] md:mt-12 mt-6 text-[20px] sm:mx-[6%] text-secondary">
          <span className="font-semibold text-secondary ">Personal Information</span>

          <div className="bg-white px-9 py-9 text-[16px] mb-20">
            <FileUpload
              label="Upload Profile Picture"
              acceptedFormats={{
                "image/png": [".png"],
                "image/jpeg": [".jpeg", ".jpg"],
              }}
              onFilesUploaded={(files) =>
                handleFileUpload(files, "profilePicture")
              }
              reset={resetProfilePic}
              setReset={setResetProfilePic}
              customClass=" border-dashed text-[14px]"
              value={profileEdit.profilePicture}
            />
            {errors.passportUpload && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.passportUpload}
              </p>
            )}
            {profileEdit.profilePicture && (
              <div className="relative">
                <ImageComponent
                  src={profileEdit.profilePicture}
                  className="w-24 h-24 rounded-xl border border-black mt-6"
                />
                <span
                  onClick={() =>
                    deleteFile(profileEdit.profilePicture, "profilePicture")
                  }
                  className="absolute text-primary top-1 left-[70px]  text-[20px] cursor-pointer rounded-md"
                >
                  <ImBin />
                </span>
              </div>
            )}
            <div className="flex flex-row items-start gap-4 mt-6 justify-between text-[14px] w-full">
              <span className="w-1/2">
                <span className="flex flex-col">
                  <span className="text-[14px] text-secondary ">
                    {" "}
                    First Name *
                  </span>{" "}
                  <CustomInput
                    name="firstName"
                    type="text"
                    className="mt-2 outline-none h-11 w-full rounded-md px-4 font-poppins text-body bg-input"
                    placeHodler="First Name"
                    onChange={handleInput}
                    value={profileEdit.firstName}
                    errors={errors.firstName}
                  />
                </span>
                <Register
                  imp="*"
                  name="dob"
                  type="date"
                  label="Date of Birth"
                  handleInput={handleInput}
                  value={profileEdit.dob ? new Date(profileEdit.dob).toISOString().split('T')[0] : ""}
                  errors={errors.dob}
                />
              </span>
              <span className="w-1/2">
                <span className="flex flex-col">
                  <span className="text-[14px] text-secondary ">
                    {" "}
                    Last Name *
                  </span>{" "}
                  <CustomInput
                    name="lastName"
                    type="text"
                    className="mt-2 outline-none h-11 rounded-md w-full px-4 font-poppins text-body bg-input"
                    placeHodler="Last Name"
                    onChange={handleInput}
                    value={profileEdit.lastName}
                    errors={errors.lastName}
                  />
                </span>
                <div className="mt-8">
                  <PhoneInputComponent
                    label="Phone Number"
                    phoneData={profileEdit.phone}
                    onPhoneChange={handlePhoneChange}
                  />
                </div>
              </span>
            </div>

            <div className="flex justify-end mt-12 text-[14px]">
              <span
                onClick={handleSubmit}
                className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
              >
              {isSubmitting ?  "Submitting" : "Submit"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfileEdit;
