import React from 'react';
import { FaRegEyeSlash, FaRegEye } from 'react-icons/fa6';
import { CustomInput } from './Input';

const PasswordField = ({ name, value, handleInput, showPassword, toggleVisibility, error, label }) => {
  return (
    <>
    <div className=" relative font-poppins">
      <span className="text-secondary text-[14px]">{label}*</span>
      <CustomInput
        className="w-full h-12 bg-input rounded-md mt-3 px-3 outline-none  "
        name={name}
        value={value}
        onChange={handleInput}
        type={showPassword ? "text" : "password"}
        placeHodler={label}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute inset-y-0 right-3 top-7 text-[18px] flex items-center"
      >
        {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
      </button>
      {error && <p className="text-red-500 mt-1 text-sm">{error}</p>}
    </div>

  

    </>
  );
};

export default PasswordField;
