import apiurl from "../util";

export const countryOptions = async () => {
  try {
    const res = await apiurl.get("country/all");
    return res.data;
  } catch (error) {
    console.error("Error fetching country options:", error);
    throw new Error("Failed to fetch country options.");
  }
};

export const prefferedCountry = async () => {
  try {
    const res = await apiurl.get(`country/preferred`);
    return res.data;
  } catch (error) {
    console.error("Error fetching country options:", error);
    throw new Error("Failed to fetch country options.");
  }
};

export const countryInstituteOptions = async (country, instituteName) => {
  try {
    const res = await apiurl.get(`institute/all`, {
      params: {
        instituteName: instituteName,
        country: country,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching country options:", error);
    throw new Error("Failed to fetch country options.");
  }
};
export const courseData = async () => {
  try {
    const res = await apiurl.get(`country/courses`);
    return res.data;
  } catch (error) {
    console.error("Error fetching country options:", error);
    throw new Error("Failed to fetch country options.");
  }
};

export const getStudentDataById = async (id) => {
  try {
    const res = await apiurl.get(
      `/studentinformation/student-information/${id}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching country options:", error);
    throw new Error("Failed to fetch country options.");
  }
};
export const newOfferLetter = async (data) => {
  try {
    const response = await apiurl.post(`/institution/register-offerletter`, {
      offerLetter: data,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const courseFeeAdd = async (data) => {
  try {
    const response = await apiurl.post(`/institution/course-fee-application`, {
      courseFeeApplication: data,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const visaAdd = async (data) => {
  try {
    const response = await apiurl.post(`/institution/create-visa`, data);

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const OfferLetterPersonalInfoEdit = async (
  appId,
  offerLater,
  section
) => {
  try {
    const response = await apiurl.patch(
      `/institution/personal-information/${appId}`,
      {
        ...offerLater,
        section,
      }
    );

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const OfferLetterEduInfoEdit = async (appId, offerLater, section) => {
  try {
    const response = await apiurl.patch(
      `/institution/education-details/${appId}`,
      {
        ...offerLater,
        section,
      }
    );

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const OfferLetterIeltsInfo = async (appId, offerLater, section) => {
  try {
    const response = await apiurl.patch(`/institution/ielts-score/${appId}`, {
      ...offerLater,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const OfferLetterPrefEdit = async (appId, offerLater, section) => {
  try {
    const response = await apiurl.patch(`/institution/preference/${appId}`, {
      ...offerLater,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const OfferLetterToeflScore = async (appId, offerLater, section) => {
  try {
    const response = await apiurl.patch(`/institution/toefl-score/${appId}`, {
      ...offerLater,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const OfferLetterPteScore = async (appId, offerLater, section) => {
  try {
    const response = await apiurl.patch(`/institution/ptl-score/${appId}`, {
      ...offerLater,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const OfferLetterCertificate = async (appId, offerLater, section) => {
  try {
    const response = await apiurl.patch(`/institution/certificate/${appId}`, {
      ...offerLater,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const updateVisaPersonalInfo = async (id, visa, section) => {
  try {
    const response = await apiurl.patch(`/institution/visa-personaldetails/${id}`, {
      ...visa,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const updateVisaDocument = async (id, visa, section) => {
  try {
    const response = await apiurl.patch(`/institution/visa-documents/${id}`, {
      ...visa,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const updateCourseFeeStudentDoc = async (id, payload, section) => {
  try {
    const response = await apiurl.patch(`/institution/student-document/${id}`, {
      ...payload,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const updateCourseFeeDoc = async (id, payload, section) => {
  try {
    const response = await apiurl.patch(`/institution/offer-letter-and-passport/${id}`, {
      ...payload,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const updateCourseFeeFamilyDoc = async (id, payload, section) => {
  try {
    const response = await apiurl.patch(`/institution/parent-document/${id}`, {
      ...payload,
      section,
    });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const applicationReSubmit = async (applicationId, section) => {
  try {
    const response = await apiurl.patch(
      `/institution/reSubmit-application/${applicationId}`,
      {},
      {
        params: {
          section: section,
          resubmit: true,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const generateNewTicket = async (payload, userType) => {
  try {
    const response = await apiurl.post(`/ticket/create-ticket`, {
      ...payload,
      userType,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const getAllTicket = async (
  page,
  perPage,
  isPriorityType,
  isStatusType,
  search,
  dateObj
) => {
  try {
    const response = await apiurl.get(`/ticket/my-tickets`, {
      params: {
        page: page,
        limit: perPage,
        priorityStatus: isPriorityType,
        status: isStatusType,
        search: search,
        date: dateObj
      },

    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const changePasswordData = async (payload) => {
  try {
    const response = await apiurl.patch(`/auth/change-password`, payload);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const getOtpToChageEmail = async (payload) => {
  try {
    const response = await apiurl.post(`/auth/change-email-otp`, payload);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const confirmUpdateEmail = async (payload) => {
  try {
    const response = await apiurl.patch(`/auth/update-email`, payload);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const getVisaStatus = async (id) => {
  try {
    const response = await apiurl.get(`institution/get-visa-documents/${id}`);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const getAllDocument = async (path,search, page, perPage) => {
  try {
    const response = await apiurl.get(path, {
      params: {
        searchQuery: search,
        page: page,
        perPage: perPage,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const uploadDocument = async (data) => {
  try {
    const response = await apiurl.post(`document/upload`, data);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const removeDocument = async (id) => {
  try {
    const response = await apiurl.delete(`document/${id}`);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const recieveDocument = async (
  studentId,
  page,
  perPage,
  search,
  isType
) => {
  try {
    const response = await apiurl.get(
      `studentInformation/admin-document/${studentId}`,
      {
        params: {
          searchQuery: search,
          documentType: isType,
          page: page,
          limit: perPage,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const withdrawVisa = async (payload) => {
  try {
    const response = await apiurl.post(`withdrawal/withdrawal`, payload);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const updateDocs = async(id, payload) => {
  try {
    const response = await apiurl.post(`/institution/update-visa-document/${id}`, payload);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getWithdrawalData = async(id) => {
  try {
    const response = await apiurl.get(`/withdrawal/get-withdrawal/${id}`);

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const reApprovalRequest = async(fetchPath, payload) => {
  try {
    const response = await apiurl.put(fetchPath, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const deleteDocument = async(fileUrl) => {
  try {
    const response = await apiurl.patch("/document/delete-document",{
      fileUrl: fileUrl
    });
    return response.data;
  } catch (error) {
    console.log(error)
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while submitting the form"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};