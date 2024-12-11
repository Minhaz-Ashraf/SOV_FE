import React, { useEffect, useState } from "react";

import { formOneSubmit } from "../features/agentApi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Register from "../components/reusable/Register";
import {
  CountrySelect,
  FormNavigationButtons,
} from "../components/reusable/Input";
import PhoneInputComponent from "../components/reusable/PhoneInputComponent";
import { useNavigate } from "react-router-dom";
import { agentInformation } from "../features/agentSlice";
import { editAgentAdmin } from "../features/adminApi";
import { agentDataProfile } from "../features/adminSlice";

const AgentForm1 = ({ hide, handleCancel, updateData, adminId, agentId}) => {
  const role = localStorage.getItem('role')
  const navigate = useNavigate();
  const { countryOption } = useSelector((state) => state.general);
  const { agentData } = useSelector((state) => state.agent);
  const { agentProfile } = useSelector((state) => state.admin);

  const getData = role === "0" ? agentProfile?.companyDetails :agentData?.companyDetails;
  const [companyData, setCompanyData] = useState({
    businessName: "",
    address: "",
    country: "",
    provinceState: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
    website: "",
    linkedin: "",
    whatsappNumber: "",
  });

  const [errors, setErrors] = useState({});
  const websiteRegex = /\./;
  const businessNameRegex = /^[a-zA-Z\s]*$/;
  const dispatch = useDispatch();
  const editForm = hide === true ? "edit" : null;
  useEffect(() => {
    dispatch(agentInformation());
  }, [dispatch]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name === "businessName") {
      if (!businessNameRegex.test(value)) {
        return;
      }
    }
    setCompanyData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Validation on input change
    let errorMsg = "";
    if (name === "website" && value && !websiteRegex.test(value)) {
      errorMsg = "Invalid website URL.";
    } else if (name === "linkedin" && value && !websiteRegex.test(value)) {
      errorMsg = "Invalid LinkedIn URL.";
    } else if (name === "phoneNumber" && value && value.length < 10) {
      errorMsg = "Phone number must be at least 10 digits.";
    } else if (!value) {
      errorMsg = `${name.replace(/([A-Z])/g, " $1")} is required.`;
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg,
    }));
  };
  const handlePhoneChange = (type, phoneData) => {
    if (type === "phone") {
      setCompanyData((prevData) => ({
        ...prevData,
        phoneNumber: phoneData.number,
      }));

      if (phoneData.number.length < 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          phoneNumber: "Phone number must be at least 10 digits.",
        }));
      } else {
        setErrors((prevErrors) => {
          const { phoneNumber, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    if (type === "whatsApp") {
      setCompanyData((prevData) => ({
        ...prevData,
        whatsappNumber: phoneData.number,
      }));

      if (phoneData.number.length < 10) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          whatsappNumber: "WhatsApp number must be at least 10 digits.",
        }));
      } else {
        setErrors((prevErrors) => {
          const { whatsappNumber, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };
  //get data
  useEffect(() => {
    if (getData) {
      setCompanyData(getData);
    }
  }, [getData]);
  // Handle form submission
  const handleSubmit = async () => {
    let isValid = true;
    let newErrors = {};

    // Check for required fields
    Object.keys(companyData).forEach((key) => {
      if (!companyData[key] && key !== "linkedin") {
        isValid = false;
        newErrors[key] = `${key} is required.`;
      }
    });
    
    // Validate website URL
    if (companyData.website && !websiteRegex.test(companyData.website)) {
      newErrors.website = "Invalid website URL.";
      isValid = false;
    }

  

    // Validate phone number length
    if (companyData.phoneNumber && companyData.phoneNumber.length < 10) {
      newErrors.phoneNumber = "Phone number must be at least 10 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      toast.error("Please Correct the Form Errors");

      return;
    }
    if (isValid) {
      const payload = {
        companyDetails: {
          businessName: companyData.businessName,
          address: companyData.address,
          country: companyData.country,
          provinceState: companyData.provinceState,
          city: companyData.city,
          postalCode: companyData.postalCode,
          phoneNumber: companyData.phoneNumber,
          website: companyData.website,
          linkedin: companyData.linkedin,
          whatsappNumber: companyData.whatsappNumber,
        },
      };
      try {
        let res
        if (role === "0") {
          await editAgentAdmin("/company/register-company-admin", payload, editForm, adminId);
        } else {
          res = await formOneSubmit(payload, editForm);
        }
        if(role === "0"){
          dispatch(agentDataProfile(agentId));
        }
        toast.success(res?.data?.message || "Data added successfully");
        {
          hide === true ?   updateData() : navigate("/agent-form/2", { state: "passPage" });
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
      console.log("Form Submitted");
    }
  };

  return (
    <div className="min-h-screen font-poppins">
      <div className={`${hide === true ? "" : "md:mx-48 sm:mx-10"}`}>
        {hide === true ? (
          ""
        ) : (
          <>
            <p className="text-heading font-semibold text-[30px] pt-7">
              Company Details
            </p>
          </>
        )}

        <div
          className={`bg-white rounded-xl ${
            hide === true ? "" : "px-8"
          } py-4 pb-12 mt-6`}
        >
          <Register
            imp="*"
            name="businessName"
            type="text"
            label="Business Name"
            handleInput={handleInput}
            value={companyData.businessName}
            errors={errors.businessName}
          />
          <Register
            imp="*"
            label="Address"
            name="address"
            type="text"
            handleInput={handleInput}
            value={companyData.address}
            errors={errors.address}
            className=" py-2 "
          />

          <div className="flex  justify-between gap-6 items-start">
            <span className="w-[50%] mt-[2px] ">
              <CountrySelect
                name="country"
                customClass="bg-input"
                label="Country"
                options={countryOption}
                value={companyData.country}
                handleChange={handleInput}
              />
              {errors.country && (
                <p className="text-red-500  text-sm">{errors.country}</p>
              )}

              <Register
                imp="*"
                name="city"
                type="text"
                label="City"
                handleInput={handleInput}
                value={companyData.city}
                errors={errors.city}
              />
              <div className="mt-8">
                <PhoneInputComponent
                  label="Phone Number"
                  phoneData={companyData.phoneNumber}
                  onPhoneChange={(phoneData) =>
                    handlePhoneChange("phone", phoneData)
                  }
                />
                {errors.phoneNumber && (
                  <p className="text-red-500  text-sm">{errors.phoneNumber}</p>
                )}
              </div>
            </span>

            <span className="w-[50%]">
              <Register
                imp="*"
                name="provinceState"
                type="text"
                label="Province/State"
                handleInput={handleInput}
                value={companyData.provinceState}
                errors={errors.provinceState}
              />

              <Register
                imp="*"
                name="postalCode"
                type="number"
                label="Postal Code"
                handleInput={handleInput}
                value={companyData.postalCode}
                errors={errors.postalCode}
              />

              <Register
                imp="*"
                name="website"
                type="text"
                label="Website"
                handleInput={handleInput}
                value={companyData.website}
                errors={errors.website}
              />
            </span>
          </div>

          <Register
            name="linkedin"
            type="text"
            label="Company's LinkedIn"
            handleInput={handleInput}
            value={companyData.linkedin}
            errors={errors.linkedin}
          />
          <div className="mt-5">
            {" "}
            <PhoneInputComponent
              label="WhatsApp Number"
              phoneData={companyData.whatsappNumber}
              onPhoneChange={(phoneData) =>
                handlePhoneChange("whatsApp", phoneData)
              }
            />
            {errors.whatsappNumber && (
              <p className="text-red-500 mt-6  text-sm">
                {errors.whatsappNumber}
              </p>
            )}
          </div>
        </div>
        {hide === true ? (
          <div className="flex justify-end mt-9 gap-4 ">
            <button
              className="border border-greyish text-black px-4 py-2 rounded"
              onClick={() => handleCancel("isOne")}
            >
              Cancel
            </button>
            <button
              className="bg-primary text-white px-6 py-2 rounded"
              onClick={() => {
                handleSubmit();
                handleCancel("isOne");
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className=" bg-primary md:mb-20 sm:mb-6 mt-6 text-white cursor-pointer px-6 py-2 rounded-md"
            >
              Submit and Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentForm1;