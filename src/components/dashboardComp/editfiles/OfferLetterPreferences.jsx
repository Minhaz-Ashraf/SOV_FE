import React, { useEffect, useState } from "react";
import { TbPencilMinus } from "react-icons/tb";
import {
  CountrySelect,
  InstituteComponent,
  SelectComponent,
} from "../../reusable/Input";
import { toast } from "react-toastify";
import { MdCable } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import Register from "../../reusable/Register";
import { intakeOption } from "../../../constant/data";
import { OfferLetterPrefEdit } from "../../../features/generalApi";
import { getInstituteOption } from "../../../features/generalSlice";
const initialPreferences = {
  country: "",
  institution: "",
  course: "",
  offerLetterPrice: "",
  intake: "",
};
const OfferLetterPreferences = ({ appId, updatedData, profileViewPath }) => {
  const [offerLater, setOfferLater] = useState({
    preferences: { ...initialPreferences },
  });
  const { instituteOption } = useSelector((state) => state.general);

  const { applicationDataById } = useSelector((state) => state.agent);

  const [isOne, setIsOne] = useState(false);

  const [errors, setErrors] = useState({});
  const { prefCountryOption } = useSelector((state) => state.general);
  const { courses } = useSelector((state) => state.general);

  const dispatch = useDispatch();
  const handleOneToggle = () => {
    setIsOne((prev) => !prev);
  };

  const handleCancelOne = () => {
    setIsOne(false);
  };
  useEffect(() => {
    dispatch(getInstituteOption(offerLater.preferences.country));
  }, [dispatch, offerLater.preferences.country]);
  const handleInput = (e, sectionType) => {
    const { name, value, type } = e.target;

    // Split the name by dots (e.g., personalInformation.address.street)
    const nameParts = name.split(".");

    // Check if the input type is 'radio' to handle education level
    if (type === "radio") {
      setSelectedEducation(value);
      setOfferLater((prevState) => ({
        ...prevState,
        educationDetails: {
          ...prevState.educationDetails,
          educationLevel: value, // Update education level in the state
        },
      }));
      return;
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
    //   errors.prefOfferLetter = "Preferred offer letter price is required.";
    // }

    return errors; // Always return an object
  };

  useEffect(() => {
    if (applicationDataById) {
      setOfferLater({
        preferences: {
          course: applicationDataById?.offerLetter?.preferences?.course || "",
          intake: applicationDataById?.offerLetter?.preferences?.intake || "",
          institution: applicationDataById?.offerLetter?.preferences?.institution || "",
          country: applicationDataById?.offerLetter?.preferences?.country || "",
          offerLetterPrice:
            applicationDataById?.offerLetter?.preferences?.offerLetterPrice || "",
        },
      });
    }
  }, [applicationDataById]);

  const handleSubmit = async () => {
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid");
      try {
        const section = "offerLetter";
        const res = await OfferLetterPrefEdit(appId, offerLater, section);
        toast.success(res.message || "Data added successfully");
        updatedData();
        handleCancelOne();
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Something Went Wrong");
      }
    } else {
      setErrors(validationErrors);
      toast.error("Form contains errors");
      console.log("Form has errors", validationErrors);
    }
  };
  return (
    <div className="bg-white rounded-md px-6 py-4 font-poppins">
      <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
        <span className="flex flex-row gap-4 items-center pb-3">
          <span className="text-[24px]">
            <MdCable />
          </span>
          <span className="font-semibold text-[22px]">Preferences</span>
        </span>
        {profileViewPath 
          ? ""
          : !isOne && (
              <span
                className="text-[24px] cursor-pointer transition-opacity duration-300 ease-in-out"
                onClick={handleOneToggle}
                style={{ opacity: isOne ? 0 : 1 }}
              >
                <TbPencilMinus />
              </span>
            )}
      </div>
      <div className="flex flex-row w-full justify-between mt-6">
        <span className="w-1/2 flex flex-col text-[15px]">
          <span className="font-light">Country </span>
          <span className="font-medium">
            {applicationDataById?.offerLetter?.preferences?.country || "NA"}
          </span>
          <span className="font-light mt-4">Course</span>
          <span className="font-medium">
            {applicationDataById?.offerLetter?.preferences?.course || "NA"}
          </span>
          <span className="font-light mt-4">Intake</span>
          <span className="font-medium">
            {applicationDataById?.offerLetter?.preferences?.intake || "NA"}
          </span>
        </span>
        <span className="w-1/2 flex flex-col text-[15px]">
          <span className="font-light mt-4">Institution</span>
          <span className="font-medium">
            {applicationDataById?.offerLetter?.preferences?.institution || "NA"}
          </span>
          <span className="font-light mt-4">Offer Letter Price</span>
          <span className="font-medium">
            {applicationDataById?.offerLetter?.preferences?.offerLetterPrice || "NA"}
          </span>
        </span>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          isOne
            ? "min-h-[50vh] translate-y-0 opacity-100"
            : "max-h-0 -translate-y-10 opacity-0 overflow-hidden"
        }`}
      >
        {isOne && (
          <div className="bg-white rounded-xl py-4 pb-12 mt-6">
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

            <Register
              imp="*"
              name="preferences.offerLetterPrice"
              type="text"
              label="Offer letter price in USD"
              // handleInput={handleInput}

              value={offerLater.preferences.offerLetterPrice}
              errors={errors.prefOfferLetter}
            />

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

            <div className="flex justify-end gap-4 mt-6">
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
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferLetterPreferences;
