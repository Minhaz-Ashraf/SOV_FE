import React, { useEffect, useState } from "react";
import { ScoreInputForm } from "../../reusable/FormSection";
import { TbPencilMinus } from "react-icons/tb";
import { GrNotes } from "react-icons/gr";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import OfferLetterEdit from "../../../agent/OfferLetterEdit";
import { OfferLetterIeltsInfo } from "../../../features/generalApi";
const initialIELTS = {
  reading: "",
  speaking: "",
  writing: "",
  listening: "",
  overallBand: "",
};
const IeltsScore = ({ appId, updatedData, profileViewPath}) => {
  const { applicationDataById } = useSelector((state) => state.agent);
  const [isOne, setIsOne] = useState(false);
  const [offerLater, setOfferLater] = useState({
    IELTS: { ...initialIELTS },
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
    if (!offerLater.IELTS.reading) {
      errors.IELTS = {
        ...errors.IELTS,
        reading: "IELTS Reading score is required.",
      };
    }
    if (!offerLater.IELTS.speaking) {
      errors.IELTS = {
        ...errors.IELTS,
        speaking: "IELTS Speaking score is required.",
      };
    }
    if (!offerLater.IELTS.writing) {
      errors.IELTS = {
        ...errors.IELTS,
        writing: "IELTS Writing score is required.",
      };
    }
    if (!offerLater.IELTS.listening) {
      errors.IELTS = {
        ...errors.IELTS,
        listening: "IELTS Listening score is required.",
      };
    }
    if (!offerLater.IELTS.overallBand) {
      errors.IELTS = {
        ...errors.IELTS,
        overallBand: "IELTS Overall Bands score is required.",
      };
    }
    return errors;
  };

  useEffect(() => {
    if (applicationDataById) {
      setOfferLater({
        IELTS: {
          reading: applicationDataById?.offerLetter?.ieltsScore?.reading || "",
          speaking: applicationDataById?.offerLetter?.ieltsScore?.speaking || "",
          writing: applicationDataById?.offerLetter?.ieltsScore?.writing || "",
          listening: applicationDataById?.offerLetter?.ieltsScore?.listening || "",
          overallBand: applicationDataById?.offerLetter?.ieltsScore?.overallBand || "",
        },
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
      // Helper function to convert scores to numbers
      const convertToNumber = (scoreData) => {
        return {
          reading: Number(scoreData.reading),
          speaking: Number(scoreData.speaking),
          writing: Number(scoreData.writing),
          listening: Number(scoreData.listening),
          overallBand: Number(scoreData.overallBand),
        };
      };
      // Create updated data object
      const updatedOfferLater = {
        ...offerLater,
        ieltsScore: offerLater.IELTS ? convertToNumber(offerLater.IELTS) : null,
      };
      delete updatedOfferLater.IELTS;

      const section = "offerLetter";
      // API call
      const res = await OfferLetterIeltsInfo(appId, updatedOfferLater, section);
      toast.success(res.message || "Data added successfully");
      updatedData();
      handleCancelOne();
    } catch (error) {
      // Improved error handling
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
            <span className="font-semibold text-[22px]">IELTS Score</span>
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
              {applicationDataById?.offerLetter?.ieltsScore?.reading || "NA"}
            </span>
            <span className="font-light mt-4">Writing</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.ieltsScore?.writing || "NA"}
            </span>
            <span className="font-light mt-4">Overall Bands</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.ieltsScore?.overallBand || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Speaking</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.ieltsScore?.speaking || "NA"}
            </span>

            <span className="font-light mt-4">Listening</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.ieltsScore?.listening || "NA"}
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
                isEdit={true}
                namePrefix="IELTS"
                handleInput={handleInput}
                scoreType="IELTS Score"
                scoreData={offerLater.IELTS}
                errors={errors.IELTS}
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
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default IeltsScore;
