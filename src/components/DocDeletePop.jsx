import React, { useEffect } from "react";
import Swal from "sweetalert2";

const DocDeletePop = ({ isOpenPop, closePop, handleFunc, isUrl, isDocId }) => {
  useEffect(() => {
    if (isOpenPop) {
      Swal.fire({
        title: "Do you want to remove the document?",
        html: '<p style="color: #98090B; font-size: 14px;">If you delete this document here, all documents related to it may also be deleted from everywhere, possibly from all applications</P>',
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#98090B",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        backdrop: true,
        customClass: {
          popup: "font-poppins text-sm",
          htmlContainer: "swal-subtitle",
          title: "swal-title",
          confirmButton: "swal-confirm",
          cancelButton: "swal-cancel",
          actions: "swal-actions",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          handleFunc(isDocId, isUrl);
        } else {
          closePop(); // Use closePop to close the popup
        }
      });
    }
  }, [isOpenPop]);

  return null;
};

export default DocDeletePop;
