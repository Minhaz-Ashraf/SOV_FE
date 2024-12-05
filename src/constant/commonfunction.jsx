export function formatDate(timestamp) {
    const date = new Date(timestamp);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }

  export const extractFileName = (url) => {
    const fileName = url.replace(/^.*\/o\//, ''); // Removes everything up to and including '/o/'
  const fileNameTrimmed = fileName.split('?')[0]; // Removes any query parameters after the file name
  const decodedFileName = decodeURIComponent(fileNameTrimmed); 
  return decodedFileName;
  };