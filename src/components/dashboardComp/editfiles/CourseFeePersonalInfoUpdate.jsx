import React, { useEffect, useState } from "react";
import { FaRegIdCard } from "react-icons/fa";
import { TbPencilMinus } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { CountrySelect } from "../../reusable/Input";
import Register from "../../reusable/Register";
import PhoneInputComponent from "../../reusable/PhoneInputComponent";
import { allApplication } from "../../../features/agentSlice";
import {  OfferLetterPersonalInfoEdit, updateVisaPersonalInfo } from "../../../features/generalApi";
import { toast } from "react-toastify";

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

const CourseFeePersonalInfoUpdate = ({appId, updatedData, profileViewPath}) => {
  const {applicationDataById}  = useSelector((state)=> state.agent)
  const [isOne, setIsOne] = useState(false);
  const [courseFee, setCourseFee] = useState({
    personalDetails: { ...initialPersonalInfo },
  });

  const [errors, setErrors] = useState({}); 
    const dispatch = useDispatch();
    const { countryOption} = useSelector(
        (state) => state.general
    );
    useEffect(() => {
    dispatch(allApplication());
    
  }, [dispatch]);

  useEffect(() => {
    if (applicationDataById) {
      setCourseFee({
        personalDetails: {
          fullName: applicationDataById?.courseFeeApplication?.personalDetails?.fullName || "",
          email: applicationDataById?.courseFeeApplication?.personalDetails?.email || "",
          phoneNumber: applicationDataById?.courseFeeApplication?.personalDetails?.phoneNumber || "",
          address: {
            street: applicationDataById?.courseFeeApplication?.personalDetails?.address?.street || "",
            city: applicationDataById?.courseFeeApplication?.personalDetails?.address?.city || "",
            state: applicationDataById?.courseFeeApplication?.personalDetails?.address?.state || "",
            postalCode: applicationDataById?.courseFeeApplication?.personalDetails?.address?.postalCode || "",
            country: applicationDataById?.courseFeeApplication?.personalDetails?.address?.country || "",
          },
        },
      });
    }
  }, [applicationDataById]);

  const handleOneToggle = () => {
    setIsOne((prev) => !prev); // Toggle the form visibility
  };

  const handleCancelOne = () => {
    setIsOne(false); 
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    setCourseFee((prevState) => {
      let updatedState = { ...prevState };
      let stateLevel = updatedState;

      for (let i = 0; i < nameParts.length - 1; i++) {
        stateLevel = stateLevel[nameParts[i]];
      }

      stateLevel[nameParts[nameParts.length - 1]] = value;

      return updatedState;
    });
  };

  const handlePhoneChange = (phoneNumber) => {
    setCourseFee((prevState) => ({
      ...prevState,
      personalDetails: {
        ...prevState.personalDetails,
        phoneNumber: phoneNumber.number,
      },
    }));
  };
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
      !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(
        courseFee.personalDetails.email
      )
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
    }
    if (!courseFee.personalDetails.address.country?.trim()) {
      errors.country = "Country is required.";
    }
    return errors;
  };
  const handleSubmit = async() => {
 
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid");
    } else {
      setErrors(validationErrors);
      toast.error("Form contains errors");
      console.log("Form has errors", validationErrors);
    }
    try{
      const payload = {
         fullName: courseFee.personalDetails.fullName,
         phoneNumber: courseFee.personalDetails.phoneNumber,
         email: courseFee.personalDetails.email,
         address: courseFee.personalDetails.address
      }

      const res = await OfferLetterPersonalInfoEdit(appId, payload, "courseFeeApplication")
      toast.success(res.message || "Data Added successfully");
      updatedData()
      handleCancelOne();

    }catch(error){
      toast.error(error.message ||"Something went wrong")
      console.log(error)
    }
  };

  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <FaRegIdCard />
            </span>
            <span className="font-semibold text-[22px]">
              Personal Information
            </span>
          </span>
          {/* Pencil icon visible only when the form is hidden */}
             {profileViewPath  ? "" :
            !isOne && (
            <span
              className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
              onClick={handleOneToggle}
              style={{ opacity: !isOne ? 1 : 0 }}
            >
              <TbPencilMinus />
            </span>
          )}
        </div>

        {/* Information Display */}
        <div className="flex flex-row w-full justify-between mt-6">
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light">Full Name </span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.personalDetails?.fullName || "NA"}
            </span>
            <span className="font-light mt-4">Phone Number</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.personalDetails?.phoneNumber || "NA"}
            </span>
            <span className="font-light mt-4">Province/State</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.personalDetails?.address?.state || "NA"}
            </span>
            <span className="font-light mt-4">Postal/Zip Code</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.personalDetails?.address?.postalCode || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Email ID</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.personalDetails?.email || "NA"}
            </span>
            <span className="font-light mt-4">Country</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.personalDetails?.address?.country || "NA"}
            </span>
            <span className="font-light mt-4">Address</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.personalDetails?.address?.street || "NA"}
            </span>
            <span className="font-light mt-4">City/Town</span>
            <span className="font-medium">
              {applicationDataById?.courseFeeApplication?.personalDetails?.address?.city || "NA"}
            </span>
          </span>
        </div>

        {/* Editable Form Section */}
        <div
          className={`transition-all duration-500 ease-in-out transform ${
            isOne
              ? "min-h-[100vh] translate-y-0 opacity-100"
              : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
          }`}
        >
          {isOne && (
            <div className="mt-4">
              <Register
                imp="*"
                name="personalDetails.fullName"
                type="text"
                label="Full Name"
                handleInput={handleInput}
                value={courseFee.personalDetails.fullName}
                errors={errors.fullName}
              />
              <span className="flex items-center justify-between w-full gap-4">
              <span className="w-1/2">
              <Register
                imp="*"
                name="personalDetails.email"
                type="email"
                label="Email"
                handleInput={handleInput}
                value={courseFee.personalDetails.email}
                errors={errors.email}
              /></span>
              <div className="mt-5 w-1/2">
                <PhoneInputComponent
                  label="Phone Number"
                  phoneData={courseFee.personalDetails.phoneNumber}
                  onPhoneChange={handlePhoneChange}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 mt-2 text-sm">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>
              </span>
              <Register
                label="Address"
                imp="*"
                name="personalDetails.address.street"
                value={courseFee.personalDetails.address.street}
                handleInput={handleInput}
                errors={errors.street}
              />
               <span className="flex items-center justify-between w-full gap-4">
               <span className="w-1/2">
              <Register
                imp="*"
                name="personalDetails.address.state"
                type="text"
                label="Province/State"
                handleInput={handleInput}
                value={courseFee.personalDetails.address.state}
                errors={errors.state}
              /></span>
              <span className="w-1/2">
              <Register
                imp="*"
                name="personalDetails.address.city"
                type="text"
                label="City/Town"
                handleInput={handleInput}
                value={courseFee.personalDetails.address.city}
                errors={errors.city}
              />
              </span>
              </span>
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
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
              Submit
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseFeePersonalInfoUpdate;
