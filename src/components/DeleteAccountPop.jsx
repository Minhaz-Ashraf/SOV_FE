import React, { useEffect } from "react";
import Swal from "sweetalert2";

const DeleteAccountPop = ({ isOpenPop, closePop, handleFunc }) => {
  useEffect(() => {
    if (isOpenPop) {
      Swal.fire({
        title: "Do you want to delete your account?",
        icon: "question",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#98090B",
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        backdrop: true,
        customClass: {
          popup: "font-poppins text-sm",
          title: "swal-title",
          confirmButton: "swal-confirm",
          cancelButton: "swal-cancel",
          actions: "swal-actions",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.isConfirmed) {
          handleFunc();
        } else {
          closePop(); // Use closePop to close the popup
        }
      });
    }
  }, [isOpenPop]);

  return null;
};

export default DeleteAccountPop;
