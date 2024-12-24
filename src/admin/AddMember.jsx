import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import { ImBin } from "react-icons/im";
import ImageComponent, {
  CountrySelect,
  CustomInput,
  CustomTextArea,
  SelectComponent,
} from "../components/reusable/Input";
import FileUpload from "../components/reusable/DragAndDrop";
import Register from "../components/reusable/Register";
import PhoneInputComponent from "../components/reusable/PhoneInputComponent";
import { addTeam, editProfile } from "../features/adminApi";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../utils/fireBase";
import { useDispatch, useSelector } from "react-redux";
import {
  adminProfileData,
  getAllTeamData,
  getMemberProfile,
  setEmptyMemberInput,
} from "../features/adminSlice";
import PasswordField from "../components/reusable/PasswordField";
import FormSection from "../components/reusable/FormSection";
import { BsKey } from "react-icons/bs";
import { genderOption, maritalOption } from "../constant/data";
import { useLocation } from "react-router-dom";
import { editTeam } from "./../features/adminApi";
import { useNavigate } from "react-router-dom";

const AddMember = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const id = location?.state?.id;
  const [memberData, setMemberData] = useState({
    profilePicture: "",
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
    doj: "",
    gender: "",
    maritalStatus: "",
    password: "",
  });

  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetProfilePic, setResetProfilePic] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const { countryOption } = useSelector((state) => state.general);
  const { getMember } = useSelector((state) => state.admin);
  const [isEdit, setEdit] = useState(location?.state?.edit);
  const [isEmailEdit, setEmailEdit] = useState(location?.state?.edit);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  // File upload handler
  useEffect(() => {
    dispatch(getMemberProfile(id));
  }, [id]);
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
    setMemberData((prevData) => ({
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

    setMemberData((prevData) => ({
      ...prevData,
      profilePicture: "",
    }));
    setResetProfilePic(true);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      const validName = value.replace(/[^a-zA-Z\s]/g, "");
      setMemberData((prevData) => ({
        ...prevData,
        [name]: validName,
      }));
    } else if (name === "email") {
      const validEmail = value.trim();
      setMemberData((prevData) => ({
        ...prevData,
        [name]: validEmail,
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      // General case for other fields
      setMemberData((prevData) => ({
        ...prevData,
        [name]: value.trim(),
      }));
    }

    setErrors((prevErrors) => {
      const { [name]: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
  };

  // Phone number change handler
  const handlePhoneChange = (phoneData) => {
    setMemberData((prevData) => ({
      ...prevData,

      phone: phoneData.number,
    }));
  };
  const handleEdit = () => {
    setEdit("noEdit");
  };
  const handleEmailEdit = () => {
    setEmailEdit("noEdit");
  };
  // Validation logic
  const validateFields = () => {
    const validationErrors = {};
    const {
      firstName,
      lastName,
      dob,
      phone,
      profilePicture,
      password,
      address,
      country,
      state,
      city,
      zipcode,
      doj,
      gender,
      maritalStatus,
      email,
    } = memberData;

    // Required fields validation
    if (!firstName) validationErrors.firstName = "First Name is required.";
    if (!lastName) validationErrors.lastName = "Last Name is required.";
    if (!dob) validationErrors.dob = "Date of Birth is required.";
    if (!phone) validationErrors.phone = "Phone number is required.";
    if (!address) validationErrors.address = "Address is required.";
    if (!country) validationErrors.country = "Country is required.";
    if (!state) validationErrors.state = "State is required.";
    if (!city) validationErrors.city = "City is required.";
    if (!zipcode) validationErrors.zipcode = "Zipcode is required.";
    if (!doj) validationErrors.doj = "Date of Joining (DOJ) is required.";
    if (!gender) validationErrors.gender = "Gender is required.";
    if (!maritalStatus)
      validationErrors.maritalStatus = "Marital Status is required.";
    if (!profilePicture)
      validationErrors.profilePicture = "Profile picture is required.";

    // Email validation

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      validationErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      validationErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (isEdit !== "edit") {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,16}$/;

      if (!password) {
        validationErrors.password = "Password is required.";
      } else if (!passwordRegex.test(password)) {
        validationErrors.password =
          "Password must be 10-16 characters long and include at least 1 letter, 1 number, and 1 special character.";
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        validationErrors.confirmPassword = "Passwords do not match.";
      }
    }

    return validationErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields");
      console.log(errors);
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

      let profilePictureUrl = memberData.profilePicture;

      for (const file of newFiles) {
        const storageRef = ref(storage, `uploads/admin/${file.name}`);
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          profilePictureUrl = downloadURL;
          setMemberData((prevData) => ({
            ...prevData,
            profilePicture: downloadURL,
          }));
        } catch (error) {
          toast.error(`Error uploading ${file.name}.`);
        }
      }

      const payload = {
        profilePicture: profilePictureUrl,
        firstName: memberData.firstName,
        lastName: memberData.lastName,
        dob: memberData.dob,
        phone: memberData.phone,
        gender: memberData.gender,
        maritalStatus: memberData.maritalStatus,
        dateOfJoining: memberData.doj,
        residenceAddress: {
          address: memberData.address,
          country: memberData.country,
          state: memberData.state,
          city: memberData.city,
          zipcode: memberData.zipcode,
        },
        // Add password only if not in edit mode
        ...(isEdit !== "edit" && { password: memberData.password }),
        ...(isEmailEdit !== "edit" && { email: memberData.email }),
      };

      // Submit the data
      const res =
        location?.state?.edit === "edit"
          ? await editTeam(payload, id)
          : await addTeam(payload);

      dispatch(getAllTeamData());
      toast.success(res?.message || "Profile updated successfully.");
      setNewFiles([]);
      setDeletedFiles([]);
      dispatch(setEmptyMemberInput());
      navigate("/admin/team-members");
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (getMember?.data) {
      setMemberData((prevData) => ({
        ...prevData,

        profilePicture: getMember?.data.profilePicture || "",
        dob: getMember?.data?.dob || "",
        doj: getMember?.data?.dateOfJoining || "",

        firstName: getMember?.data?.firstName || "",
        lastName: getMember?.data?.lastName || "",
        phone: getMember?.data?.phone || "",
        maritalStatus: getMember?.data?.maritalStatus || "",
        gender: getMember?.data?.gender || "",
        email: getMember?.data?.email || "",
        address: getMember?.data?.residenceAddress?.address,
        country: getMember?.data?.residenceAddress?.country,
        state: getMember?.data?.residenceAddress?.state,
        city: getMember?.data?.residenceAddress?.city,

        zipcode: getMember?.data?.residenceAddress?.zipcode,
      }));
    }
  }, [getMember?.data]);
  useEffect(() => {
    console.log("Checking getMember?.Data:", getMember?.Data);

    if (!getMember?.Data || getMember?.Data.length === 0) {
      console.log("Resetting to add mode as getMember?.Data is empty");

      setMemberData({
        profilePicture: "",
        dob: "",
        doj: "",
        firstName: "",
        lastName: "",
        phone: "",
        maritalStatus: "",
        gender: "",
        email: "",
        address: "",
        country: "",
        state: "",
        city: "",
        zipcode: "",
        password: "",
      });

      dispatch(setEmptyMemberInput());
    }
  }, [getMember?.Data, dispatch]);

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
              Member Form
            </p>
            <p className="mt-1 font-normal text-body ml-9 ">
              Fill the details of a new member to register them.
            </p>
          </span>
        </span>

        <div className=" mb-2 md:ml-[31.5%] md:mr-[16%] sm:ml-[26%] md:mt-12 mt-6 text-[20px] sm:mx-[6%] text-secondary">
          <span className="font-semibold text-secondary ">
            Personal Information
          </span>

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
              value={memberData.profilePicture}
            />

            {memberData.profilePicture && (
              <div className="relative">
                <ImageComponent
                  src={memberData.profilePicture}
                  className="w-24 h-24 rounded-xl border border-black mt-6"
                />
                <span
                  onClick={() =>
                    deleteFile(memberData.profilePicture, "profilePicture")
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
                    value={memberData.firstName}
                    errors={errors.firstName}
                  />
                </span>
                <Register
                  imp="*"
                  name="dob"
                  type="date"
                  label="Date of Birth"
                  handleInput={handleInput}
                  value={
                    memberData.dob
                      ? new Date(memberData.dob).toISOString().split("T")[0]
                      : ""
                  }
                  errors={errors.dob}
                />
                <SelectComponent
                  name="maritalStatus"
                  label="Marital Status"
                  options={maritalOption}
                  value={memberData.maritalStatus}
                  handleChange={handleInput}
                />
                {errors.memberData && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.memberData}
                  </p>
                )}
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
                    value={memberData.lastName}
                    errors={errors.lastName}
                  />
                </span>
                <div>
                  {isEmailEdit !== "edit" && (
                    <>
                      <Register
                        imp="*"
                        name="email"
                        type="text"
                        label="Email"
                        handleInput={handleInput}
                        value={memberData.email}
                        errors={errors.email}
                      />
                    </>
                  )}
                  {isEmailEdit === "edit" && (
                    <div
                      onClick={handleEmailEdit}
                      className=" border rounded-md text-primary px-3 mt-14 py-2 text-[14px] cursor-pointer border-primary"
                    >
                      {" "}
                      Edit Email
                    </div>
                  )}
                </div>
                <SelectComponent
                  name="gender"
                  label="Gender"
                  options={genderOption}
                  value={memberData.gender}
                  handleChange={handleInput}
                />
                {errors.memberData && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.memberData}
                  </p>
                )}
              </span>
            </div>
            <div className="-mt-6">
              <Register
                imp="*"
                name="doj"
                type="date"
                label="Date of Joininng"
                handleInput={handleInput}
                value={
                  memberData.doj
                    ? new Date(memberData.doj).toISOString().split("T")[0]
                    : ""
                }
                errors={errors.doj}
              />
            </div>
            <div className="mt-3">
              <PhoneInputComponent
                label="Phone Number"
                phoneData={memberData.phone}
                onPhoneChange={handlePhoneChange}
              />
            </div>
          </div>
          <FormSection
            icon={<BsKey />}
            title="Recindence Address"
            customClass="-mt-14"
          />
          <div className="bg-white rounded-xl px-8 py-8 pb-12  -mt-9  mb-16">
            <Register
              imp="*"
              name="address"
              type="text"
              label="Address"
              handleInput={handleInput}
              value={memberData.address}
              errors={errors.address}
            />
            <div className="-mt-4">
              <CountrySelect
                name="country"
                label="Country"
                customClass="bg-input placeholder text-[16px]"
                options={countryOption}
                value={memberData.country}
                handleChange={handleInput}
              />
              {errors.country && (
                <p className="text-red-500 mt-1 text-sm">{errors.country}</p>
              )}
            </div>
            <Register
              imp="*"
              name="state"
              type="text"
              label="Province/State"
              handleInput={handleInput}
              value={memberData.state}
              errors={errors.state}
            />
            <Register
              imp="*"
              name="city"
              type="text"
              label="City/Town"
              handleInput={handleInput}
              value={memberData.city}
              errors={errors.city}
            />
            <Register
              imp="*"
              name="zipcode"
              type="number"
              label="Postal/Zip Code"
              handleInput={handleInput}
              value={memberData.zipcode}
              errors={errors.zipcode}
            />
          </div>
          <div className="flex items-center">
            <FormSection
              icon={<BsKey />}
              title="Password Information"
              customClass="-mt-14"
            />
            {isEdit === "edit" && (
              <span
                onClick={handleEdit}
                className="-mt-14 border rounded-md text-primary px-3 py-2 text-[14px] cursor-pointer border-primary"
              >
                {" "}
                Edit Password
              </span>
            )}
          </div>

          {isEdit !== "edit" && (
            <>
              <div className="bg-white rounded-xl px-8 py-8 pb-12  -mt-9  mb-16">
                <PasswordField
                  name="password"
                  value={memberData.password}
                  handleInput={handleInput}
                  label="Password"
                  showPassword={showPassword}
                  toggleVisibility={togglePasswordVisibility}
                  error={errors.password}
                />
                <div className="mt-6">
                  <PasswordField
                    name="confirmPassword"
                    label="Confirm Password"
                    value={confirmPassword}
                    handleInput={handleInput}
                    showPassword={showConfirmPassword}
                    toggleVisibility={toggleConfirmPasswordVisibility}
                    error={errors.confirmPassword}
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end mt-12 text-[14px] mb-20">
            <span
              onClick={handleSubmit}
              className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddMember;
