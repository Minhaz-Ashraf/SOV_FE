import React, { useState } from "react";
import { check, logo } from "../assets";
import Footer from "../components/Footer";
import { BsKey } from "react-icons/bs";
import { agentSignUp } from "../constant/data";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Register from "../components/reusable/Register";
import PhoneInputComponent from "../components/reusable/PhoneInputComponent";
import ImageComponent, { CountrySelect } from "../components/reusable/Input";
import FormSection from "../components/reusable/FormSection";
import PasswordField from "../components/reusable/PasswordField";
import { useDispatch, useSelector } from "react-redux";
import PopUp from "../components/reusable/PopUp";
import { FaRegAddressCard } from "react-icons/fa6";
import MissingPage from "../components/MissingPage";
import {
  newAgentReg,
  resendAgentOtp,
  verifyAgentEmail,
} from "../features/authApi";
import VerifyPopUp from "../components/VerifyPopUp";

const AgentSignUp = () => {
  const [agentRegister, setAgentRegister] = useState({
    companyDetails: {
      companyName: "",
      // tradeName: "",
      address: "",
      country: "",
      province: "",
      city: "",
      postalCode: "",
    },
    founderOrCeo: {
      email: "",
      phone: "",
    },
    primaryContactPerson: {
      name: "",
      email: "",
      phone: "",
    },
    password: "",
  });
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const { countryOption } = useSelector((state) => state.general);
  const [isPopUp, setIsPopUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVerifyingLoading, setIsVerifyingLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const location = useLocation();
  const [errors, setErrors] = useState({
    companyName: "",
    address: "",
    country: "",
    province: "",
    city: "",
    postalCode: "",
    email: "",
    phone: "",
    primaryEmail:"",
    password: "",
  });

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,16}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const PopUpOpen = () => setIsPopUp(true);
  const PopUpClose = () => setIsPopUp(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;
    if (name.includes("email")) {
      sanitizedValue = sanitizedValue.replace(/\s/g, "");
    }
    if (name === "primaryContactPerson.name") {
      sanitizedValue = sanitizedValue.replace(/[^a-zA-Z\s]/g, "");
    }
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setAgentRegister((prevData) => ({
        ...prevData,
        [section]: {
          ...prevData[section],
          [field]: sanitizedValue,
        },
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(sanitizedValue);
    } else {
      setAgentRegister((prevData) => ({
        ...prevData,
        [name]: sanitizedValue,
      }));
    }

    setErrors((prevErrors) => {
      const { [name]: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
  };

  const handlePhoneChange = (phoneData, person) => {
    setAgentRegister((prevData) => ({
      ...prevData,
      [person]: {
        ...prevData[person],
        phone: phoneData.number,
      },
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      phone: "",
    }));
  };

  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!emailRegex.test(agentRegister.founderOrCeo.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (
      agentRegister.password.length < 10 ||
      !passwordRegex.test(agentRegister.password)
    ) {
      newErrors.password =
        "Password must be 10-16 characters long and include at least 1 letter, 1 number, and 1 special character.";
      isValid = false;
    }
    if (agentRegister.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
    if (!agentRegister.companyDetails.companyName) {
      newErrors.companyName = "Company legal name is required.";
      isValid = false;
    }

    if (!agentRegister.primaryContactPerson.name) {
      newErrors.name = "Primary contact name is required.";
      isValid = false;
    }
    if (!agentRegister.primaryContactPerson.email) {
      newErrors.primaryEmail = "Primary contact email is required.";
      isValid = false;
    }
    if (!agentRegister.companyDetails.country) {
      newErrors.country = "Country is required.";
      isValid = false;
    }
    if (!agentRegister.companyDetails.province) {
      newErrors.province = "Province is required.";
      isValid = false;
    }
    if (!agentRegister.companyDetails.city) {
      newErrors.city = "City is required.";
      isValid = false;
    }
    if (!agentRegister.companyDetails.postalCode) {
      newErrors.postalCode = "Zip/Postal Code is required.";
      isValid = false;
    }
    if (!agentRegister.founderOrCeo.phone) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    }
    if (!agentRegister.companyDetails.address) {
      newErrors.address = "Address is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const VerifyPopUpClose = () => {
    setIsVerifyOpen(false);
  };
  const handleVerify = async (otp) => {
    try {
      const res = await verifyAgentEmail(agentRegister.founderOrCeo.email, otp, agentRegister.password);
      VerifyPopUpClose();
      // if(res.data.statusCode === 201){
      setTimeout(() => {
        PopUpOpen();
      }, 2000);
      // }

      return res;
    } catch (error) {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };
  const handleSubmit = async () => {
    const payload = {
      companyDetails: {
        companyName: agentRegister.companyDetails.companyName,
        // tradeName: agentRegister.companyDetails.tradeName,
        address: agentRegister.companyDetails.address,
        country: agentRegister.companyDetails.country,
        province: agentRegister.companyDetails.province,
        city: agentRegister.companyDetails.city,
        postalCode: agentRegister.companyDetails.postalCode,
      },
      accountDetails: {
        founderOrCeo: {
          email: agentRegister.founderOrCeo.email,
          phone: agentRegister.founderOrCeo.phone,
        },
        primaryContactPerson: {
          name: agentRegister.primaryContactPerson.name,
          email: agentRegister.primaryContactPerson.email,
          phone: agentRegister.primaryContactPerson.phone,
        },
      },
      password: agentRegister.password,
    };
    try {
      const res = await newAgentReg(payload);
      console.log(res);

      if (res.success) {
        toast.success(res.message || "Registration completed!");
        return res;
      } else {
        // Handle validation errors if the `success` flag is false
        if (res.message && Array.isArray(res.message)) {
          const formattedErrors = res.message.map((error) => error.message).join(", ");
          toast.error(`Validation Errors: ${formattedErrors}`);
        } else {
          toast.error(res.message || "Something went wrong.");
        }
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setIsVerifyingLoading(false);

      toast.error(error?.message || "Something went wrong");
    }
  };

  const VerifyPopUpOpen = async () => {
    if (validateFields()) {
      setIsVerifyingLoading(true);

      const res = await handleSubmit();

      console.log("Form is valid, proceed with submission.");
      if (res.statusCode === 200) {
        setIsVerifyingLoading(false);

        setIsVerifyOpen(true);
      }
    } else {
      console.log("Form has errors.");
      toast.error("Please fill al required fields");
    }
  };

  const OtpResend = async () => {
    try {
      const res = await resendAgentOtp(agentRegister.founderOrCeo.email);
      toast.success(res.message || "Otp sent successfully");
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <>
      {location.state === "passPage" ? (
        <>
          <div className="flex flex-row w-full min-h-screen font-poppins">
            <div className="flex flex-col w-[50%]">
              <header>
                {/* Replace logo with the actual logo component */}
                <img src={logo} alt="logo" className="w-40 h-24 ml-6" />
              </header>
              <p className="text-heading font-semibold text-[30px] md:px-16 sm:px-8  pt-7">
                Signup as Agent
              </p>
              <p className="text-secondary font-normal text-[14px] md:px-16 sm:px-8 pr-40">
                Sign up now and begin your global education journey!
              </p>
              <span className="bg-white rounded-xl px-8 py-4 pb-12 md:mx-16 sm:mx-8  mt-6">
                <p className="font-medium mt-6 -mb-3">Company Details</p>

                <Register
                  name="companyDetails.companyName"
                  type="text"
                  imp="*"
                  label="Company Name"
                  handleInput={handleInput}
                  value={agentRegister.companyDetails.companyName}
                  errors={errors.companyName}
                />
                {/* <Register
                  name="companyDetails.tradeName"
                  type="text"
                  label="Company Alternate Name"
                  handleInput={handleInput}
                  value={agentRegister.companyDetails.tradeName}
                  errors={errors.tradeName}
                /> */}
                <Register
                  name="primaryContactPerson.name"
                  type="text"
                  imp="*"
                  label="Primary Contact Name"
                  handleInput={handleInput}
                  value={agentRegister.primaryContactPerson.name}
                  errors={errors.name}
                />
                <Register
                  name="companyDetails.address"
                  type="text"
                  label="Address"
                  handleInput={handleInput}
                  value={agentRegister.companyDetails.address}
                  errors={errors.address}
                  imp="*"
                />
                <div className="flex flex-row items-center justify-between gap-6">
                  <span className="w-[50%]">
                    <CountrySelect
                      name="companyDetails.country"
                      label="Country"
                      options={countryOption}
                      value={agentRegister.companyDetails.country}
                      handleChange={handleInput}
                      customClass="bg-input"
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm">{errors.country}</p>
                    )}

                    <Register
                      name="companyDetails.city"
                      type="text"
                      label="City"
                      handleInput={handleInput}
                      value={agentRegister.companyDetails.city}
                      errors={errors.city}
                      imp="*"
                    />
                  </span>
                  <span className="w-[50%]">
                    <Register
                      name="companyDetails.province"
                      type="text"
                      label="Province/State"
                      handleInput={handleInput}
                      value={agentRegister.companyDetails.province}
                      errors={errors.province}
                      imp="*"
                    />
                    <Register
                      name="companyDetails.postalCode"
                      type="number"
                      label="Zip/Postal Code"
                      handleInput={handleInput}
                      value={agentRegister.companyDetails.postalCode}
                      errors={errors.postalCode}
                      imp="*"
                    />
                  </span>
                </div>
              </span>
              {/* Account Details Section */}
              <FormSection
                icon={<FaRegAddressCard />}
                title="Account Details"
                customClass="mx-16 mt-7"
              />
              <span className="bg-white rounded-xl px-8 py-4 pb-12 md:mx-16 sm:mx-8  -mt-6 my-2">
                <p className="font-medium mt-6">
                  Founder/CEO/Owner of the Company
                </p>
                <div className="flex flex-row items-center justify-between gap-6">
                  <span className="w-[50%]">
                    <Register
                      name="founderOrCeo.email"
                      type="email"
                      label="Email Id"
                      handleInput={handleInput}
                      value={agentRegister.founderOrCeo.email}
                      errors={errors.email}
                      imp="*"
                    />
                  </span>
                  <div className="w-[50%] mt-5">
                    <PhoneInputComponent
                      phoneData={agentRegister.founderOrCeo.phone}
                      onPhoneChange={(phoneData) =>
                        handlePhoneChange(phoneData, "founderOrCeo")
                      }
                      label="Phone"
                    />
                    {errors.phone && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <p className="font-medium mt-6">Primary Contact Person</p>
                <div className="flex flex-row items-center justify-between gap-6 w-full">
                  <span className="w-[50%]">
                    <Register
                      name="primaryContactPerson.email"
                      type="email"
                      label="Email Id"
                      handleInput={handleInput}
                      value={agentRegister.primaryContactPerson.email}
                      errors={errors.primaryEmail}
                      imp="*"
                    />
                  </span>
                  <div className="w-[50%] mt-5">
                    <PhoneInputComponent
                    notImp={true}
                      phoneData={agentRegister.primaryContactPerson.phone}
                      onPhoneChange={(phoneData) =>
                        handlePhoneChange(phoneData, "primaryContactPerson")
                      }
                      label="Phone"
                    />
                    {errors.phone && (
                      <p className="text-red-500 mt-1 text-sm">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </span>
              {/* Password Information Section */}
              <FormSection
                icon={<BsKey />}
                title="Password Information"
                customClass="mx-16 mt-7"
              />
              <div className="bg-white rounded-xl px-8 py-8 pb-12 md:mx-16 sm:mx-8  -mt-6 mb-16">
                <PasswordField
                  name="password"
                  label="Password"
                  value={agentRegister.password}
                  handleInput={handleInput}
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
                <div
                  onClick={VerifyPopUpOpen}
                  className="bg-primary text-center mt-6 rounded-md text-white px-6 py-2 cursor-pointer"
                >
                  {isVerifyingLoading ? "Sending Otp..." : "Verify"}
                </div>
                <p className="text-body text-sm pt-3">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span className="text-primary font-medium">Log in </span>
                  </Link>
                </p>
              </div>
            </div>
            <div className=" bg-primary w-[50%]">
              <div className="text-white md:mx-24 sm:mx-8 fixed">
                <p className=" font-semibold text-[27px]  pt-28">
                  Welcome to SOV Portal
                </p>
                <p className=" font-medium text-[18px] ">
                  Your partner in student recruitment{" "}
                </p>
                <p className=" font-extralight text-[13px] pt-1 ">
                  SOV Portal leverage and cutting-edge technology to streamline
                  global education journeys and simplify the study abroad
                  process. Our platform offers multiple ways to connect with
                  students, helping you grow your business while guiding
                  learners worldwide.
                </p>
                <div className="border border-[#CC0000] bg-[#A20F11] px-6 py-3 pb-10 mt-6 mb-16 rounded-md">
                  {agentSignUp.map((data, index) => (
                    <div
                      key={index}
                      className="flex flex-row gap-6 mt-6 items-center"
                    >
                      <ImageComponent
                        src={data.src}
                        className="w-16 h-16 rounded-md"
                      />
                      <p className="font-light text-white text-[14px]">
                        {data.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <footer>
            <Footer />
          </footer>
          <VerifyPopUp
            isVerifyOpen={isVerifyOpen}
            VerifyPopUpClose={VerifyPopUpClose}
            handleVerify={(otp) => handleVerify(otp)}
            OtpResend={() => OtpResend()}
            email={agentRegister.founderOrCeo.email}
          />
          <PopUp
            src={check}
            PopUpClose={PopUpClose}
            isPopUp={isPopUp}
            text=" Your information has been received and is being verified. Once verified, we'll send your email and password to the email address you provided."
            heading="Thank You for Signing Up your Account !"
          />
        </>
      ) : (
        <MissingPage />
      )}
    </>
  );
};

export default AgentSignUp;
