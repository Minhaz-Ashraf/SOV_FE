import React, { useEffect, useState } from "react";
import { ScoreInputForm } from "../../reusable/FormSection";
import { TbPencilMinus } from "react-icons/tb";
import { GrNotes } from "react-icons/gr";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { OfferLetterToeflScore } from "../../../features/generalApi";
const initialTOEFL = {
  reading: "",
  speaking: "",
  writing: "",
  listening: "",
  overallBand: "",
};
const TOEFLScore = ({ appId, updatedData, profileViewPath }) => {
  const { applicationDataById } = useSelector((state) => state.agent);
  const [isOne, setIsOne] = useState(false);
  const [offerLater, setOfferLater] = useState({
    TOEFL: { ...initialTOEFL },
  });
  const [errors, setErrors] = useState({});
  const handleOneToggle = () => {
    setIsOne((prev) => !prev); // Toggle the form visibility
  };

  const handleCancelOne = () => {
    setIsOne(false);
  };
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

    if (!offerLater.TOEFL) {
      errors.TOEFL = "TOEFL data is missing.";
      return errors;
    }

    if (!offerLater.TOEFL.reading) {
      errors.TOEFL = {
        ...errors.TOEFL,
        reading: "TOEFL Reading score is required.",
      };
    }
    if (!offerLater.TOEFL.speaking) {
      errors.TOEFL = {
        ...errors.TOEFL,
        speaking: "TOEFL Speaking score is required.",
      };
    }
    if (!offerLater.TOEFL.writing) {
      errors.TOEFL = {
        ...errors.TOEFL,
        writing: "TOEFL Writing score is required.",
      };
    }
    if (!offerLater.TOEFL.listening) {
      errors.TOEFL = {
        ...errors.TOEFL,
        listening: "TOEFL Listening score is required.",
      };
    }
    if (!offerLater.TOEFL.overallBand) {
      errors.TOEFL = {
        ...errors.TOEFL,
        overallBand: "TOEFL Overall Bands score is required.",
      };
    }

    return errors;
  };
  useEffect(() => {
    if (applicationDataById) {
      setOfferLater({
        TOEFL: {
          reading: applicationDataById?.offerLetter?.toefl?.reading || "",
          speaking: applicationDataById?.offerLetter?.toefl?.speaking || "",
          writing: applicationDataById?.offerLetter?.toefl?.writing || "",
          listening: applicationDataById?.offerLetter?.toefl?.listening || "",
          overallBand: applicationDataById?.offerLetter?.toefl?.overallBand || "",
        },
      });
    } else {
      setOfferLater({
        TOEFL: { ...initialTOEFL },
      });
    }
  }, [applicationDataById]);

  const handleSubmit = async () => {
    const validationErrors = validateFields();

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form is valid");
    } else {
      setErrors(validationErrors);
      toast.error("Form contains errors");
      console.log("Form has errors", validationErrors);
      return; // Exit the function early if validation fails
    }

    try {
      const convertToNumber = (scoreData) => {
        return {
          reading: Number(scoreData.reading),
          speaking: Number(scoreData.speaking),
          writing: Number(scoreData.writing),
          listening: Number(scoreData.listening),
          overallBand: Number(scoreData.overallBand),
        };
      };

      const updatedOfferLater = {
        ...offerLater,
        toefl: offerLater.TOEFL
          ? convertToNumber(offerLater.TOEFL)
          : { ...initialTOEFL },
      };
      delete updatedOfferLater.TOEFL;

      const section = "offerLetter";
      const res = await OfferLetterToeflScore(
        appId,
        updatedOfferLater,
        section
      );
      toast.success(res.message || "Data added successfully");
      updatedData();
      handleCancelOne();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
      console.error("Error during submission:", error);
    }
  };

  return (
    <>
      <div className="bg-white rounded-md px-6 py-4 font-poppins">
        <div className="flex flex-row text-sidebar items-center justify-between border-b border-greyish">
          <span className="flex flex-row gap-4 items-center pb-3">
            <span className="text-[24px]">
              <GrNotes />
            </span>
            <span className="font-semibold text-[22px]">TOEFL Score</span>
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
            <span className="font-light mt-4">Reading</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.toefl?.reading || "NA"}
            </span>
            <span className="font-light mt-4">Writing</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.toefl?.writing || "NA"}
            </span>
            <span className="font-light mt-4">Overall Bands</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.toefl?.overallBand || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Speaking</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.toefl?.speaking || "NA"}
            </span>

            <span className="font-light mt-4">Listening</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.toefl?.listening || "NA"}
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
            <>
              <ScoreInputForm
                namePrefix="TOEFL"
                handleInput={handleInput}
                scoreType="TOEFL Score"
                scoreData={offerLater.TOEFL}
                errors={errors.TOEFL}
              />

              <div className="flex justify-end gap-4">
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default TOEFLScore;
