import React, { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const PhoneInputComponent = ({ phoneData, onPhoneChange, label, notImp }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [valid, setValid] = useState(true);
  useEffect(() => {
    if (phoneData?.phone ? phoneData?.phone : phoneData) {
      const formattedNumber = `+${phoneData?.phone ? phoneData?.phone : phoneData}`;
      setPhoneNumber(formattedNumber);
    }
  }, [phoneData]);

  const handleChange = (value, country) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
    onPhoneChange({
      code: country.dialCode,
      number: value,
    });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/;
    return phoneNumberPattern.test(phoneNumber);
  };

  return (
    <div className="relative font-poppins text-secondary text-[14px]">
    <div className="mb-2">{label} {notImp === true ? "" : "*"}</div>
      <label>
        <PhoneInput
          country={"in"}
          value={phoneNumber}
          onChange={handleChange}
          enableSearch={true} 
          preferredCountries={["in", "us", "gb", "de"]} 
          inputProps={{
            required: true,
          }}
        
          containerStyle={{ width: "100%" }}
          inputStyle={{ width: "100%", height: "3rem", background:"#F2F5F7" }}
        />
      </label>
      {!valid && (
        <p className="text-start text-[12px] absolute -bottom-6 text-red-600">
          Please enter a valid phone number*
        </p>
      )}
    </div>
  );
};



const PhoneInputSignup = ({ phoneData, onPhoneChange }) => {
  const [phoneNumber, setPhoneNumber] = useState(phoneData.number || "");
  const [valid, setValid] = useState(true);

  // Update phone number state when phoneData prop changes
  useEffect(() => {
    if (phoneData) {
      const formattedNumber = `+${phoneData.number || phoneData}`;
      setPhoneNumber(formattedNumber);
    }
  }, [phoneData]);

  const handleChange = (value, country) => {
    setPhoneNumber(value);
    setValid(validatePhoneNumber(value));
    
    // Ensure onPhoneChange is called with valid code and number
    onPhoneChange({
      code: country.dialCode,
      number: value.replace(/\D/g, ""),  // Stripping non-numeric chars
    });
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneNumberPattern = /^\+?[1-9]\d{1,14}$/; // International phone validation
    return phoneNumberPattern.test(phoneNumber);
  };

  return (
    <div className="relative font-poppins text-secondary text-[14px]">
      <div className="mb-2">Phone Number *</div>
      <label>
        <PhoneInput
          country={"in"} 
          value={phoneNumber}
          onChange={handleChange}
          enableSearch={true} 
          preferredCountries={["in", "us", "gb", "de"]} 
          inputProps={{
            required: true, 
          }}
          containerStyle={{ width: "143%" }}
          inputStyle={{ width: "70%", height: "3rem", background: "#F2F5F7" }}
        />
      </label>
      {!valid && (
        <p className="text-start text-[12px] absolute -bottom-6 mx-20 md:mx-28 text-red-600">
          Please enter a valid phone number*
        </p>
      )}
    </div>
  );
};

export {PhoneInputSignup, PhoneInputComponent}
export default PhoneInputComponent;
