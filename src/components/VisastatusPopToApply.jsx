    import React, { useState } from "react";
    import { CountrySelect } from "./reusable/Input";
    import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";

    const VisastatusPopToApply = ({closeOpt, isOpenOpt, state}) => {
        const navigate = useNavigate();
    const { prefCountryOption } = useSelector((state) => state.general);
    const [preferredCountry, setPreferredCountry] = useState("");
    const handleCountryChange = (e) => {
        const { value } = e.target;
        setPreferredCountry(value);

        // Redirect when a country is selected
        if (value) {
        navigate("/visa-apply", {
            state: { state: state, preferredCountry: value },
        });
        closeOpt();
        }
    };
    return (
        <>
      {isOpenOpt && (
        <div className="fixed inset-0 font-poppins flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6">
          <div className="bg-white pb-9 rounded-lg md:w-[44%] w-full relative p-9 flex flex-col justify-center">
          <span onClick={closeOpt} className="absolute right-4 text-primary top-3 text-[28px] cursor-pointer">
              {" "}
              <RxCross2 />
            </span>
            <p className="text-sidebar font-semibold text-[20px]">
              Choose Country to Apply Visa
            </p>
            <CountrySelect
              name="preferredCountry"
              notImp={true}
              customClass="bg-input"
              options={prefCountryOption}
              value={preferredCountry}
              handleChange={handleCountryChange}
            />
          </div>
        </div>
      )}
    </>
    );
    };

    export default VisastatusPopToApply;
