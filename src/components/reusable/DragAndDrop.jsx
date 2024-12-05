// import React, { useState, useCallback, useEffect } from "react";
// import { useDropzone } from "react-dropzone";
// import { FiUpload, FiTrash2 } from "react-icons/fi";
// import { toast } from "react-toastify"; // Assuming you're using react-toastify for notifications

// const MAX_FILE_SIZE_MB = 5; // 5 MB limit

// const FileUpload = ({
//   label,
//   acceptedFormats,
//   onFilesUploaded,
//   reset,
//   setReset,
//   customClass,
//   value
// }) => {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const onDrop = useCallback(
//     async (acceptedFiles) => {
//       const file = acceptedFiles[0];

//       if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
//         toast.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
//         return;
//       }

//       // Update state with the new uploaded file
//       setUploadedFile(file);
//       setUploading(true);

//       // Trigger callback to parent component
//       if (onFilesUploaded) {
//         await onFilesUploaded([file]); // Send the single file to the parent
//       }

//       setUploading(false);
//     },
//     [onFilesUploaded]
//   );

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: acceptedFormats,
//     maxFiles: 1,
//     disabled: uploadedFile !== null, // Disable if a file is uploaded
//   });

//   // Reset file input when parent component sets reset
//   useEffect(() => {
//     if (reset) {
//       setUploadedFile(null); // Reset uploaded file state
//       if (onFilesUploaded) {
//         onFilesUploaded([]); // Reset the uploaded file list
//       }
//       setReset(false); // Reset the parent reset state
//     }
//   }, [reset, onFilesUploaded, setReset]);

//   return (
//     <div className="file-upload-container w-full mt-3">
//       <span className="text-secondary">{label}*</span>
//       <div
//         {...getRootProps()}
//         className={`dropzone border-2 p-6 rounded-md text-center mt-6 ${customClass} ${
//           isDragActive ? "border-blue-500" : "border-gray-400"
//         } ${uploadedFile ? "cursor-not-allowed" : "cursor-pointer"}`}
//       >
//         <input {...getInputProps()} disabled={uploadedFile !== null} />
//         {isDragActive ? (
//           <p>Drop the file here ...</p>
//         ) : uploadedFile ? (
//           <div className="flex justify-center flex-col w-full items-center">
//             <div className="p-6 w-20 text-[32px] bg-input rounded-full">
//               <FiUpload />
//             </div>
//             <span className="text-primary mt-4 font-medium ">
//               {uploading ? "Uploading..." : `${uploadedFile.name} uploaded`}
//             </span>
//           </div>
//         ) : (
//           <p className="flex justify-center flex-col w-full items-center">
//             <div className="p-6 w-20 text-[32px] bg-input rounded-full">
//               <FiUpload />
//             </div>
//             <span className="text-primary mt-4 font-medium ">
//               Click to Upload
//             </span>{" "}
//             or drag and drop
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FileUpload;
import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";

const MAX_FILE_SIZE_MB = 5;

const FileUpload = ({
  label,
  acceptedFormats,
  onFilesUploaded,
  reset,
  setReset,
  customClass,
  value,
}) => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit.`);
        return;
      }

      setUploadedFile(file);
      setUploading(true);

      if (onFilesUploaded) {
        await onFilesUploaded([file]);
      }

      setUploading(false);
    },
    [onFilesUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFormats,
    maxFiles: 1,
    disabled: 
      uploadedFile !== null ||
      (Array.isArray(value) && value.length > 0 && value[0] !== "") ||
      (typeof value === "string" && value.length > 0),
  });
  useEffect(() => {
    if (reset) {
      setUploadedFile(null);
      if (onFilesUploaded) {
        onFilesUploaded([]);
      }
      setReset(false);
    }
  }, [reset, onFilesUploaded, setReset]);

  return (
    <div className="file-upload-container w-full mt-3">
      <span className="text-secondary">{label}*</span>
      <div
        {...getRootProps()}
        className={`dropzone border-2 p-6 rounded-md text-center mt-6 ${customClass} ${
          isDragActive ? "border-blue-500" : "border-gray-400"
        } ${
          uploadedFile ||
     (Array.isArray(value) && value.length > 0 && value[0] !== "") ||
          typeof value === "string" && value.length >0
            ? "cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        <input
          {...getInputProps()}
          disabled={
            uploadedFile !== null ||
            (Array.isArray(value) && value.length > 0 && value[0] !== "") ||
            typeof value === "string" && value.length>0 
          }
        />
        {isDragActive ? (
          <p>Drop the file here ...</p>
        ) : uploadedFile ? (
          <div className="flex justify-center flex-col w-full items-center">
            <div className="p-6 w-20 text-[32px] bg-input rounded-full">
              <FiUpload />
            </div>
            <span className="text-primary mt-4 font-medium ">
              {uploading ? "Uploading..." : `${uploadedFile.name} uploaded`}
            </span>
          </div>
        ) : typeof value === "string" && value.length> 0 ? (
          <div className="flex justify-center flex-col w-full items-center">
            <div className="p-6 w-20 text-[32px] bg-input rounded-full">
              <FiUpload />
            </div>
            <span className="text-primary mt-4 font-medium ">
              Delete to upload a new image
            </span>
          </div>
        ) : Array.isArray(value) && value.length > 0 && value[0] !== "" ? (
          <div className="flex justify-center flex-col w-full items-center">
            <div className="p-6 w-20 text-[32px] bg-input rounded-full">
              <FiUpload />
            </div>
            <span className="text-primary mt-4 font-medium ">
              Delete to upload a new file
            </span>
          </div>
        ) : (
          <p className="flex justify-center flex-col w-full items-center">
            <div className="p-6 w-20 text-[32px] bg-input rounded-full">
              <FiUpload />
            </div>
            <span className="text-primary mt-4 font-medium ">
              Click to Upload or drag and drop
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
