import React from "react";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { toast } from "react-toastify";
import FileUpload from "./DragAndDrop";

const DocumentDragUpload = ({
  label,
  acceptedFormats,
  uploadType,
  value, // Generic value prop to hold the uploaded file URLs
  setValue, // Generic setter function to update the uploaded file URLs
  errors,
  resetUpload,
  setResetUpload,
}) => {
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    let uploadedUrls = [];

    for (const file of files) {
      console.log(file, "Uploading file");

      const storageRef = ref(storage, `uploads/${file.name}`);

      try {
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        uploadedUrls.push(downloadURL);

        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(`Error uploading ${file.name}. Please try again.`);
      }
    }

    if (uploadedUrls.length > 0) {
      setValue((prevValue) => [...prevValue, ...uploadedUrls]);
    }
  };

  const deleteFile = async (fileUrl) => {
    if (!fileUrl) return;

    const storageRef = ref(storage, fileUrl);

    try {
      await deleteObject(storageRef);
      toast.success("File deleted successfully!");

      setValue((prevValue) => prevValue.filter((url) => url !== fileUrl)); 

      setResetUpload(true);
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting file. Please try again.");
    }
  };

  return (
    <>
      <FileUpload
        label={label}
        acceptedFormats={acceptedFormats}
        reset={resetUpload}
        setReset={setResetUpload}
        onFilesUploaded={handleFileUpload}
        customClass="border-dashed"
        value={value}
      />
      {errors && (
        <p className="text-red-500 mt-1 text-sm">{errors}</p>
      )}

      {Array.isArray(value) && value.length > 0 && (
        <div className="mt-4">
          <p className="text-secondary font-semibold">Uploaded Documents:</p>
          <ul>
            {value
              .filter((url) => typeof url === "string" && url.startsWith("http"))
              .map((url, index) => (
                <li key={index} className="flex items-center mt-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Uploaded Document
                  </a>
                  <button
                    onClick={() => deleteFile(url)}
                    className="ml-4 text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default DocumentDragUpload;
