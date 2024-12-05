import React from "react";
import InstituteCard from "./InstituteCard";
import Dnf from "../Dnf";
import { dnf, noInstitute } from "../../assets";

const ShortlistComponent = ({ bodyText, headingText, cardData, shortlistInstitute, isLoading }) => {
  const data = cardData?.institutes;

  return (
    <>
      <div className="md:ml-[17%] sm:ml-[27%] sm:mr-6 pt-16 bg-white border-b-2 border-[#E8E8E8]">
        <span className="flex items-center">
          <span>
            <p className="md:text-[28px] sm:text-[22px] font-bold text-sidebar md:mt-6 sm:mt-9 ml-9">
              {headingText}
            </p>
            <p className="mt-1 mb-6 font-normal text-body md:pr-[20%] pr-[9%] ml-9">
              {bodyText}
            </p>
          </span>
        </span>
      </div>

      {isLoading ? (
        <p className="mt-1 font-medium text-body pr-[20%] ml-[19%]">
          Loading...
        </p>
      ) : data && data.length > 0 ? (
        <div className="md:ml-[19%] sm:ml-[27%] mt-6 grid md:grid-cols-2 lg:grid-cols-3  sm:grid-cols-2 mx-6 md:gap-6 sm:gap-4">
          {data.map((institute) => (
            <InstituteCard
              key={institute.instituteId._id}
              instituteId={institute.instituteId._id}
              institutename={institute.instituteId.instituteName}
              country={institute.instituteId.country}
              shortlistInstitute={shortlistInstitute}
              status={institute.status}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 font-medium text-body ml-[25%] mr-[15%]">
          <Dnf
            dnfImg={dnf}
            headingText="Start Your Journey!"
            bodyText="No Shortlisted Data Available to Show"
          />
        </div>
      )}
    </>
  );
};

export default ShortlistComponent;
