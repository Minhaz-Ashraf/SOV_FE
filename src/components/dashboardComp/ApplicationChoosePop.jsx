import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CountrySelect } from "../reusable/Input";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";

const ApplicationChoosePop = ({ closeOpt, isOpenOpt, state }) => {
  const { prefCountryOption } = useSelector((state) => state.general);
  const [preferredCountry, setPreferredCountry] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const navigate = useNavigate();

  // Handle radio button change
  const handleRadioChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue);

    // Redirect based on the selected value
    if (selectedValue === "offerLetter") {
      navigate("/offerLetter-apply", { state: state });
      closeOpt();
    } else if (selectedValue === "courseFee") {
      navigate("/course-fee", { state: state });
      closeOpt();
    }
  };

  // Handle country selection change
  const handleCountryChange = (e) => {
    const { value } = e.target;
    setPreferredCountry(value);

    // Redirect when a country is selected
    if (value) {
      navigate("/visa-apply", { state: { state, preferredCountry: value } });
      closeOpt();
    }
  };

  return (
    <>
      {isOpenOpt && (
        <div
          className={`fixed inset-0 font-poppins flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6 ${
            isOpenOpt ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9 rounded-lg md:w-[44%] w-full relative p-9 flex flex-col items-center justify-center">
          <span onClick={closeOpt} className="absolute top-2 right-3 text-[30px] cursor-pointer text-primary"><RxCross2 /></span>
            <p className="text-sidebar font-semibold text-[20px]">
              Choose What Application to Add?
            </p>

            {/* Radio buttons */}
            <div className="mt-6 space-y-4 w-full">
              <div className="border border-rounded-md px-6 py-4 flex justify-between">
                <label htmlFor="offerLetter" className="text-[16px]">
                  Offer Letter
                </label>
                <input
                  type="radio"
                  id="offerLetter"
                  name="applicationChoice"
                  value="offerLetter"
                  checked={selectedOption === "offerLetter"}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
              </div>

              <div className="border border-rounded-md px-6 py-4 flex justify-between">
                <label htmlFor="courseFee" className="text-[16px]">
                  Course Fee
                </label>
                <input
                  type="radio"
                  id="courseFee"
                  name="applicationChoice"
                  value="courseFee"
                  checked={selectedOption === "courseFee"}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
              </div>

              <div className="border border-rounded-md px-6 py-4 flex justify-between">
                <label htmlFor="visaApplication" className="text-[16px]">
                  Visa
                </label>
                <input
                  type="radio"
                  id="visaApplication"
                  name="applicationChoice"
                  value="visaApplication"
                  checked={selectedOption === "visaApplication"}
                  onChange={handleRadioChange}
                  className="mr-2"
                />
              </div>

              {/* Conditionally render CountrySelect */}
              {selectedOption === "visaApplication" && (
                <CountrySelect
                  name="preferredCountry"
                  label="Preferred Country"
                  customClass="bg-input mt-4"
                  options={prefCountryOption}
                  value={preferredCountry}
                  handleChange={handleCountryChange}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationChoosePop;
