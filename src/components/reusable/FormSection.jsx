import React from "react";
import Register from "./Register";

const FormSection = ({ icon, title, children, customClass }) => {
  return (
    <>
      <div
        className={`flex items-center font-semibold font-universal justify-start text-secondary text-[18px] gap-3  ${customClass}`}
      >
        {icon}
        <p>{title}</p>
      </div>
      <div className="font-poppins p-6 rounded-md">{children}</div>
    </>
  );
};

const ScoreInputForm = ({ scoreType, scoreData, handleInput,namePrefix, errors, isEdit }) => {
  return (
    <div className="bg-white rounded-xl  py-4 pb-12 mt-6">
    {isEdit ?  "" :
      <span className="font-bold text-[23px] text-secondary">{scoreType}</span> } 
      <span className="flex items-center justify-between gap-4 w-full">
      <span className="w-1/2">
        <Register
          imp="*"
          name={`${namePrefix}.reading`}
          type="number"
          label="Reading"
          handleInput={(e) => handleInput(e, scoreType.toLowerCase())}
          value={scoreData.reading}
          errors={errors?.reading}
        />
        <Register
          imp="*"
          name={`${namePrefix}.speaking`}
          type="number"
          label="Speaking"
          handleInput={(e) => handleInput(e, scoreType.toLowerCase())}
          value={scoreData.speaking}
          errors={errors?.speaking}
        />
        </span>
   
      <span className="w-1/2">

        <Register
          imp="*"
          name={`${namePrefix}.writing`}
          type="number"
          label="Writing"
          handleInput={(e) => handleInput(e, scoreType.toLowerCase())}
          value={scoreData?.writing}
          errors={errors?.writing}
        />
        <Register
          imp="*"
          name={`${namePrefix}.listening`}
            type="number"
          label="Listening"
          handleInput={(e) => handleInput(e, scoreType.toLowerCase())}
          value={scoreData.listening}
          errors={errors?.listening}
        />
        </span>
      </span>
      <Register
        imp="*"
        name={`${namePrefix}.overallBand`}
         type="number"
        label="Overall Bands"
        handleInput={(e) => handleInput(e, scoreType.toLowerCase())}
        value={scoreData.overallBand}
        errors={errors?.overallBand}
      />
    </div>
  );
};

export { FormSection, ScoreInputForm };
export default FormSection;
