import React, { useEffect, useState } from "react";
import { ScoreInputForm } from "../../reusable/FormSection";
import { TbPencilMinus } from "react-icons/tb";
import { GrNotes } from "react-icons/gr";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { OfferLetterPteScore } from "../../../features/generalApi";
const initialPTES = {
  reading: "",
  speaking: "",
  writing: "",
  listening: "",
  overallBand: "",
};
const PteScoreEdit = ({ appId, updatedData, profileViewPath}) => {
  const { applicationDataById } = useSelector((state) => state.agent);
  const [isOne, setIsOne] = useState(false);
  const [offerLater, setOfferLater] = useState({
    PTE: { ...initialPTES },
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

    if (!offerLater.PTE) {
      errors.PTE = "PTE data is missing.";
      return errors;
    }

    if (!offerLater.PTE.reading) {
      errors.PTE = {
        ...errors.PTE,
        reading: "PTE Reading score is required.",
      };
    }
    if (!offerLater.PTE.speaking) {
      errors.PTE = {
        ...errors.PTE,
        speaking: "PTE Speaking score is required.",
      };
    }
    if (!offerLater.PTE.writing) {
      errors.PTE = {
        ...errors.PTE,
        writing: "PTE Writing score is required.",
      };
    }
    if (!offerLater.PTE.listening) {
      errors.PTE = {
        ...errors.PTE,
        listening: "PTE Listening score is required.",
      };
    }
    if (!offerLater.PTE.overallBand) {
      errors.PTE = {
        ...errors.PTE,
        overallBand: "PTE Overall Bands score is required.",
      };
    }

    return errors;
  };
  useEffect(() => {
    if (applicationDataById) {
      setOfferLater({
        PTE: {
          reading: applicationDataById?.offerLetter?.ptes?.reading || "",
          speaking: applicationDataById?.offerLetter?.ptes?.speaking || "",
          writing: applicationDataById?.offerLetter?.ptes?.writing || "",
          listening: applicationDataById?.offerLetter?.ptes?.listening || "",
          overallBand: applicationDataById?.offerLetter?.ptes?.overallBand || "",
        },
      });
    } else {
      setOfferLater({
        PTE: { ...initialPTES },
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
      return;
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
        ptes: offerLater.PTE
          ? convertToNumber(offerLater.PTE)
          : { ...initialPTES },
      };
      delete updatedOfferLater.PTE;

      const section = "offerLetter";
      const res = await OfferLetterPteScore(appId, updatedOfferLater, section);
      updatedData();
      toast.success(res.message || "Data added successfully");
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
            <span className="font-semibold text-[22px]">PTE Score</span>
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
              {applicationDataById?.offerLetter?.ptes?.reading || "NA"}
            </span>
            <span className="font-light mt-4">Writing</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.ptes?.writing || "NA"}
            </span>
            <span className="font-light mt-4">Overall Bands</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.ptes?.overallBand || "NA"}
            </span>
          </span>
          <span className="w-1/2 flex flex-col text-[15px]">
            <span className="font-light mt-4">Speaking</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.ptes?.speaking || "NA"}
            </span>

            <span className="font-light mt-4">Listening</span>
            <span className="font-medium">
              {applicationDataById?.offerLetter?.ptes?.listening || "NA"}
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
                namePrefix="PTE"
                handleInput={handleInput}
                scoreType="PTE Score"
                scoreData={offerLater.PTE}
                errors={errors.PTE}
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

export default PteScoreEdit;
