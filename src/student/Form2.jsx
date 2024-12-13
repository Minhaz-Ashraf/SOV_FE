import React, { useEffect, useState } from "react";
import {
  CountrySelect,
  CustomInput,
  CustomTextArea,
  FormNavigationButtons,
} from "../components/reusable/Input";
import Register from "../components/reusable/Register";
import { FaRegAddressCard } from "react-icons/fa6";
import FormSection from "../components/reusable/FormSection";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { studentAddress } from "../features/studentApi";
import { useLocation, useNavigate } from "react-router-dom";
import { getStudentData, studentInfo } from "../features/studentSlice";
import { editStudentAdmin } from "../features/adminApi";
import { getStudentById } from "../features/adminSlice";

const Form2 = ({
  customClass,
  hide,
  handleCancel,
  studentFormId,
  updateData,
}) => {
  const role = localStorage.getItem("role");
  const dispatch = useDispatch();
    const location = useLocation();
  const IdToAddStudent = location?.state?.id?.id;
  const { getStudentDataById } = useSelector((state) => state.admin);
  const { countryOption } = useSelector((state) => state.general);
  const studentInfoData = useSelector((state) => state.student.studentInfoData);
  const studentData = useSelector((state) => state.student.studentInformation);
  const studentInformation = hide ? studentInfoData : studentData;
  const residenceAddress =
    role === "0"
      ? getStudentDataById?.studentInformation?.residenceAddress
      : studentInformation?.data?.studentInformation?.residenceAddress;
  const mailingAddress =
    role === "0"
      ? getStudentDataById?.studentInformation?.mailingAddress
      : studentInformation?.data?.studentInformation?.mailingAddress;
  const studentId = studentFormId || IdToAddStudent || localStorage.getItem("form") || localStorage.getItem('student')

  const formId = studentInformation?.data?.studentInformation?._id;
  const submitId = hide ? formId : studentId;
  const [residenceData, setResidenceData] = useState({
    address: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
  });

  const [mailAddressData, setMailAddressData] = useState({
    address: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
  });
  const navigate = useNavigate();
  const [isSameAsResidence, setIsSameAsResidence] = useState(false);
  const editForm = hide === true ? "edit" : null;

  const [errors, setErrors] = useState({
    address: "",
    country: "",
    state: "",
    city: "",
    zipcode: "",
  });

  useEffect(() => {
    if (hide === true) {
      dispatch(studentInfo(studentFormId));
    }
    if (hide === false) {
      dispatch(getStudentData(studentId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (residenceAddress) {
      setResidenceData(residenceAddress);
    }
    if (mailingAddress) {
      setMailAddressData(mailingAddress);
    }
  }, [residenceAddress, mailingAddress]);

  const checkIfSameAddress = () => {
    const sameAddress =
      mailAddressData.address === residenceData.address &&
      mailAddressData.country === residenceData.country &&
      mailAddressData.state === residenceData.state &&
      mailAddressData.city === residenceData.city &&
      mailAddressData.zipcode === residenceData.zipcode;

    setIsSameAsResidence(sameAddress);
  };

  const handleInput = (e, setData) => {
    const { name, value } = e.target;
    setData((data) => ({
      ...data,
      [name]: value,
    }));
    setErrors((prevErrors) => {
      const { [name]: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
    checkIfSameAddress();
  };

  const handleCheckboxChange = () => {
    setIsSameAsResidence(!isSameAsResidence);

    if (!isSameAsResidence) {
      setMailAddressData(residenceData);
    } else {
      setMailAddressData({
        address: "",
        country: "",
        state: "",
        city: "",
        zipcode: "",
      });
    }
  };

  const validateFields = (data, fieldType) => {
    const newErrors = {};
    if (!data.address) newErrors.address = `${fieldType} address is required`;
    if (!data.country) newErrors.country = `${fieldType} country is required`;
    if (!data.state) newErrors.state = `${fieldType} state is required`;
    if (!data.city) newErrors.city = `${fieldType} city is required`;
    if (!data.zipcode)
      newErrors.zipcode = `${fieldType} postal/zip code is required`;
    return newErrors;
  };

  const handleSubmit = async () => {
    const residenceErrors = validateFields(residenceData, "Residence");
    const mailAddressErrors = validateFields(mailAddressData, "Mailing");
    const allErrors = { ...residenceErrors, ...mailAddressErrors };

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return;
    }

    const payload = {
      residenceAddress: { ...residenceData },
      mailingAddress: { ...mailAddressData },
    };

    try {
      let res;
      

      if (role === "0") {
        await editStudentAdmin(`/studentInformation/residence-address-admin/${studentId}`, payload, editForm);
      } else {
        res = await studentAddress(payload, studentId, editForm);
      }
      if(role === "0"){
        dispatch(getStudentById(studentId));
      }
      toast.success(res?.message || "Data submitted successfully");
    
      // if (res?.statusCode === 200) {
        {
          hide === true
            ? updateData()
            : navigate(`/student-form/3`, { state: "passPage" });
        // }

        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(
        error?.message ||
          "Something went wrong during submission. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen">
      <div className={`${customClass}`}>
        {hide === true ? (
          ""
        ) : (
          <>
            <p className="text-heading font-semibold text-[30px] pt-7">
              Residence & Current Address
            </p>
            <p className="text-secondary font-normal text-[14px]">
              Enter permanent and current address as shown on the passport.
            </p>
          </>
        )}
        <div
          className={`bg-white rounded-xl ${
            hide === true ? "mt-16" : " px-8 py-6 pb-12 mt-6"
          }`}
        >
          <span className="text-secondary">Residence Address*</span>
          <CustomTextArea
            className="w-full outline-none px-3 rounded-md py-3 h-20 bg-input mt-3 text-body"
            placeHolder="Address"
            name="address"
            value={residenceData.address}
            onChange={(e) => handleInput(e, setResidenceData)}
          />
          {errors.address && (
            <p className="text-red-500 mt-1 text-sm">{errors.address}</p>
          )}
          <div className="-mt-4">
            <CountrySelect
              name="country"
              label="Country"
              customClass="bg-input"
              options={countryOption}
              value={residenceData.country}
              handleChange={(e) => handleInput(e, setResidenceData)}
            />
            {errors.country && (
              <p className="text-red-500 mt-1 text-sm">{errors.country}</p>
            )}
          </div>
          <Register
            imp="*"
            name="state"
            type="text"
            label="Province/State"
            handleInput={(e) => handleInput(e, setResidenceData)}
            value={residenceData.state}
            errors={errors.state}
          />
          <Register
            imp="*"
            name="city"
            type="text"
            label="City/Town"
            handleInput={(e) => handleInput(e, setResidenceData)}
            value={residenceData.city}
            errors={errors.city}
          />
          <Register
            imp="*"
            name="zipcode"
            type="number"
            label="Postal/Zip Code"
            handleInput={(e) => handleInput(e, setResidenceData)}
            value={residenceData.zipcode}
            errors={errors.zipcode}
          />
        </div>

        <div className="flex justify-end items-center space-x-3 my-4 text-secondary">
          <CustomInput
            type="checkbox"
            checked={isSameAsResidence}
            onChange={handleCheckboxChange}
          />
          <span>Same as above</span>
        </div>

        {/* Mail Address Section */}
        <FormSection
          icon={<FaRegAddressCard />}
          title="Mailing Address"
          customClass="-mb mt-4"
        />
        <div
          className={`bg-white rounded-xl ${
            hide === true ? "-mt-3" : " px-8 py-6 pb-12 mt-6"
          }`}
        >
          <span className="text-secondary">Mailing Address*</span>
          <CustomTextArea
            className="w-full outline-none px-3 rounded-md py-3 h-20 bg-input mt-3 text-body"
            placeHolder="Address"
            name="address"
            value={mailAddressData.address}
            onChange={(e) => handleInput(e, setMailAddressData)}
          />
          {errors.address && (
            <p className="text-red-500 mt-1 text-sm">{errors.address}</p>
          )}
          <div className="-mt-4">
            <CountrySelect
              name="country"
              label="Country"
              options={countryOption}
              customClass="bg-input"
              value={mailAddressData.country}
              handleChange={(e) => handleInput(e, setMailAddressData)}
            />
            {errors.country && (
              <p className="text-red-500 mt-1 text-sm">{errors.country}</p>
            )}
          </div>
          <Register
            imp="*"
            name="state"
            type="text"
            label="Province/State"
            handleInput={(e) => handleInput(e, setMailAddressData)}
            value={mailAddressData.state}
            errors={errors.state}
          />
          <Register
            imp="*"
            name="city"
            type="text"
            label="City/Town"
            handleInput={(e) => handleInput(e, setMailAddressData)}
            value={mailAddressData.city}
            errors={errors.city}
          />
          <Register
            imp="*"
            name="zipcode"
            type="number"
            label="Postal/Zip Code"
            handleInput={(e) => handleInput(e, setMailAddressData)}
            value={mailAddressData.zipcode}
            errors={errors.zipcode}
          />
        </div>
        {hide === true ? (
          <div className="flex justify-end mt-9 gap-4 ">
            <button
              className="border border-greyish text-black px-4 py-2 rounded"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              className="bg-primary text-white px-6 py-2 rounded"
              onClick={() => {
                handleSubmit();
                handleCancel();
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <FormNavigationButtons
            backLink="/student-form/1"
            backText="Back"
            buttonText="Submit and Continue"
            handleButtonClick={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default Form2;
