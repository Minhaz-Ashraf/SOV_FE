import React, { useState } from "react";
import { check, logo } from "../assets";
import Footer from "../components/Footer";
import { BsKey } from "react-icons/bs";
import {
  hearAboutOption,
  studentSignUp,
  typeOfStudent,
} from "../constant/data";
import { Link, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Register from "../components/reusable/Register";
import { PhoneInputSignup } from "../components/reusable/PhoneInputComponent";
import ImageComponent, {
  CountrySelect,
  RadioInputComponent,
  SelectComponent,
} from "../components/reusable/Input";
import FormSection from "../components/reusable/FormSection";
import PasswordField from "../components/reusable/PasswordField";
import { useDispatch, useSelector } from "react-redux";

import PopUp from "../components/reusable/PopUp";
import MissingPage from "../components/MissingPage";

import VerifyPopUp from "../components/VerifyPopUp";
import { verifyEmail } from "../features/studentApi";
import { newStudentReg, resendStudentOtp } from "../features/authApi";

const SignUp = () => {
  const { countryOption } = useSelector((state) => state.general);
  const [studentRegister, setStudentRegister] = useState({
    email: "",
    firstName: "",
    lastName: "",
    country: "",
    phone: {
      code: "",
      number: "",
    },
    studentType: "online",
    hearAbout: "",
      password: "",
  });
  const [isPopUp, setIsPopUp] = useState(false);
  const [isVerifyingLoading, setIsVerifyingLoading] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
    studentType: "",
    email: "",
    firstName: "",
    lastName: "",
    hearAbout: "",
  });
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,16}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const PopUpOpen = () => {
    setIsPopUp(true);
  };
  const PopUpClose = () => {
    setIsPopUp(false);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name === "firstName" || name === "lastName") {
      const validName = value.replace(/[^a-zA-Z\s]/g, "");
      setStudentRegister((prevData) => ({
        ...prevData,
        [name]: validName,
      }));
    } else if (name === "email") {
      const validEmail = value.replace(/\s/g, "");
      setStudentRegister((prevData) => ({
        ...prevData,
        [name]: validEmail,
      }));
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setStudentRegister((prevData) => ({
        ...prevData,
        [name]: value.trim(),
      }));
    }

    setErrors((prevErrors) => {
      const { [name]: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
  };

  const handlePhoneChange = (phoneData) => {
    setStudentRegister((prevData) => ({
      ...prevData,
      phone: {
        code: phoneData.code,
        number: phoneData.number,
      },
    }));
  };

  const validateFields = () => {
    let isValid = true;
    let newErrors = {};

    if (!emailRegex.test(studentRegister.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (
      studentRegister.password.length < 10 ||
      !passwordRegex.test(studentRegister.password)
    ) {
      newErrors.password =
        "Password must be 10-16 characters long and include at least 1 letter, 1 number, and 1 special character.";
      isValid = false;
    }
    if (studentRegister.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
    if (!studentRegister.firstName) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    }
    if (!studentRegister.lastName) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    }
    if (!studentRegister.country) {
      newErrors.country = "Country is required.";
      isValid = false;
    }
    if (!studentRegister.phone.number || !studentRegister.phone.code) {
      newErrors.phone = "Phone number is required.";
      isValid = false;
    }
    if (!studentRegister.studentType) {
      newErrors.studentType = "Please select the student type.";
      isValid = false;
    }
    if (!studentRegister.hearAbout) {
      newErrors.hearAbout = "Please select how you heard about us.";
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
      const res = await verifyEmail(studentRegister.email, otp, studentRegister.password);
      VerifyPopUpClose();

      if (res.data.statusCode === 201) {
        PopUpOpen();
      }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    console.log("Form is valid, proceed with submission.");

    const { phone, ...rest } = studentRegister;

    const payload = {
      ...rest,
      code: phone.code,
      number: phone.number,
    };

    try {
      const res = await newStudentReg(payload);
      toast.success(res.message || "Registration completed!");
      // console.log(res)
      return res;
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
      toast.error("Error in form fields");
    }
  };
  const OtpResend = async () => {
    try {
      const res = await resendStudentOtp(studentRegister.email);
      toast.success(res?.message || "Otp sent successfully");
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
                <ImageComponent
                  src={logo}
                  alt="logo"
                  className="w-40 h-24 ml-6"
                />
              </header>
              <p className="text-heading font-semibold text-[30px] md:px-16 sm:px-8 pt-7">
                Signup as Student
              </p>
              <p className="text-secondary font-normal text-[14px] md:px-16 sm:px-8 pr-40">
                Sign up now and begin your global education journey!
              </p>
              <span className="bg-white rounded-xl px-8 py-4 pb-12 md:mx-16 sm:mx-8 mt-6">
                <Register
                  imp="*"
                  name="email"
                  type="email"
                  label="Email Id"
                  handleInput={handleInput}
                  value={studentRegister.email}
                  errors={errors.email}
                />

                <Register
                  imp="*"
                  name="firstName"
                  type="text"
                  label="First Name"
                  handleInput={handleInput}
                  value={studentRegister.firstName}
                  errors={errors.firstName}
                />
                <Register
                  imp="*"
                  name="lastName"
                  type="text"
                  label="Last Name"
                  handleInput={handleInput}
                  value={studentRegister.lastName}
                  errors={errors.lastName}
                />
                <CountrySelect
                  name="country"
                  label="Country"
                  customClass="bg-input"
                  options={countryOption}
                  value={studentRegister.country}
                  handleChange={handleInput}
                />
                {errors.country && (
                  <p className="text-red-500 mt-1 text-sm">{errors.country}</p>
                )}
                <div className="mt-8">
                  <PhoneInputSignup
                    phoneData={studentRegister.phone}
                    onPhoneChange={handlePhoneChange}
                  />
                  {errors.phone && (
                    <p className="text-red-500 mt-1 text-sm">{errors.phone}</p>
                  )}
                </div>
                <div className="text-secondary text-[14px] mt-6 ">
                  Student Type *
                  <RadioInputComponent
                    name="studentType"
                    options={typeOfStudent}
                    selectedValue={studentRegister.studentType}
                    handleChange={handleInput}
                    customClass="flex flex-row mt-3 justify-start gap-7 w-full font-poppins "
                    radioClass="border rounded-md px-6 py-2 w-64 bg-input"
                    label="Student Type"
                  />
                  {errors.studentType && (
                    <p className="text-red-500 mt-1 text-sm">
                      {errors.studentType}
                    </p>
                  )}
                </div>
                <SelectComponent
                  name="hearAbout"
                  label="How did you hear about us?"
                  options={hearAboutOption}
                  value={studentRegister.typeOfStudent}
                  handleChange={handleInput}
                />
                {errors.hearAbout && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.hearAbout}
                  </p>
                )}
              </span>

              <FormSection
                icon={<BsKey />}
                title="Password Information"
                customClass="mx-16 mt-7"
              />

              <span className="bg-white rounded-xl px-8 py-8 pb-12 md:mx-16 sm:mx-8 -mt-6   mb-16">
                <PasswordField
                  name="password"
                  value={studentRegister.password}
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
                <div
                  onClick={VerifyPopUpOpen}
                  className="bg-primary text-center mt-6 rounded-md text-white px-6 py-2 cursor-pointer"
                >
               {isVerifyingLoading ?"Sending Otp..." : "Verify"}
                </div>
                <p className="text-body text-sm pt-3">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span className="text-primary font-medium">Log in </span>
                  </Link>
                </p>
              </span>
            </div>

            <div className=" bg-primary w-[50%]">
              <div className="text-white md:mx-24 sm:mx-8 fixed">
                <p className=" font-semibold text-[27px]  pt-28">
                  Welcome to SOV Portal
                </p>
                <p className=" font-medium text-[18px] ">
                  Your one-stop solution for studying abroad
                </p>
                <p className=" font-extralight text-[13px] pt-1 ">
                  Start your study abroad adventure with us. Whether your sights
                  are set on the US, UK, Canada, or beyond, SOV Portal can help
                  turn your international education dreams into reality. Sign up
                  today and take the first stride towards a successful future.
                </p>
                <div className="border border-[#CC0000] bg-[#A20F11] px-6 py-3 pb-10 mt-6 mb-16 rounded-md">
                  {studentSignUp.map((data, index) => (
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
            email={studentRegister.email}
          />
          <PopUp
            src={check}
            PopUpClose={PopUpClose}
            isPopUp={isPopUp}
            text="  Your information has been received and is being verified. Once verified, we'll send your email and password to the email address you provided."
            heading="Thank You for Signing Up your Account !"
          />
        </>
      ) : (
        <MissingPage />
      )}
    </>
  );
};

export default SignUp;
