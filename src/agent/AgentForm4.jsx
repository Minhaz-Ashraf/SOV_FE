import React, { useEffect, useState } from "react";
import {
  CheckboxGroup,
  CountrySelect,
  FileUpload,
  FormNavigationButtons,
  RadioInputComponent,
  SelectComponent,
} from "../components/reusable/Input";
import {
  interestedDestinationOption,
  interestedProgramsOption,
  licenceOption,
  regTypeOption,
  sourceOfFinanceOption,
  titleOption,
  yearOpton,
} from "../constant/data";
import Register from "../components/reusable/Register";
import { formFourSubmit } from "../features/agentApi";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../utils/fireBase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { agentInformation } from "../features/agentSlice";
import { v4 as uuidv4 } from 'uuid';
import { editAgentAdmin } from "../features/adminApi";
import { agentDataProfile } from "../features/adminSlice";

const AgentForm4 = ({ hide, handleCancel, updateData, adminId, agentId }) => {
  const role = localStorage.getItem('role')

  const { countryOption } = useSelector((state) => state.general);
  const { agentData } = useSelector((state) => state.agent);
  const { agentProfile } = useSelector((state) => state.admin);
  const getData = role === "0" ? agentProfile?.companyOverview :agentData?.companyOverview;

  const navigate = useNavigate();

  const [overviewData, setOverviewData] = useState({
    businessOperationStartYear: "",
    numberOfStudents: "",
    popularDestinations: ["", "", ""],
    studentSourceCountry: "",
    governmentLicensed: "",
    businessRegistrationNumber: "",
    businessRegistrationType: "",
    businessRegistrationDocument: "",
    businessProfileDocument: "",
    companyGST: "",
    companyPan: "",
    higherEducationProgrammes: [],
    financeSources: [],
    studyDestinations: [],
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const editForm = hide === true ? "edit" : null;

  useEffect(() => {
    dispatch(agentInformation());
  }, [dispatch]);
  const handleInput = (e) => {
    const { name, value, type } = e.target;

    const newValue =
      name === "numberOfStudents" ? parseInt(value, 10) || "" : value;

    setOverviewData((prev) => ({ ...prev, [name]: newValue }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handlePopularDestinationsChange = (index, value) => {
    const updatedDestinations = [...overviewData.popularDestinations];
    updatedDestinations[index] = value;
    setOverviewData((prev) => ({
      ...prev,
      popularDestinations: updatedDestinations,
    }));
    if (errors.popularDestinations) {
      setErrors((prev) => ({ ...prev, popularDestinations: "" }));
    }
  };

  const handleCheckboxGroupChange = (newSelectedValues) => {
    setOverviewData((prev) => ({
      ...prev,
      higherEducationProgrammes: newSelectedValues,
    }));
    if (errors.higherEducationProgrammes) {
      setErrors((prev) => ({ ...prev, higherEducationProgrammes: "" }));
    }
  };

  const handleCheckboxGroup = (newSelectedValues) => {
    setOverviewData((prev) => ({
      ...prev,
      financeSources: newSelectedValues,
    }));
    if (errors.financeSources) {
      setErrors((prev) => ({ ...prev, financeSources: "" }));
    }
  };

  const handleCheckbox = (newSelectedValues) => {
    setOverviewData((prev) => ({
      ...prev,
      studyDestinations: newSelectedValues,
    }));
    if (errors.studyDestinations) {
      setErrors((prev) => ({ ...prev, studyDestinations: "" }));
    }
  };

  const validateFields = () => {
    let formErrors = {};

    if (!overviewData.businessOperationStartYear) {
      formErrors.businessOperationStartYear =
        "Please select the starting year of business operation.";
    }
    if (!overviewData.numberOfStudents) {
      formErrors.numberOfStudents = "Please enter the number of students.";
    }
    if (overviewData.popularDestinations.some((dest) => !dest)) {
      formErrors.popularDestinations =
        "Please select the most popular destinations.";
    }
    if (!overviewData.governmentLicensed) {
      formErrors.governmentLicensed =
        "Please select if your business is licensed.";
    }
    if (!overviewData.businessRegistrationDocument) {
      formErrors.businessRegistrationDocument =
        "Please upload required document.";
    }
    if (!overviewData.businessProfileDocument) {
      formErrors.businessProfileDocument = "Please upload required document.";
    }
    if (!overviewData.businessRegistrationNumber) {
      formErrors.businessRegistrationNumber =
        "Please enter the business registration number.";
    }
    if (!overviewData.companyPan && !overviewData.companyGST) {
      formErrors.companyPan = "Please upload Company PAN or Company GST.";
      formErrors.companyGST = "Please upload Company PAN or Company GST.";
    }
  
 
    setErrors(formErrors);

    return Object.keys(formErrors).length === 0;
  };

  const handleFileSelect = async (name, file) => {
    console.log("Selected file:", file);
    if (!file) return;

    // const storageRef = ref(storage, `files/${file?.name}`);
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `files/Company/${uniqueFileName}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded file:", snapshot);
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log("File available at:", downloadURL);

      setOverviewData((prevData) => ({
        ...prevData,
        [name]: downloadURL,
      }));

      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error.code);
      toast.error("Error uploading file. Please try again.");
    }
  };

  const deleteFile = async (fileUrl, uploadType) => {
    if (!fileUrl) return;

    const storageRef = ref(storage, fileUrl);

    try {
      await deleteObject(storageRef);
      // toast.success("File deleted successfully!");

      if (uploadType === "businessRegistrationDocument") {
        setOverviewData((prevData) => ({
          ...prevData,
          businessRegistrationDocument: "",
        }));
      } else if (uploadType === "businessProfileDocument") {
        setOverviewData((prevData) => ({
          ...prevData,
          businessProfileDocument: "",
        }));
      } else if (uploadType === "companyGST") {
        setOverviewData((prevData) => ({
          ...prevData,
          companyGST: "",
        }));
      } else if (uploadType === "companyPan") {
        setOverviewData((prevData) => ({
          ...prevData,
          companyPan: "",
        }));
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      // toast.error("Error deleting file. Please try again.");
    }
  };

  //getData
  useEffect(() => {
    if (getData) {
      setOverviewData((prevData) => ({
        ...prevData,
        businessOperationStartYear:
          getData.businessOperationStartYear ||
          prevData.businessOperationStartYear,
        numberOfStudents: getData.numberOfStudents || prevData.numberOfStudents,
        popularDestinations:
          getData.popularDestinations || prevData.popularDestinations,
        studentSourceCountry:
          getData?.studentSourceCountry || prevData.studentSourceCountry,
        governmentLicensed:
          getData.governmentLicensed || prevData.governmentLicensed,
        businessRegistrationNumber:
          getData.businessRegistrationNumber ||
          prevData.businessRegistrationNumber,
        businessRegistrationType:
          getData.businessRegistrationType || prevData.businessRegistrationType,
        businessRegistrationDocument:
          getData.businessRegistrationDocument ||
          prevData.businessRegistrationDocument,
        businessProfileDocument:
          getData.businessProfileDocument || prevData.businessProfileDocument,
        companyGST: getData.companyGST || prevData.companyGST,
        companyPan: getData.companyPan || prevData.companyPan,
        higherEducationProgrammes:
          getData.higherEducationProgrammes ||
          prevData.higherEducationProgrammes,
        financeSources: getData.financeSources || prevData.financeSources,
        studyDestinations:
          getData.studyDestinations || prevData.studyDestinations,
      }));
    }
  }, [getData]);

  const handleSubmit = async () => {
    if (validateFields()) {
      try {
        console.log("Submitting data:", overviewData);
        const payload = {
          ...overviewData,
          ...(role === "0" && { companyId: adminId }),
        };
        
        let res;

        if (role === "0") {
          await editAgentAdmin("/company/register-companyOverview-admin", payload, editForm);
        } else {
          res = await formFourSubmit(payload, editForm);
        }
        if(role === "0"){
          dispatch(agentDataProfile(agentId));
        }
      

     

        toast.success(res?.message || "Data added successfully");
        {
          hide === true
            ? updateData()
            : navigate("/agent-form/5", { state: "passPage" });
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.message || "Something went wrong");
      }
    } else {
      toast.error("Please fill in all required fields correctly.");
    }
  };
  return (
    <div className="min-h-screen font-poppins">
      <div className={`${hide === true ? "" : "md:mx-48 sm:mx-10"}`}>
        {hide === true ? (
          ""
        ) : (
          <>
            <p className="text-heading font-semibold text-[25px] pt-7">
              Company Overview
            </p>
          </>
        )}
        <div
          className={`bg-white rounded-xl ${
            hide === true ? "" : "px-8"
          } py-4 pb-12 mt-6`}
        >
          <div className="flex items-start justify-between gap-6 w-full">
            <span className="w-[50%]">
              <SelectComponent
                notImp={false}
                name="businessOperationStartYear"
                label="Starting Year of Business Operation"
                options={yearOpton}
                value={overviewData.businessOperationStartYear}
                handleChange={handleInput}
                errors={errors.businessOperationStartYear}
              />
              <CountrySelect
                notImp={false}
                name="popularDestinations[0]"
                label="In your market, which countries are the most popular destinations? Please rank them from the most to least popular."
                options={countryOption}
                customClass="bg-input"
                value={overviewData.popularDestinations[0]}
                handleChange={(e) =>
                  handlePopularDestinationsChange(0, e.target.value)
                }
                errors={errors.popularDestinations}
              />
              <CountrySelect
                name="popularDestinations[1]"
                label="Popular Destination 2"
                customClass="bg-input"
                options={countryOption}
                value={overviewData.popularDestinations[1]}
                handleChange={(e) =>
                  handlePopularDestinationsChange(1, e.target.value)
                }
              />
              <CountrySelect
                name="popularDestinations[2]"
                label="Popular Destination 3"
                customClass="bg-input"
                options={countryOption}
                value={overviewData.popularDestinations[2]}
                handleChange={(e) =>
                  handlePopularDestinationsChange(2, e.target.value)
                }
              />
            </span>
            <span className="w-[50%]">
              <Register
                imp="*"
                name="numberOfStudents"
                type="number"
                label="How many students have you sent so far?"
                handleInput={handleInput}
                value={overviewData.numberOfStudents}
                errors={errors.numberOfStudents}
              />
              <CountrySelect
                name="studentSourceCountry"
                label="Country"
                customClass="bg-input"
                options={countryOption}
                value={overviewData.studentSourceCountry}
                handleChange={handleInput}
                errors={errors.studentSourceCountry}
              />
            </span>
          </div>
          <div className="text-secondary text-[14px] mt-6 ">
            Is your business licensed by the government of your country? *
          </div>
          <RadioInputComponent
            name="governmentLicensed"
            options={licenceOption}
            selectedValue={overviewData.governmentLicensed}
            handleChange={handleInput}
            customClass="flex justify-start space-x-28"
          />
          {errors.governmentLicensed && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.governmentLicensed}
            </p>
          )}
          <span className="w-[50%]">
            <Register
              name="businessRegistrationNumber"
              type="text"
              label="Business Registration Number"
              handleInput={handleInput}
              value={overviewData.businessRegistrationNumber}
              errors={errors.businessRegistrationNumber}
            />
            <SelectComponent
              notImp={true}
              name="businessRegistrationType"
              label="Business Registration Type"
              options={regTypeOption}
              value={overviewData.businessRegistrationType}
              handleChange={handleInput}
              errors={errors.businessRegistrationType}
            />
          </span>
          <div className="flex   items-baseline justify-between gap-6 w-full">
            <span className="w-[50%] ">
              <FileUpload
                label="Company GST"
                onFileSelect={(file) =>
                  handleFileSelect("companyGST", file)
                }
                deleteFile={() =>
                  deleteFile(
                    overviewData.companyGST,
                    "companyGST"
                  )
                }
                name="companyGST"
                fileUrl={overviewData.companyGST}
              />
              {errors.companyGST && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.companyGST}
                </p>
              )}
              <div className="mt-4">
                <FileUpload
                  label="Company Pan Card"
                  onFileSelect={(file) =>
                    handleFileSelect("companyPan", file)
                  }
                  deleteFile={() =>
                    deleteFile(
                      overviewData.companyPan,
                      "companyPan"
                    )
                  }
                  name="companyPan"
                  fileUrl={overviewData.companyPan}
                />
                {errors.companyPan && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.companyPan}
                  </p>
                )}
              </div>
            </span>
            <span className="w-[50%] ">
              <FileUpload
                label="Business Registration Document"
                onFileSelect={(file) =>
                  handleFileSelect("businessRegistrationDocument", file)
                }
                deleteFile={() =>
                  deleteFile(
                    overviewData.businessRegistrationDocument,
                    "businessRegistrationDocument"
                  )
                }
                name="businessRegistrationDocument"
                fileUrl={overviewData.businessRegistrationDocument}
              />
              {errors.businessRegistrationDocument && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.businessRegistrationDocument}
                </p>
              )}
              <div className="mt-4">
                <FileUpload
                  label="Business Profile Document"
                  onFileSelect={(file) =>
                    handleFileSelect("businessProfileDocument", file)
                  }
                  deleteFile={() =>
                    deleteFile(
                      overviewData.businessProfileDocument,
                      "businessProfileDocument"
                    )
                  }
                  name="businessProfileDocument"
                  fileUrl={overviewData.businessProfileDocument}
                />
                {errors.businessProfileDocument && (
                  <p className="text-red-500 mt-1 text-sm">
                    {errors.businessProfileDocument}
                  </p>
                )}
              </div>
            </span>
          </div>
          <div className="text-secondary text-[14px] mt-6 ">
            What type of Higher Education Programmes are your Customer
            interested in?
          </div>
          <CheckboxGroup
            options={interestedProgramsOption}
            onChange={handleCheckboxGroupChange}
            value={overviewData.higherEducationProgrammes}
            customClass="flex  flex-wrap  justify-start items-start  "
            inputClass="mt-1"
            bindClass="flex items-start w-56 mt-6"
            errors={errors.higherEducationProgrammes}
          />
          {errors.higherEducationProgrammes && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.higherEducationProgrammes}
            </p>
          )}
          <div className="text-secondary text-[14px] mt-6 ">
            What are the most common sources of finance of your students?
          </div>
          <CheckboxGroup
            options={sourceOfFinanceOption}
            onChange={handleCheckboxGroup}
            value={overviewData.financeSources}
            customClass="flex  flex-wrap  justify-start items-start"
            inputClass="mt-1"
            bindClass="flex items-start w-56 mt-6"
          />
          {errors.financeSources && (
            <p className="text-red-500 mt-1 text-sm">{errors.financeSources}</p>
          )}
          <div className="text-secondary text-[14px] mt-6  ">
            I am interested in receiving product information on the following
            destination?
          </div>
          <CheckboxGroup
            options={interestedDestinationOption}
            onChange={handleCheckbox}
            value={overviewData.studyDestinations}
            customClass="flex  flex-wrap  justify-start items-start"
            inputClass="mt-1"
            bindClass="flex items-start w-56 mt-6"
          />
          {errors.studyDestinations && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.studyDestinations}
            </p>
          )}
        </div>

        {hide === true ? (
          <div className="flex justify-end mt-9 gap-4 ">
            <button
              className="border border-greyish text-black px-4 py-2 rounded"
              onClick={() => handleCancel("isFour")}
            >
              Cancel
            </button>
            <button
              className="bg-primary text-white px-6 py-2 rounded"
              onClick={() => {
                handleSubmit();
                handleCancel("isFour");
              }}
            >
              Save
            </button>
          </div>
        ) : (
          <FormNavigationButtons
            backLink="/agent-form/3"
            backText="Back"
            buttonText="Submit and Continue"
            handleButtonClick={handleSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default AgentForm4;
