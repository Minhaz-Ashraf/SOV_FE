import React, { useState } from "react";

const RejectedPopUp = ({
  isOpen,
  closePopUp,
  handleFunc,
  id,
  applicationType,
  sectionData,
  instituteData
}) => {
  const [reviewText, setReviewText] = useState();

  const handleTextareaChange = (event) => {
    setReviewText(event.target.value);
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50  sm:px-52  px-6 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9  rounded-lg md:w-[50%] w-full  relative p-9  ">
            <span className="flex flex-col items-center justify-center">
              <p className="text-center font-DMsans text-black font-semibold text-[16px] ">
                Do you want to reject ?
              </p>

              <textarea
                name=""
                placeholder="Enter the reason for rejection..."
                className="shadow mt-5 w-96 px-2  py-2 bg-input"
                value={reviewText}
                onChange={handleTextareaChange}
              ></textarea>
            </span>
            <div className="flex justify-center items-center font-DMsans gap-5 mt-5">
              <span
                onClick={closePopUp}
                className="px-8 py-2 cursor-pointer  rounded-lg text-primary border border-primary"
              >
                No
              </span>
              <span
                onClick={() => {
                  handleFunc(id, "rejected", sectionData, reviewText, instituteData);
                  closePopUp();
                }}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
              >
                Yes
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RejectedPopUp;
