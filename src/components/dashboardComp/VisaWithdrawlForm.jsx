import React, { useEffect, useState } from "react";
import Register from "../reusable/Register";
import { CountrySelect } from "../reusable/Input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { withdrawVisa } from "../../features/generalApi";
import FileUpload from "../reusable/DragAndDrop";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { storage } from "../../utils/fireBase";
import { toast } from "react-toastify";
import { RiDeleteBin6Line } from "react-icons/ri";
import { v4 as uuidv4 } from "uuid";
import { chngeApplicationStatus } from "../../features/adminApi";
import { visaStatusData } from "../../features/generalSlice";
import socketServiceInstance from "../../services/socket";

const VisaWithdrawlForm = ({ choosedOption, studId }) => {
  const dispatch = useDispatch();

  const { countryOption } = useSelector((state) => state.general);
  const { studentInfoData } = useSelector((state) => state.student);
  const { agentData } = useSelector((state) => state.agent);
  const { studentData } = useSelector((state) => state.general);

  const { visaStatus } = useSelector((state) => state.general);

  const role = localStorage.getItem("role");
  const [bankData, setBankData] = useState({
    bankName: "",
    branchName: "",
    country: "",
    provinceState: "",
    address: "",
    city: "",
    postalCode: "",
    swiftBicCode: "",
    bankAccountName: "",
    bankAccountNumber: "",
    iban: "",
    adharCard: "",
    panCard: "",
  });
  const [parentData, setParentData] = useState({
    bankName: "",
    branchName: "",
    country: "",
    provinceState: "",
    address: "",
    city: "",
    postalCode: "",
    swiftBicCode: "",
    bankAccountName: "",
    bankAccountNumber: "",
    iban: "",
    parentAadharCard: "",
    parentPanCard: "",
  });
  const [resetAdharCard, setResetAdharCard] = useState(false);
  const [resetPanCard, setResetPanCard] = useState(false);
  const [resetPAdharCard, setResetPAdharCard] = useState(false);
  const [resetPPanCard, setResetPPanCard] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    //   dispatch(agentInformation());
  }, [dispatch]);
  const validateFields = () => {
    const newErrors = {};

    if (!bankData.bankName) newErrors.bankName = "Bank Name is required";
    if (!bankData.branchName) newErrors.branchName = "Branch Name is required";
    if (!bankData.country) newErrors.country = "Country is required";
    if (!bankData.provinceState)
      newErrors.provinceState = "State/Province is required";
    if (!bankData.address) newErrors.address = "Address is required";
    if (!bankData.city) newErrors.city = "City is required";
    if (!bankData.postalCode)
      newErrors.postalCode = "Zip/Postal Code is required";
    // if (!bankData.swiftBicCode)
    //   newErrors.swiftBicCode = "Swift/BIC Code is required";
    if (!bankData.bankAccountName)
      newErrors.bankAccountName = "Bank Account Name is required";
    if (!bankData.bankAccountNumber)
      newErrors.bankAccountNumber = "Bank Account Number is required";
    // if (!bankData.iban) newErrors.iban = "IBAN is required";
    if (!bankData.panCard) newErrors.panCard = "Pan Card is required";
    if (!bankData.adharCard) newErrors.adharCard = "Aadhar Card is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setBankData({ ...bankData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  const handleParentInput = (e) => {
    const { name, value } = e.target;
    setParentData({ ...parentData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  const handleFileUpload = async (files, uploadType) => {
    if (!files || files.length === 0) return;

    const file = files[0]; // Get the first file
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `uploads/withdrawal/${uniqueFileName}`);
    try {
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      toast.success(`${file.name} uploaded successfully!`);

      // Update the state based on the upload type
      if (uploadType === "adharCard") {
        setBankData((prevData) => ({
          ...prevData,
          adharCard: downloadURL, // Set single URL
        }));
      } else if (uploadType === "panCard") {
        setBankData((prevData) => ({
          ...prevData,
          panCard: downloadURL,
        }));
      } else if (uploadType === "parentPanCard") {
        setParentData((prevData) => ({
          ...prevData,
          parentPanCard: downloadURL,
        }));
      } else if (uploadType === "parentAadharCard") {
        setParentData((prevData) => ({
          ...prevData,
          parentAadharCard: downloadURL,
        }));
      }

      console.log("Updated bankData:", bankData);
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error(`Error uploading ${file.name}. Please try again.`);
    }
  };

  //delete image and file from firebase

  const deleteFile = async (fileUrl, uploadType) => {
    if (!fileUrl) return;

    const storageRef = ref(storage, fileUrl);

    try {
      await deleteObject(storageRef);
      toast.success("File deleted successfully!");

      // Update the state based on the upload type
      if (uploadType === "adharCard") {
        setBankData((prevData) => ({
          ...prevData,
          adharCard: "",
        }));
      } else if (uploadType === "panCard") {
        setBankData((prevData) => ({
          ...prevData,
          panCard: "",
        }));
      }
      if (uploadType === "parentAadharCard") {
        setParentData((prevData) => ({
          ...prevData,
          parentAadharCard: "",
        }));
      } else if (uploadType === "parentPanCard") {
        setParentData((prevData) => ({
          ...prevData,
          parentPanCard: "",
        }));
      }
        setResetAdharCard(true)
        setResetPanCard(true)
        setResetPAdharCard(true)
        setResetPPanCard(true)
      console.log("Updated bankData after delete:", bankData);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file. Please try again.");
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Run field validations first
    const isValid = validateFields();
  console.log(errors)
    // Proceed only if all fields are valid
    if (!isValid) {
      toast.error("Please fix the validation errors before submitting.");
      return;
    }

    try {
      const hasParentBankDetails = Object.values(parentData).some(
        (value) => value.trim() !== ""
      );

      const filteredBankData = {
        studentBankDetails: {
          bankName: bankData.bankName,
          branchName: bankData.branchName,
          country: bankData.country,
          province: bankData.provinceState,
          address: bankData.address,
          city: bankData.city,
          postalCode: bankData.postalCode,
          swiftBicCode: bankData.swiftBicCode,
          bankAccountName: bankData.bankAccountName,
          bankAccountNumber: bankData.bankAccountNumber,
          iban: bankData.iban,
        },
        ...(hasParentBankDetails && {
          parentBankDetails: {
            bankName: parentData.bankName,
            branchName: parentData.branchName,
            country: parentData.country,
            province: parentData.provinceState,
            address: parentData.address,
            city: parentData.city,
            postalCode: parentData.postalCode,
            swiftBicCode: parentData.swiftBicCode,
            bankAccountName: parentData.bankAccountName,
            bankAccountNumber: parentData.bankAccountNumber,
            iban: parentData.iban,
          },
        }),
        documentUpload: {
          aadharCard: bankData.adharCard,
          panCard: bankData.panCard,
          parentAadharCard: parentData.parentAadharCard,
          parentPanCard: parentData.parentPanCard
        },
        appliedFor: choosedOption,
        studentInformationId: visaStatus?.studentInformationId,
      };
      // Make the API call with the structured data
      const res = await withdrawVisa(filteredBankData);
      await chngeApplicationStatus(
        visaStatus?._id,
        "withdrawalrequest",
        "visa"
      );
      dispatch(visaStatusData(studId));

      // Show success message
      toast.success(res?.message || "Data added successfully");
      if (role === "2" ) {
        if (socketServiceInstance.isConnected()) {
          //from agent to admin
          const notificationData = {
            title: "   AGENT_REQUESTED_AMOUNT_WITHDRAWAL",
            message: `${agentData?.companyDetails?.businessName} ${agentData?.agId} has requested for withdrawal the amount for the student ${studentData?.studentInformation?.personalInformation?.firstName} ${studentData?.studentInformation?.personalInformation?.lastName} ${studentData?.studentInformation?.stId}`,
            path: "",
            path: "/student-profile",
            pathData: {
              studentId: studentData?.studentInformation?._id,
            },
            recieverId: "",
          };

          socketServiceInstance.socket.emit(
            "NOTIFICATION_AGENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
      if (role === "3" ) {
        if (socketServiceInstance.isConnected()) {
          //from student to admin
          const notificationData = {
            title: "   STUDENT_REQUESTED_AMOUNT_WITHDRAWAL",
            message: `${
              studentInfoData?.data?.studentInformation?.personalInformation
                .firstName +
              " " +
              studentInfoData?.data?.studentInformation?.personalInformation
                .lastName
            }  ${
              studentInfoData?.data?.studentInformation?.stId
            }  has requested for withdrawal `,
            path: "/student/visa-update",
            pathData: {
              studentId: studentInfoData?.data?.studentInformation?._id,
            },

            recieverId: "",
          };
          socketServiceInstance.socket.emit(
            "NOTIFICATION_STUDENT_TO_ADMIN",
            notificationData
          );
        } else {
          console.error("Socket connection failed, cannot emit notification.");
        }
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(error?.message || "Something went wrong during submission.");
    }
  };

  return (
    <>
      <div className="bg-white px-9 py-5 rounded-md">
        <p className="text-[15px] text-body ml-6 mb-5 font-medium">
          {`Student requested for the ${
            choosedOption === "courseFeeAndGic"
              ? "Course Fee and GIC"
              : choosedOption === "courseFee"
              ? "Course "
              : choosedOption === "gic"
              ? "GIC"
              : null
          } Fee amount withdrawal.`}
        </p>
        <div className="text-sidebar text-[22px] font-bold ml-6">
        Student  Bank Details{" "}
        </div>

        <div className="flex items-center justify-between gap-6 w-full px-6   rounded-md ">
          <span className="w-[50%]">
            <Register
            imp={"*"}
              name="bankName"
              type="text"
              label="Bank Name"
              handleInput={handleInput}
              value={bankData.bankName}
              errors={errors.bankName}
            />
            <CountrySelect
              notImp={false}
              name="country"
              label="Country"
              customClass="bg-input"
              options={countryOption}
              value={bankData.country}
              handleChange={(e) =>
                handleInput({
                  target: { name: "country", value: e.target.value },
                })
              }
              errors={errors.country}
            />
          </span>
          <span className="w-[50%]">
            <Register
            imp={"*"}

              name="branchName"
              type="text"
              label="Branch Name"
              handleInput={handleInput}
              value={bankData.branchName}
              errors={errors.branchName}
            />
            <Register
            imp={"*"}

              name="provinceState"
              type="text"
              label="Province/State"
              handleInput={handleInput}
              value={bankData.provinceState}
              errors={errors.provinceState}
            />
          </span>
        </div>
        <div className="px-6">
          <Register
            imp={"*"}

            name="address"
            type="text"
            label="Address"
            handleInput={handleInput}
            value={bankData.address}
            errors={errors.address}
            className=" py-2 "
          />
        </div>
        <div className="flex items-center justify-between gap-6 w-full px-6 ">
          <span className="w-[50%]">
            <Register
            imp={"*"}

              name="city"
              type="text"
              label="City"
              handleInput={handleInput}
              value={bankData.city}
              errors={errors.city}
            />

            <Register
            imp={"*"}

              name="bankAccountName"
              type="text"
              label="Bank Account Name"
              handleInput={handleInput}
              value={bankData.bankAccountName}
              errors={errors.bankAccountName}
            />
            <Register
              name="iban"
              type="text"
              label="IBAN"
              handleInput={handleInput}
              value={bankData.iban}
              errors={errors.iban}
            />
          </span>
          <span className="w-[50%]">
            <Register
            imp={"*"}

              name="postalCode"
              type="number"
              label="Zip/Postal Code"
              handleInput={handleInput}
              value={bankData.postalCode}
              errors={errors.postalCode}
            />

            <Register
            imp={"*"}

              name="bankAccountNumber"
              type="text"
              label="Bank Account Number"
              handleInput={handleInput}
              value={bankData.bankAccountNumber}
              errors={errors.bankAccountNumber}
            />
            <Register
              name="swiftBicCode"
              type="text"
              label="Swift/BIC Code"
              handleInput={handleInput}
              value={bankData.swiftBicCode}
              errors={errors.swiftBicCode}
            />
          </span>
        </div>

        <div className=" rounded-xl px-8 py-4 pb-12 -mt-4 mb-7">
          <FileUpload
            label="Upload Aadhar Card *"
            acceptedFormats={{
              "application/pdf": [".pdf"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "application/msword": [".doc"],
            }}
            reset={resetAdharCard}
            setReset={setResetAdharCard}
            onFilesUploaded={(files) => handleFileUpload(files, "adharCard")}
            customClass="border-dashed"
            value={bankData.adharCard}
          />
          {errors.adharCard && (
            <p className="text-red-500 mt-1 text-sm">{errors.adharCard}</p>
          )}
          {bankData.adharCard && (
            <div className="mt-4">
              <p className="text-secondary font-semibold">Uploaded Document:</p>
              <div className="flex items-center mt-2">
                <a
                  href={bankData.adharCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary rounded-sm px-6 py-2 border border-greyish"
                >
                  Uploaded Aadhar Card
                </a>
                <button
                  onClick={() => deleteFile(bankData.adharCard, "adharCard")}
                  className="ml-4 text-red-500 text-[21px]"
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          )}

          <FileUpload
            label="Upload Pan Card *"
            acceptedFormats={{
              "application/pdf": [".pdf"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "application/msword": [".doc"],
            }}
            reset={resetPanCard}
            setReset={setResetPanCard}
            onFilesUploaded={(files) => handleFileUpload(files, "panCard")}
            customClass="border-dashed"
            value={bankData.panCard}
          />
          {errors.panCard && (
            <p className="text-red-500 mt-1 text-sm">{errors.panCard}</p>
          )}
          {bankData.panCard && (
            <div className="mt-4">
              <p className="text-secondary font-semibold">Uploaded Document:</p>
              <div className="flex items-center mt-2">
                <a
                  href={bankData.panCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary rounded-sm px-6 py-2 border border-greyish "
                >
                  Uploaded Pan Card
                </a>
                <button
                  onClick={() => deleteFile(bankData.panCard, "panCard")}
                  className="ml-4 text-red-500 text-[21px]"
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-sidebar text-[22px] font-bold ml-6">
          Parent Bank Details{" "}
        </div>

        <div className="flex items-center justify-between gap-6 w-full px-6   rounded-md ">
          <span className="w-[50%]">
            <Register
            imp={"*"}

              name="bankName"
              type="text"
              label="Bank Name"
              handleInput={handleParentInput}
              value={parentData.bankName}
              // errors={errors.bankName}
            />
            <CountrySelect
              notImp={false}
              name="country"
              label="Country"
              customClass="bg-input"
              options={countryOption}
              value={parentData.country}
              handleChange={(e) =>
                handleParentInput({
                  target: { name: "country", value: e.target.value },
                })
              }
              // errors={errors.country}
            />
          </span>
          <span className="w-[50%]">
            <Register
            imp={"*"}

              name="branchName"
              type="text"
              label="Branch Name"
              handleInput={handleParentInput}
              value={parentData.branchName}
              // errors={errors.branchName}
            />
            <Register
            imp={"*"}

              name="provinceState"
              type="text"
              label="Province/State"
              handleInput={handleParentInput}
              value={parentData.provinceState}
              // errors={errors.provinceState}
            />
          </span>
        </div>
        <div className="px-6">
          <Register
            imp={"*"}

            name="address"
            type="text"
            label="Address"
            handleInput={handleParentInput}
            value={parentData.address}
            // errors={errors.address}
            className=" py-2 "
          />
        </div>
        <div className="flex items-center justify-between gap-6 w-full px-6 ">
          <span className="w-[50%]">
            <Register
            imp={"*"}

              name="city"
              type="text"
              label="City"
              handleInput={handleParentInput}
              value={parentData.city}
              // errors={errors.city}
            />

            <Register
            imp={"*"}

              name="bankAccountName"
              type="text"
              label="Bank Account Name"
              handleInput={handleParentInput}
              value={parentData.bankAccountName}
              // errors={errors.bankAccountName}
            />
            <Register
              name="iban"
              type="text"
              label="IBAN"
              handleInput={handleParentInput}
              value={parentData.iban}
              // errors={errors.iban}
            />
          </span>
          <span className="w-[50%]">
            <Register
            imp={"*"}

              name="postalCode"
              type="number"
              label="Zip/Postal Code"
              handleInput={handleParentInput}
              value={parentData.postalCode}
              // errors={errors.postalCode}
            />

            <Register
            imp={"*"}

              name="bankAccountNumber"
              type="text"
              label="Bank Account Number"
              handleInput={handleParentInput}
              value={parentData.bankAccountNumber}
              // errors={errors.bankAccountNumber}
            />
            <Register
              name="swiftBicCode"
              type="text"
              label="Swift/BIC Code"
              handleInput={handleParentInput}
              value={parentData.swiftBicCode}
              // errors={errors.swiftBicCode}
            />
          </span>
        </div>

        <div className=" rounded-xl px-8 py-4 pb-12 -mt-4 mb-7">
          <FileUpload
            label="Upload Aadhar Card *"
            acceptedFormats={{
              "application/pdf": [".pdf"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "application/msword": [".doc"],
            }}
            reset={resetPAdharCard}
            setReset={setResetPAdharCard}
            onFilesUploaded={(files) =>
              handleFileUpload(files, "parentAadharCard")
            }
            customClass="border-dashed"
            value={parentData.parentAadharCard}
          />
          {errors.parentAadharCard && (
            <p className="text-red-500 mt-1 text-sm">{errors.parentAadharCard}</p>
          )}
          {parentData.parentAadharCard && (
            <div className="mt-4">
              <p className="text-secondary font-semibold">Uploaded Document:</p>
              <div className="flex items-center mt-2">
                <a
                  href={parentData.parentAadharCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary rounded-sm px-6 py-2 border border-greyish"
                >
                  Uploaded Aadhar Card
                </a>
                <button
                  onClick={() =>
                    deleteFile(parentData.parentAadharCard, "parentAadharCard")
                  }
                  className="ml-4 text-red-500 text-[21px]"
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          )}

          <FileUpload
            label="Upload Pan Card *"
            acceptedFormats={{
              "application/pdf": [".pdf"],
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                [".docx"],
              "application/msword": [".doc"],
            }}
            reset={resetPPanCard}
            setReset={setResetPPanCard}
            onFilesUploaded={(files) =>
              handleFileUpload(files, "parentPanCard")
            }
            customClass="border-dashed"
            value={parentData.parentPanCard}
          />
          {errors.parentPanCard && (
            <p className="text-red-500 mt-1 text-sm">{errors.parentPanCard}</p>
          )}
          {parentData.parentPanCard && (
            <div className="mt-4">
              <p className="text-secondary font-semibold">Uploaded Document:</p>
              <div className="flex items-center mt-2">
                <a
                  href={parentData.parentPanCard}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary rounded-sm px-6 py-2 border border-greyish "
                >
                  Uploaded Pan Card
                </a>
                <button
                  onClick={() =>
                    deleteFile(parentData.parentPanCard, "parentPanCard")
                  }
                  className="ml-4 text-red-500 text-[21px]"
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <span className="flex justify-end mt-9 mb-20 mr-6">
        <span
          onClick={handleSubmit}
          className="bg-primary text-white rounded-md px-6 py-2 flex cursor-pointer"
        >
          Withdraw
        </span>
      </span>
    </>
  );
};

export default VisaWithdrawlForm;
