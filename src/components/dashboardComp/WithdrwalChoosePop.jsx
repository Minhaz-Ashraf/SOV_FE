import React, { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";

const WithdrwalChoosePop = ({ isOpenOption, closeOption, handleWithdraw, setSelectedOption }) => {

  const navigate = useNavigate();

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    handleWithdraw()
    closeOption();

  };

  return (
    <>
      {isOpenOption && (
        <div className="fixed inset-0 font-poppins flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6">
          <div className="bg-white pb-9 rounded-lg md:w-[55%] w-full relative p-9 flex flex-col justify-center">
          <span onClick={closeOption} className="absolute right-4 text-primary top-3 text-[28px] cursor-pointer">
              {" "}
              <RxCross2 />
            </span>
         
            <div className="withdrawal-choose-pop">
            <p className="text-sidebar font-semibold text-[20px]">
            Which application would you like to withdraw?
            </p>
              <div className="radio-options ">
              <span className="flex  items-center gap-4 mt-3 border border-greyish rounded-md py-3 text-sidebar px-3">
                  <input
                    type="radio"
                    name="withdrawalOption"
                    value="courseFee"
                    onChange={handleOptionChange}
                  />
                    <label>
                  Course Fee
                </label>
                </span>
                <span className="flex  items-center gap-4 mt-3 border border-greyish rounded-md py-3 text-sidebar px-3">
                  <input
                    type="radio"
                    name="withdrawalOption"
                    value="gic"
                    onChange={handleOptionChange}
                  />
                <label>

                  GIC
                </label></span>
              
                <span className="flex  items-center gap-4 mt-3 border border-greyish rounded-md py-3 text-sidebar px-3">
                  <input
                    type="radio"
                    name="withdrawalOption"
                    value="courseFeeAndGic"
                    onChange={handleOptionChange}
                  />
                    <label>
                  Both of the Above
                </label></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WithdrwalChoosePop;
