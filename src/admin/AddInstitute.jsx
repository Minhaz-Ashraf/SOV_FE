import React, { useEffect, useState } from "react";
import Header from "../components/dashboardComp/Header";
import AdminSidebar from "../components/dashboardComp/AdminSidebar";
import ImageComponent, { CustomInput, SelectComponent } from "../components/reusable/Input";
import { ImBin } from "react-icons/im";
import { addInstitute, editInstitute } from "../features/adminApi";
import { useDispatch, useSelector } from "react-redux";
import Register from "../components/reusable/Register";
import FileUpload from "../components/reusable/DragAndDrop";
import { toast } from "react-toastify";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../utils/fireBase";
import { useLocation } from "react-router-dom";
import { getSingleInstitute } from "../features/adminSlice";
import PopUp from "../components/reusable/PopUp";
import { greenTick } from "../assets";
import { Select } from "antd";
// import { intakeOptions } from "../constant/data";
import { useNavigate } from "react-router-dom";
import { intakeOption, statusOptionData } from "../constant/data";

const AddInstitute = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = location?.state?.id;
  // console.log(id);
  const { instituteById } = useSelector((state) => state.admin);
  const { prefCountryOption } = useSelector((state) => state.general);
  const [instituteData, setInstituteData] = useState({
    instituteImage: "",
    country: "",
    instituteName: "",
    offerLetterPrice: "",
    about: "",
    highlights: "",
    popularCourse: "",
    facilities: "",
    inTake: [],
    status: ""
  });
  const [isCustomCountry, setIsCustomCountry] = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reset, setReset] = useState(false);
  const [isConfirmPopUp, setIsConfirmPopUp] = useState(false);

  const confirmPopUpOpen = () => {
    setIsConfirmPopUp(true);
  };
  const confirmPopUpClose = () => {
    setIsConfirmPopUp(false);
  };
  useEffect(() => {
    // setLoading(true);
    dispatch(getSingleInstitute(id));

    // setLoading(false);
  }, [id]);

  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;

    const uniqueFiles = files.filter(
      (file) =>
        !newFiles.some((existingFile) => existingFile.name === file.name) &&
        !deletedFiles.some((deletedFileUrl) =>
          deletedFileUrl.includes(file.name)
        )
    );

    if (uniqueFiles.length === 0) {
      toast.warn("Duplicate or previously deleted files are not allowed.");
      return;
    }

    setNewFiles((prevState) => [...prevState, ...uniqueFiles]);

    const blobUrls = uniqueFiles.map((file) => URL.createObjectURL(file));
    setInstituteData((prevData) => ({
      ...prevData,
      instituteImage: blobUrls[0],
    }));
  };

  const handleCountryChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === "Other") {
      setIsCustomCountry(true);
      setInstituteData((prev) => ({
        ...prev,
        country: "",
      }));
    } else {
      setIsCustomCountry(false);
      setInstituteData((prev) => ({
        ...prev,
        country: selectedValue,
      }));
    }
  };

  const handleCustomCountryChange = (e) => {
    const customValue = e.target.value;
    setInstituteData((prev) => ({
      ...prev,
      country: customValue,
    }));
  };
  // File deletion handler
  const deleteFile = (fileUrl) => {
    if (!fileUrl) return;

    const isFirebaseUrl = fileUrl.startsWith("http");

    if (isFirebaseUrl) {
      setDeletedFiles((prevState) => [...prevState, fileUrl]);
    }

    setInstituteData((prevData) => ({
      ...prevData,
      instituteImage: "",
    }));
    setResetProfilePic(true);
    //   toast.info("File has been marked for deletion.");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;

    setInstituteData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleInputSelect = (field, selectedValues) => {
    // console.log(field, selectedValues)
    setInstituteData((prevState) => ({
      ...prevState,
      [field]: selectedValues,
    }));
  };
  // Validation logic
  // const validateFields = () => {
  //   const validationErrors = {};
  //   const {
  //     instituteName,
  //     offerLetterPrice,
  //     country,
  //     highlights,
  //     about,
  //     popularCourse,
  //     inTake,
  //   } = instituteData;

  //   if (!country) validationErrors.country = "Country is required.";
  //   if (!instituteName)
  //     validationErrors.instituteName = "Institute name is required.";
  //   if (!offerLetterPrice)
  //     validationErrors.offerLetterPrice = "Offer letter price is required.";
  //   if (!about) validationErrors.about = "About is required.";
  //   if (!highlights) validationErrors.highlights = "Highlights is required.";
  //   if (!popularCourse)
  //     validationErrors.popularCourse = "Popular courses is required.";
  //   if (!inTake) validationErrors.inTake = "InTake is required.";

  //   return validationErrors;
  // };

  const handleSubmit = async () => {
    // const validationErrors = validateFields();

    // if (Object.keys(validationErrors).length > 0) {
    //   setErrors(validationErrors);
    //   toast.error("Please fill in all required fields.");
    //   console.log(errors);
    //   return;
    // }

    try {
      setIsSubmitting(true);

      // Handle deletions
      for (const fileUrl of deletedFiles) {
        const storageRef = ref(storage, fileUrl);
        try {
          await deleteObject(storageRef);
        } catch (error) {
          console.error(`Error deleting file: ${fileUrl}`);
        }
      }

      let instituteImage = instituteData.instituteImage;

      for (const file of newFiles) {
        const storageRef = ref(storage, `uploads/institute/${file.name}`);
        try {
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);

          instituteImage = downloadURL;
          setInstituteData((prevData) => ({
            ...prevData,
            instituteImage: downloadURL,
          }));
        } catch (error) {
          toast.error(`Error uploading ${file.name}.`);
        }
      }

      const payload = {
        instituteName: instituteData?.instituteName,
        instituteImg: instituteImage,
        country: instituteData.country,
        offerLetterPrice: instituteData.offerLetterPrice,
        aboutCollegeOrInstitute: instituteData.about,
        keyHighlights: instituteData.highlights,
        popularCourses: instituteData.popularCourse,
        admissionAndFacilities: instituteData.facilities,
        inTake: instituteData.inTake,
        status: instituteData.status,
      };

      // Submit the data
      const isEditMode = location?.state?.edit === "edit";
      const res = isEditMode 
        ? await editInstitute(id, payload) 
        : await addInstitute(payload);
      

      //   dispatch(adminProfileData())
      toast.success(res.message || "Institute added successfully.");
      setNewFiles([]);
      setDeletedFiles([]);
      navigate("/admin/institute");
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (instituteById?.data) {
      setInstituteData({
        instituteImage: instituteById.data.instituteImg || "",
        country: instituteById.data.country || "",
        instituteName: instituteById.data.instituteName || "",
        about: instituteById.data.aboutCollegeOrInstitute || "",
        popularCourse: instituteById.data.popularCourses || "",
        highlights: instituteById.data.keyHighlights || "",
        facilities: instituteById.data.admissionAndFacilities || "",
        offerLetterPrice: instituteById.data.offerLetterPrice || "",
        inTake: instituteById.data.inTake || "",
        status: instituteById?.data?.status || "",
      });
    }
  }, [instituteById]);

  return (
    <>
      <Header customLink="/agent/shortlist" />
      <div>
        <span className="fixed overflow-y-scroll scrollbar-hide  bg-white">
          <AdminSidebar />
        </span>
      </div>
      <div className=" bg-white">
        <span className="flex items-center pt-16 md:ml-[16.5%] sm:ml-[22%]  ">
          <span>
            <p className="text-[28px] font-bold text-sidebar mt-4 ml-9">
              Add Institutions
            </p>
            <p className="mt-1 font-normal text-body ml-9  mb-2">
              Easily add and manage all your listed institutions.
            </p>
          </span>
        </span>
      </div>

      <div className=" mb-2 md:ml-[31.5%] md:mr-[16%] sm:ml-[26%] md:mt-12 mt-6 text-[20px] sm:mx-[6%] text-secondary">
        <div className="bg-white px-9 py-9 text-[16px] mb-20">
          <FileUpload
            label="Upload Institute Image"
            acceptedFormats={{
              "image/png": [".png"],
              "image/jpeg": [".jpeg", ".jpg"],
            }}
            onFilesUploaded={(files) =>
              handleFileUpload(files, "instituteImage")
            }
            reset={reset}
            setReset={setReset}
            customClass=" border-dashed text-[14px]"
            value={instituteData.instituteImage}
          />
          {/* {errors.instituteImage && (
            <p className="text-red-500 mt-1 text-sm">{errors.instituteImage}</p>
          )} */}
          {instituteData.instituteImage && (
            <div className="relative">
              <ImageComponent
                src={instituteData.instituteImage}
                className="w-24 h-24 rounded-xl border border-black mt-6"
              />
              <span
                onClick={() =>
                  deleteFile(instituteData.instituteImage, "instituteImage")
                }
                className="absolute text-primary top-1 left-[70px]  text-[20px] cursor-pointer rounded-md"
              >
                <ImBin />
              </span>
            </div>
          )}
          <div className=" mt-6  text-[14px] w-full">
            <span className="flex flex-col">
              <span className="text-[15px] text-secondary ">
                {" "}
                Country {" "}
              </span>{" "}
              <div>
                <select
                  name="country"
                  value={isCustomCountry ? "Other" : instituteData.country}
                  onChange={handleCountryChange}
                  className="mt-2 outline-none h-11 w-full rounded-md px-4 font-poppins text-body bg-input"
                >
                  <option value="" disabled>
                    Select a country
                  </option>
                  {prefCountryOption.map((country) => (
                    <option key={country?._id} value={country}>
                      {country}
                    </option>
                  ))}
                  <option value="Other">Other</option>
                </select>

                {isCustomCountry && (
                  <input
                    type="text"
                    name="country"
                    value={instituteData.country}
                    onChange={handleCustomCountryChange}
                    placeholder="Enter country"
                    className="mt-2 outline-none h-11 w-full rounded-md px-4 font-poppins text-body bg-input"
                  />
                )}

                {/* {errors.country && (
                  <p className="text-red-500 mt-1">{errors.country}</p>
                )} */}
              </div>
              <div className="flex items-center gap-3 justify-between w-full">
              <span className=" w-1/2">
              <Register
                // imp="*"
                name="instituteName"
                type="text"
                label="Institute Name"
                handleInput={handleInput}
                value={instituteData.instituteName}
                // errors={errors.instituteName}
              /></span>
              <span className=" w-1/2 ">
              <SelectComponent
              notImp={true}
                  name="status"
                  label="Institute Status"
                  options={statusOptionData}
                  value={instituteData.status}
                  handleChange={handleInput}
                />
              </span>
              </div>
              <Register
                // imp="*"
                name="offerLetterPrice"
                type="number"
                label="Offer Letter Price"
                handleInput={handleInput}
                value={instituteData.offerLetterPrice}
                // errors={errors.offerLetterPrice}
              />
              <div className="mt-6">
              <span className="text-[15px]  text-secondary ">
                {" "}
                Intake {" "}
              </span>
              <Select
                mode="multiple"
                allowClear
                className="mt-2  "
                value={instituteData.inTake}
                style={{ width: "100%",  background: "#F2F5F7",
                  height: "40px", }}
                placeholder="Please select intake"
                onChange={(selectedValues) =>
                  handleInputSelect("inTake", selectedValues)
                } 
                options={intakeOption.map((data) => ({
                value: data.option,
                label: data.lablel,
              }))}
              />
              </div>
              <span className="text-[15px] text-secondary mt-6 ">
                {" "}
                About the institute 
              </span>{" "}
              <textarea
                name="about"
                type="text"
                placeholder="About the institute"
                className="bg-input mt-2 w-full h-28 p-3 text-[14px] outline-none rounded-md"
                onChange={handleInput}
                value={instituteData.about}
              />
              {/* {errors.about && (
                <p className="text-red-500 mt-1 text-sm">{errors.about}</p>
              )} */}
              <span className="text-[15px] text-secondary mt-6 ">
                {" "}
                Key Highlights 
              </span>{" "}
              <textarea
                name="highlights"
                type="text"
                placeholder="Key Highlights"
                className="bg-input mt-2 w-full h-28 p-3 text-[14px] outline-none rounded-md"
                onChange={handleInput}
                value={instituteData.highlights}
              />
              {/* {errors.highlights && (
                <p className="text-red-500 mt-1 text-sm">{errors.highlights}</p>
              )} */}
              <span className="text-[15px] text-secondary mt-6 ">
                {" "}
                Popular Courses 
              </span>{" "}
              <textarea
                name="popularCourse"
                type="text"
                placeholder="Popular Courses"
                className="bg-input mt-2 w-full h-28 p-3 text-[14px] outline-none rounded-md"
                onChange={handleInput}
                value={instituteData.popularCourse}
              />
              {/* {errors.popularCourse && (
                <p className="text-red-500 mt-1 text-sm">
                  {errors.popularCourse}
                </p>
              )} */}
              <span className="text-[15px] text-secondary mt-6 ">
                {" "}
                Admission Facilitities and Charges{" "}
                
              </span>{" "}
              <textarea
                name="facilities"
                type="text"
                placeholder="Admission and Facilitities"
                className="bg-input mt-2 w-full h-28 p-3 text-[14px] outline-none rounded-md"
                onChange={handleInput}
                value={instituteData.facilities}
              />
              {/* {errors.facilities && (
                <p className="text-red-500 mt-1 text-sm">{errors.facilities}</p>
              )} */}
            </span>
          </div>

          <div className="flex justify-end mt-12 text-[14px]">
            <span
              onClick={handleSubmit}
              className="bg-primary text-white px-6 py-2 rounded-md cursor-pointer"
            >
              {isSubmitting ? "Submitting" : "Submit"}
            </span>
          </div>
        </div>
      </div>

      <PopUp
        src={greenTick}
        PopUpClose={confirmPopUpClose}
        isPopUp={isConfirmPopUp}
        heading="Institute Added Successfully"

        // text3="All good things take time."
        // text4="Thanks for your patience!"
        // text="You may start exploring SOV Portal. However, for a proper quality review and writing process, allow us up to 24 to 48 hours to confirm that your application has been successful."
      />
    </>
  );
};

export default AddInstitute;
