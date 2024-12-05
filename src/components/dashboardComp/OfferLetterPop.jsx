import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "../reusable/DragAndDrop";
import { SelectComponent } from "../reusable/Input";
import { useDispatch, useSelector } from "react-redux";
import { getDocumentAll } from "../../features/generalSlice";

const OfferLetterPop = ({
  isPopUp,
  docLabel,
  resetDoc, // State to reset file upload
  setResetDoc, // Function to set reset state
  handleFileUpload, // Function to handle file upload
  uploadedFiles, // Array of uploaded file URLs
  handleDeleteFile, // Function to delete uploaded file
  errors = {}, // Validation errors
  customClass = "", // Custom class for styling
  onSubmit,
  PopUpClose,
  studentId,
}) => {
  const dispatch = useDispatch();
  const { getAllDocuments } = useSelector((state) => state.general);
  const path = `/document/all-doc/${studentId}`
  useEffect(() => {
    dispatch(getDocumentAll({path}));
  }, [dispatch, isPopUp]);
  
  useEffect(() => {
    if (!isPopUp) {
      setResetDoc(true); 
    }
  }, [isPopUp, setResetDoc]);

  const handlePopupSubmit = () => {
    onSubmit();
    // Reset file upload input on submit
    setResetDoc(true);
    // Add a delay to allow the component to reset before closing the popup
    setTimeout(() => {
      setResetDoc(false);
      PopUpClose(); // Close the popup after reset
    }, 300); // Adjust the timeout if needed
  };
  const handleSelectChange = (e) => {
    const selectedUrl = e.target.value;
    if (selectedUrl) {
      handleFileUpload([ selectedUrl]);
    }
  };
  return (
    <>
      {isPopUp && (
        <div
          className={`fixed inset-0 font-poppins flex items-center justify-center popup-backdrop z-50 sm:px-52 px-6 ${
            isPopUp ? "block" : "hidden"
          }`}
        >
          <div className="bg-white pb-9 rounded-lg md:w-[68%] w-full relative p-9 flex flex-col items-center justify-center">
            <FileUpload
              label={docLabel}
              acceptedFormats={{
                "application/pdf": [".pdf"],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                  [".docx"],
                "application/msword": [".doc"],
              }}
              reset={resetDoc}
              setReset={setResetDoc}
              onFilesUploaded={handleFileUpload}
              customClass={customClass}
            />
            {errors.url && (
              <p className="text-red-500 mt-1 text-sm">{errors.url}</p>
            )}

            <hr className=" w-full" />

            <div className="w-full flex flex-col">
              <p className="text-[12px] text-body mt-1">
                Formats accepted are pdf
              </p>
              <hr className="border border-body w-full mt-8" />
              <span className="mt-3"> Select from the list*</span>
              <select
                name="documentSelect"
                id="documentSelect"
                className="w-full bg-input  h-10 rounded-md mt-1"
                onChange={handleSelectChange}
              >
                <option value="">Select Document</option>
                {getAllDocuments?.documents?.map((data, index) => (
                  <option key={index} value={data?.viewUrl}>
                    {data?.documentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-row justify-end gap-4 w-full mt-8">
              <button
                onClick={() => {
                  setResetDoc(false);
                  PopUpClose();
                }}
                className="border border-body rounded-md px-6 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handlePopupSubmit}
                className="bg-primary text-white rounded-md px-6 py-2"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OfferLetterPop;
