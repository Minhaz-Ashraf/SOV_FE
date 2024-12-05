import React, { useEffect, useState } from "react";
import { IoArrowBackSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { profilePic } from "../../assets";
import { RiDeleteBin6Line } from "react-icons/ri";
const ImageComponent = ({ src, alt, className, fallbackSrc }) => {
  const [imageSrc, setImageSrc] = useState(src);

  const handleError = () => {
    if (fallbackSrc) {
      setImageSrc(fallbackSrc); 
    } else {
      setImageSrc(profilePic); 
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      className={className}
      onError={handleError}
    />
  );
};

const CustomLnkButton = ({ text, link, className }) => {
  return (
    <Link to={link} className={className}>
      {text}
    </Link>
  );
};
const CustomButton = ({ text, className, handleClick }) => {
  return (
    <button onClick={handleClick} className={className}>
      {text}
    </button>
  );
};
const CustomInput = ({
  type,
  className,
  onChange,
  value,
  name,
  placeHodler,
  checked,
  handleClick,
}) => {
  return (
    <input
      type={type}
      className={className}
      onChange={onChange}
      onClick={handleClick}
      value={value}
      placeholder={placeHodler}
  checked={checked}
      name={name}
    />
  );
};

const RadioInputComponent = ({
  name,
  options,
  selectedValue,
  handleChange,
  customClass,
  radioClass,
}) => {
  return (
    <div className={customClass}>
      {options.map((option, index) => (
        <div key={index} className={radioClass}>
          <label className="flex items-center space-x-2 my-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleChange}
            />
            <span className="text-sm font-medium text-gray-700">
              {option.label}
            </span>
          </label>
        </div>
      ))}
    </div>
  );
};

const SelectComponent = ({ name, label, options, value, handleChange, notImp }) => {
  return (
    <div className="flex flex-col mb-4 mt-6 font-poppins">
      <label className="font-normal text-secondary mb-2 text-[14px]">
        {label} {notImp === true ? "" : "*"}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg text-secondary bg-input px-3 py-2 outline-none "
      >
        <option className="text-secondary font-poppins" value="">
          Select Options
        </option>
        {options?.map((option) => (
          <option key={option.id} value={ option.option || option.courseName}>
            {option.label || option.courseName}
          </option>
        ))}
      </select>
    </div>
  );
};
const ChartFilter = ({ name, label, options, value, handleChange, notImp }) => {
  return (
    <div className="flex flex-col mb-4 mt-6 font-poppins">
      <label className="font-normal text-secondary mb-2 text-[14px]">
        {label} {notImp === true ? "" : "*"}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg text-secondary bg-input px-3 py-2 outline-none "
      >
        <option className="text-secondary font-poppins" value="">
          Select Options
        </option>
        {options?.map((option) => (
          <option value={ option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
const InstituteComponent = ({ name, label, options, value, handleChange, customClass, imp }) => {
  return (
    <div className="flex flex-col mb-4 mt-6 font-poppins">
      <label className="font-normal text-secondary mb-2 text-[14px]">
        {label} {imp === false ? "" : "*"}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className={`border border-gray-300 text-secondary rounded-md px-3 py-2 outline-none  ${customClass}`}
      >
        <option className="text-secondary font-poppins" value="">
          Select Options
        </option>
        {options?.map((option) => (
          <option className="text-secondary" key={option._id} value={option.instituteName}>
            {option.instituteName}
          </option>
        ))}
      </select>
    </div>
  );
};
const CountrySelect = ({ name, label, options, value, handleChange, notImp, customClass}) => {
  return (
    <div className="flex flex-col mb-4 mt-6 font-poppins">
      <label className="font-normal text-secondary mb-2 text-[14px]">
        {label} {notImp === true ? "" : "*"}
      </label>
      <select
        name={name}
        value={value}
        onChange={handleChange}
        className={`border border-gray-300 rounded-lg text-secondary px-3 py-2 outline-none ${customClass}`}
      >
        <option className="text-secondary font-poppins" value="">
          Select Options
        </option>
        {options?.map((option) => (
          <option key={option?._id} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

const CustomTextArea = ({
  className,
  onChange,
  value,
  name,
  placeholder,
}) => {
  return (
    <textarea
      className={className}
      onChange={onChange}
      value={value}
      placeholder={placeholder}
      name={name}
    />
  );
};

const FormNavigationButtons = ({
  backLink = "/",
  backText = "Back",
  buttonText = "Submit",
  handleButtonClick,
  isButtonDisabled = false,
  buttonClass = "px-6 bg-primary text-white py-2 rounded-md",
}) => {
  return (
    <div className="flex flex-row justify-between mb-20 mt-8">
      <Link
       state={
         "passPage" 
       }
        to={backLink}
        className="text-secondary gap-2 flex items-center bg-white px-6 py-2 cursor-pointer rounded-md"
      >
        <IoArrowBackSharp />
        {backText}
      </Link>

      <CustomButton
        handleClick={handleButtonClick}
        text={buttonText}
        className={buttonClass}
        disabled={isButtonDisabled}
      />
    </div>
  );
};

const CheckboxGroup = ({
  options,
  onChange,
  customClass,
  inputClass,
  bindClass,
  value, // Added value prop to receive selected values from the parent
}) => {
  const handleCheckboxChange = (event) => {
    const { value: checkboxValue, checked } = event.target; // Use checkboxValue to avoid shadowing
    let updatedSelectedValues;

    if (checked) {
      updatedSelectedValues = [...value, checkboxValue]; // Add the new checked value
    } else {
      updatedSelectedValues = value.filter((item) => item !== checkboxValue); // Remove the unchecked value
    }

    onChange(updatedSelectedValues); // Call the onChange prop with the updated values
  };

  return (
    <div className={`${customClass}`}>
      {options.map((option) => (
        <div
          key={option.id}
          className={`space-x-3 font-poppins text-[#303031] text-[15px] ${bindClass}`}
        >
          <input
            type="checkbox"
            id={`checkbox-${option.id}`}
            value={option.option}
            checked={value?.includes(option.option)} // Use the value prop from the parent
            onChange={handleCheckboxChange}
            className={`${inputClass}`}
          />
          <label htmlFor={`checkbox-${option.id}`}>{option.label}</label>
        </div>
      ))}
    </div>
  );
};






const FileUpload = ({
  label = "Upload File",
  acceptedFormats = ["image/jpeg", "image/png", "application/pdf"],
  onFileSelect,
  deleteFile,
  name,
  customClass,
  errorMessage = "Please use JPG, JPEG, PNG, and PDF format.",
  fileUrl, 
  maxFileSizeMB = 5,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(fileUrl || null);
  const [fileName, setFileName] = useState("No file selected");

  useEffect(() => {
    if (fileUrl) {
      const extractedFileName = fileUrl.split("/").pop(); 
      setFileName(extractedFileName);
      setPreviewUrl(fileUrl); 
    }
  }, [fileUrl]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      if (!acceptedFormats.includes(file.type)) {
        setError(errorMessage);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileName("No file selected");
        return;
      }

      const fileSizeMB = file.size / 1024 / 1024;
      if (fileSizeMB > maxFileSizeMB) {
        setError(`File size should not exceed ${maxFileSizeMB}MB`);
        setSelectedFile(null);
        setPreviewUrl(null);
        setFileName("No file selected");
        return;
      }

      setSelectedFile(file);
      setError("");
      setPreviewUrl(URL.createObjectURL(file));
      setFileName(file.name); 

      if (onFileSelect) onFileSelect(file);
    }
  };

  const handleDelete = () => {
    if (deleteFile) {
      deleteFile();
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileName("No file selected");
  };

  const handlePreview = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank");
    }
  };

  return (
    <div className={`flex flex-col gap-2 font-poppins ${customClass}`}>
      <label className="text-[14px] text-secondary">{label}</label>
      <div className="flex flex-row-reverse items-center gap-2">
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id={`file-input-${name}`}
          name={name}
          disabled={!!selectedFile || fileUrl} 
          accept={acceptedFormats.join(",")}
        />
        <label
          htmlFor={`file-input-${name}`}
          className={`px-4 py-2 ${selectedFile || fileUrl ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white"} border rounded cursor-pointer`}
        >
          Browse
        </label>
        <div
          className="flex-1 px-4 py-2 border border-gray-300 text-[14px] rounded text-secondary bg-input cursor-pointer"
          onClick={handlePreview}
        >
          {fileName.slice(0, 28)} {/* Display the file name */}
        </div>
        {(selectedFile || fileUrl) && (
          <button
            type="button"
            onClick={handleDelete}
            className="px-2 py-2 bg-primary text-white rounded"
          >
            <RiDeleteBin6Line />
          </button>
        )}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <small className="text-gray-500">{errorMessage}</small>
    </div>
  );
};


export {
  FileUpload,
  CheckboxGroup,
  FormNavigationButtons,
  ImageComponent,
  CustomButton,
  CustomLnkButton,
  CustomInput,
  RadioInputComponent,
  SelectComponent,
  CustomTextArea,
  InstituteComponent,
  CountrySelect, 
  ChartFilter

};
export default ImageComponent;
