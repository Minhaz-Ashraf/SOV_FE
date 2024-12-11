import apiurl from "../util";

export const formOneSubmit = async (data, edit) => {
  try {
    const response = await apiurl.post("/company/register-company", data, {
      params: {
        edit,
      },
    });
    console.log(response);
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
export const formTwoSubmit = async (data, edit) => {
  try {
    const response = await apiurl.post(
      "/company/register-CompanyContact",
      data,
      {
        params: {
          edit,
        },
      }
    );
    console.log(response);
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
export const formThreeSubmit = async (data, edit) => {
  try {
    const response = await apiurl.post("/company/register-bankDetails", data, {
      params: {
        edit,
      },
    });
    console.log(response);
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
export const formFourSubmit = async (data, edit) => {
  try {
    const response = await apiurl.post(
      "/company/register-companyOverview",
      data,
      {
        params: {
          edit,
        },
      }
    );
    console.log(response);
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
export const formFiveSubmit = async (data, edit) => {
  try {
    const response = await apiurl.post(
      "/company/register-companyOperations",
      data,
      {
        params: {
          edit,
        },
      }
    );
    console.log(response);
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
export const formSixSubmit = async (data, edit) => {
  try {
    const response = await apiurl.post("/company/register-references", data, {
      params: {
        edit,
      },
    });
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

export const getAgentData = async (data) => {
  try {
    const response = await apiurl.get("/company/company-data", data);
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
export const getAllApplications = async () => {
  try {
    const response = await apiurl.get("/agent/total-application");
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
export const getAllUnderReviewApplication = async () => {
  try {
    const response = await apiurl.get("/agent/under-review-application");
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
export const getAllCompletedApplication = async () => {
  try {
    const response = await apiurl.get("/agent/completed-application");
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
export const getAllStudentCount = async () => {
  try {
    const response = await apiurl.get("/agent/total-student-count");
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
export const getAllStudents = async (perPage, page, search) => {
  try {
    const response = await apiurl.get("/studentinformation/agent-student", {
      params: {
        page: page,
        limit: perPage,
        searchData: search,
      },
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

export const shortlistDelete = async (instituteId) => {
  try {
    const response = await apiurl.get(`/wishlist/wishlist/${instituteId}`);

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
export const shortlistAdd = async (instituteId) => {
  try {
    const response = await apiurl.post(`/wishlist/wishlist`, {
      instituteId: instituteId,
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
export const shortlistGet = async () => {
  try {
    const response = await apiurl.get(`/wishlist/wishlist`);

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
export const getAllApplication = async () => {
  try {
    const response = await apiurl.get(`/institution/all`);

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
export const getApplicationOverview = async (search, page, limit) => {
  try {
    const response = await apiurl.get(`/institution/application-overview`, {
      params: {
        searchData: search,
        page: page,
        limit: limit,
      },
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
export const getStudentApplication = async (
  search,
  isType,
  applicationType,
  studentId,
  page,
  perPage
) => {
  try {
    const response = await apiurl.get(
      `/institution/application-application/${studentId}`,
      {
        params: {
          searchData: search,
          applicationType: applicationType,
          page: page,
          limit: perPage,
          status: isType
        },
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
export const getApplicationById = async (appId) => {
  try {
    const response = await apiurl.get(`/institution/application/${appId}`);

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
export const deleteStudentById = async (id) => {
  try {
    const response = await apiurl.delete(`/studentinformation/student-information/${id}`);

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
export const deleteUserById = async (path) => {
  try {
    const response = await apiurl.delete(path);

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


export const fetchAgentDashboardData = async (endpoint, type, year) => {
  try {
    const params = { year }; // Always include year
    if (type && type !== null) {
      params.applicationType = type; // Add applicationType only if type is available
    }

    const response = await apiurl.get(endpoint, { params });

    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error while fetching data"
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};