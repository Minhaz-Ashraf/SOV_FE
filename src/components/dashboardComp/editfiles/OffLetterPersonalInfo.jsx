import React, { useEffect, useState } from "react";
import { FaRegIdCard } from "react-icons/fa";
import { TbPencilMinus } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { CountrySelect } from "../../reusable/Input";
import Register from "../../reusable/Register";
import PhoneInputComponent from "../../reusable/PhoneInputComponent";
import { allApplication } from "../../../features/agentSlice";
import { countryOptions, OfferLetterPersonalInfoEdit } from "../../../features/generalApi";
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

const OffLetterPersonalInfo = ({appId, updatedData, profileViewPath}) => {
  const {applicationDataById}  = useSelector((state)=> state.agent)
  const [isOne, setIsOne] = useState(false);
  const [offerLater, setOfferLater] = useState({
    personalInformation: { ...initialPersonalInfo },
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
      setOfferLater({
        personalInformation: {
          fullName: applicationDataById?.offerLetter?.personalInformation?.fullName || "",
          email: applicationDataById?.offerLetter?.personalInformation?.email || "",
          phoneNumber: applicationDataById?.offerLetter?.personalInformation?.phoneNumber || "",
          address: {
            street: applicationDataById?.offerLetter?.personalInformation?.address?.street || "",
            city: applicationDataById?.offerLetter?.personalInformation?.address?.city || "",
            state: applicationDataById?.offerLetter?.personalInformation?.address?.state || "",
            postalCode: applicationDataById?.offerLetter?.personalInformation?.address?.postalCode || "",
            country: applicationDataById?.offerLetter?.personalInformation?.address?.country || "",
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

    setOfferLater((prevState) => {
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
    setOfferLater((prevState) => ({
      ...prevState,
      personalInformation: {
        ...prevState.personalInformation,
        phoneNumber: phoneNumber.number,
      },
    }));
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
      const section  = "offerLetter"
      const res = await OfferLetterPersonalInfoEdit(appId, offerLater, section)
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
             {profileViewPath ? "" :
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
              {applicationDataById?.offerLetter?.personalInformation?.fullName || "NA"}
            </span>
            <span className="font-light mt-4">Phone Number</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.personalInformation?.phoneNumber || "NA"}
            </span>
            <span className="font-light mt-4">Province/State</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.personalInformation?.address?.state || "NA"}
            </span>
            <span className="font-light mt-4">Postal/Zip Code</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.personalInformation?.address?.postalCode || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Email ID</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.personalInformation?.email || "NA"}
            </span>
            <span className="font-light mt-4">Country</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.personalInformation?.address?.country || "NA"}
            </span>
            <span className="font-light mt-4">Address</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.personalInformation?.address?.street || "NA"}
            </span>
            <span className="font-light mt-4">City/Town</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.personalInformation?.address?.city || "NA"}
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
                name="personalInformation.fullName"
                type="text"
                label="Full Name"
                handleInput={handleInput}
                value={offerLater.personalInformation.fullName}
                errors={errors.fullName}
              />
              <span className="flex items-center justify-between w-full gap-4">
              <span className="w-1/2">
              <Register
                imp="*"
                name="personalInformation.email"
                type="email"
                label="Email"
                handleInput={handleInput}
                value={offerLater.personalInformation.email}
                errors={errors.email}
              /></span>
              <div className="mt-5 w-1/2">
                <PhoneInputComponent
                  label="Phone Number"
                  phoneData={offerLater.personalInformation.phoneNumber}
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
                name="personalInformation.address.street"
                value={offerLater.personalInformation.address.street}
                handleInput={handleInput}
                errors={errors.street}
              />
               <span className="flex items-center justify-between w-full gap-4">
               <span className="w-1/2">
              <Register
                imp="*"
                name="personalInformation.address.state"
                type="text"
                label="Province/State"
                handleInput={handleInput}
                value={offerLater.personalInformation.address.state}
                errors={errors.state}
              /></span>
              <span className="w-1/2">
              <Register
                imp="*"
                name="personalInformation.address.city"
                type="text"
                label="City/Town"
                handleInput={handleInput}
                value={offerLater.personalInformation.address.city}
                errors={errors.city}
              />
              </span>
              </span>
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

export default OffLetterPersonalInfo;