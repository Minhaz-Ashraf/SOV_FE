import React from "react";
import { priorityOption, ticketTypeOption } from "../constant/data";

const TicketAddPop = ({ isOpen, closePopUp, value, handleInput, handleFunc }) => {
  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9 rounded-lg md:w-[70%] w-full relative px-4 py-4 ">
            <p className="px-6 pt-3 text-sidebar text-[19px] font-medium">
              Create Quick Ticket
            </p>
            <p className="px-6 pb-6 text-body text-[13px] font-normal">
              Write and address new queries and issues
            </p>

            <span className="flex flex-col items-center w-full">
              <span className="flex flex-row items-center justify-between w-full gap-4 px-6">
                {/* Ticket Type Select */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Request Ticket Type
                  </label>
                  <select
                    name="ticketType"
                    value={value.ticketType}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none"
                  >
                      <option>Choose Ticket Type</option>

                    {ticketTypeOption.map((option) => (
                      <option key={option.value} value={option.option}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Status Select */}
                <div className="flex flex-col w-full">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Priority Status
                  </label>
                  <select
                    name="priorityStatus"
                    value={value.priorityStatus}
                    onChange={handleInput}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md outline-none"
                  >
                      <option>Choose Priority Type</option>

                    {priorityOption.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </span>

              {/* Description Textarea */}
              <div className="flex flex-col w-full mt-3 px-6">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
              <textarea
                className="w-full outline-none rounded-md py-3 h-20 bg-input text-body px-3"
                placeholder="Description"
                name="description"
                value={value.description}
                onChange={handleInput}
              />
              </div>
            </span>

            <div className="flex justify-end items-center font-DMsans gap-5 mt-5">
              <span
                onClick={closePopUp}
                className="px-8 py-2 cursor-pointer rounded-lg text-primary border border-primary"
              >
                Cancel
              </span>
              <span
                onClick={() => {
                  handleFunc();
                  closePopUp();
                }}
                className="px-8 py-2 cursor-pointer rounded-lg text-white bg-primary"
              >
                Raise Ticket
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketAddPop;
