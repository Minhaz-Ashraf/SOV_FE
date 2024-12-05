import React, { useState } from "react";
import { ScoreInputForm } from "../../reusable/FormSection";
const initialIELTS = {
  reading: "",
  speaking: "",
  writing: "",
  listening: "",
  overallBand: "",
};
const pteScore = () => {
  const [offerLater, setOfferLater] = useState({
    IELTS: { ...initialIELTS },
  });
  const [errors, setErrors] = useState({});

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
    if (!offerLater.IELTS.reading?.trim()) {
      errors.IELTS = {
        ...errors.IELTS,
        reading: "IELTS Reading score is required.",
      };
    }
    if (!offerLater.IELTS.speaking?.trim()) {
      errors.IELTS = {
        ...errors.IELTS,
        speaking: "IELTS Speaking score is required.",
      };
    }
    if (!offerLater.IELTS.writing?.trim()) {
      errors.IELTS = {
        ...errors.IELTS,
        writing: "IELTS Writing score is required.",
      };
    }
    if (!offerLater.IELTS.listening?.trim()) {
      errors.IELTS = {
        ...errors.IELTS,
        listening: "IELTS Listening score is required.",
      };
    }
    if (!offerLater.IELTS.overallBand?.trim()) {
      errors.IELTS = {
        ...errors.IELTS,
        overallBand: "IELTS Overall Bands score is required.",
      };
    }
    return errors;
  };

  const handleSubmit = async () => {
    try {
    } catch (error) {}
  };
  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <GiGraduateCap />
            </span>
            <span className="font-semibold text-[22px]">
              Personal Information
            </span>
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
            <span className="font-light">Level of Education </span>
            <span className="font-medium">
              {applications?.companyDetails?.businessName || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">10th Marksheet</span>
            <span className="font-medium">
              {applications?.companyDetails?.address || "NA"}
            </span>
          </span>
        </div>

        <ScoreInputForm
          namePrefix="PTE"
          handleInput={handleInput}
          scoreType="PTE Score"
          scoreData={offerLater.PTE}
          errors={errors.PTE}
        />
      </div>
    </>
  );
};

export default pteScore;
