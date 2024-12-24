import apiurl from "../util";

export const getAllApplicationforApproval = async (
  tabType,
  page,
  perPage,
  searchQuery
) => {
  try {
    const response = await apiurl.get(`/admin/all/applications`, {
      params: {
        status: tabType,
        page: page,
        limit: perPage,
        searchQuery: searchQuery,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getAllApproval = async (tabType, search, page, perPage) => {
  try {
    const response = await apiurl.get(`/admin/all/student-agent-data`, {
      params: {
        status: tabType || "notapproved",
        search: search,
        page: page,
        limit: perPage,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const chngeApplicationStatus = async (id, status, section, message) => {
  const role = localStorage.getItem("role");
  try {
    const path =
      role === "0"
        ? "/admin/change-application-status"
        : role === "1"
        ? "/admin/change-application-status-subadmin"
        : null;
    const response = await apiurl.patch(`${path}/${id}`, {
      status,
      section,
      message,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred", error);
    }
  }
};
export const changeVisaStatus = async (id, payload) => {
  try {
    const response = await apiurl.patch(`/admin/visa-status/${id}`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred", error);
    }
  }
};
export const changeApprovalStatus = async (path, id, status, type, message) => {
  try {
    const response = await apiurl.patch(`${path}/${id}`, {
      status,
      type,
      message,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const adminLogin = async (role, email, password) => {
  try {
    const response = await apiurl.post(`/auth/admin/login`, {
      role,
      email,
      password,
    });
    localStorage.setItem("userAuthToken", response?.data?.data?.accessToken);
    localStorage.setItem("role", role);
    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const getAgentDataByAdmin = async (id) => {
  try {
    const response = await apiurl.get(`/admin/company/${id}`);
    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const getStudentDataByAdmin = async (id) => {
  try {
    const response = await apiurl.get(`admin/student-information/${id}`);
    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

// ticket support
export const getTickets = async (
  page,
  perPage,
  isPriorityType,
  isStatusType,
  search,
  updateTicketTab,
  dateObj
) => {
  try {
    const response = await apiurl.get(`/ticket/all`, {
      params: {
        page: page,
        limit: perPage,
        priorityStatus: isPriorityType,
        searchData: search,
        status: updateTicketTab,
        date: dateObj,
      },
    });
    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const downloadFile = async ({ url, filename }) => {
  try {
    const response = await apiurl.get(url, {
      responseType: "blob",
    });

    const fileUrl = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(fileUrl);
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data.message ||
          "Something went wrong during the download."
      );
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export const getTicketsDataById = async (id) => {
  try {
    const response = await apiurl.get(`/ticket/ticket/${id}`);
    return response.data?.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const ticketResolve = async (
  path,
  status,
  solution,
  resolvedText,
  ticketId
) => {
  try {
    const response = await apiurl.patch(`${path}/${ticketId}`, {
      status,
      solution,
      resolvedText,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const changeAdminEmail = async (payload) => {
  try {
    const response = await apiurl.post(`/auth/admin/change-email`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const changeAdminPassword = async (payload) => {
  try {
    const response = await apiurl.post(`/auth/admin/change-password`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const editProfile = async (payload) => {
  try {
    const response = await apiurl.patch(`/auth/admin/edit-profile`, payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const getAdminProfileData = async () => {
  try {
    const response = await apiurl.get(`/auth/admin/profile`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const getAllAgent = async (page, perPage, search) => {
  try {
    const response = await apiurl.get(`/admin/all-agent`, {
      params: {
        page: page,
        limit: perPage,
        search: search,
        isApproved: "completed",
        // isApproved: "approved",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};
export const getAllStudent = async (path, page, perPage, search, agentId) => {
  try {
    const response = await apiurl.get(path, {
      params: {
        page: page,
        limit: perPage,
        searchQuery: search,
        agentId: agentId,
        isApproved: "completed",
        // isApproved: "approved",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || "Something went wrong");
    } else if (error.request) {
      throw new Error("No response from server. Please try again later.");
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
};

export const fetchAdminDashboardData = async (
  endpoint,
  type,
  year,
  userType
) => {
  try {
    const params = { year }; // Always include year
    if (type && type !== null) {
      params.applicationType = type;
    }
    if (userType && userType !== null) {
      params.userType = userType;
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
export const updateWithdrawalReq = async (payload) => {
  try {
    const response = await apiurl.put(
      "/withdrawal/withdrawal-complete",
      payload
    );
    return response.data;
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

export const agentStudent = async () => {
  try {
    const response = await apiurl.get(
      "/studentInformation/agent-student-admin"
    );
    return response.data;
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

export const applicationOverviewData = async (
  page,
  perPage,
  search,
  isTypeFilter
) => {
  try {
    const response = await apiurl.get("/admin/all-student-applications", {
      params: {
        searchData: search,
        page: page,
        limit: perPage,
        submittedBy: isTypeFilter,
      },
    });
    return response.data;
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
export const uploadApplications = async (payload) => {
  try {
    const response = await apiurl.post("/admin/upload-document", payload);
    return response.data;
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
export const deleteApplication = async (payload) => {
  try {
    const response = await apiurl.patch(
      `/admin/delete-admin-document`,
      payload
    );
    return response.data;
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

export const removeAgentorStudent = async (path) => {
  try {
    const response = await apiurl.patch(path);
    return response.data;
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
export const totalAgentStudent = async (path, month, year, type) => {
  try {
    const response = await apiurl.get(path, {
      params: {
        month: month,
        year: year,
        applicationType: type,
        //  type: type
      },
    });
    return response.data;
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
export const getUrlData = async (studentId) => {
  try {
    const response = await apiurl.get(`/admin/get-admin-document`, {
      params: {
        applicationId: studentId,
      },
    });
    return response.data;
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

export const editAgentAdmin = async (path, payload, edit, id) => {
  try {
    const response = await apiurl.post(path, payload, {
      params: {
        edit,
        companyId: id,
      },
    });
    return response.data;
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

export const editStudentAdmin = async (path, payload, edit) => {
  try {
    const response = await apiurl.patch(path, payload, {
      params: {
        edit,
      },
    });
    return response.data;
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
export const getAllInstitutes = async (isTypeFilter, search, page, perPage) => {
  try {
    const response = await apiurl.get("/institute/all-institute", {
      params: {
        page: page,
        perPage: perPage,
        country: isTypeFilter,
        instituteName: search,
      },
    });
    return response.data;
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

export const getInstituteById = async (id) => {
  try {
    const response = await apiurl.get("/institute/one-institute", {
      params: {
        instituteId: id,
      },
    });
    return response.data;
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
export const addInstitute = async (payload) => {
  try {
    const response = await apiurl.post("/institute/add", payload);
    return response.data;
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
export const deleteInstitute = async (id) => {
  try {
    const response = await apiurl.patch(`/institute/delete/${id}`);
    return response.data;
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

export const addTeam = async (payload) => {
  try {
    const response = await apiurl.post("/auth/admin/add-team-member", payload);
    return response.data;
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
export const editTeam = async (payload, id) => {
  try {
    const response = await apiurl.put(
      `/auth/admin/edit-team-member/${id}`,
      payload
    );
    return response.data;
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
export const deleteTeam = async (id) => {
  try {
    const response = await apiurl.patch(`/auth/admin/delete-team-member/${id}`);
    return response.data;
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

export const getAllTeam = async (perPage, page, search) => {
  try {
    const response = await apiurl.get(`/auth/admin/get-team-members`, {
      params: {
        searchQuery: search,
        page: page,
        limit: perPage,
      },
    });
    return response.data;
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
export const getTeamById = async (id) => {
  try {
    const response = await apiurl.get(`/auth/admin/team-profile/${id}`);
    return response.data;
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
export const getTicketActivity = async (
  id,
  page,
  perPage,
  dateObj,
  search,
  isPriorityType
) => {
  try {
    const response = await apiurl.get(`/ticket/sub-admin-tickets/${id}`, {
      params: {
        page: page,
        perPage: perPage,
        date: dateObj,
        searchData: search,
        ticketType: isPriorityType,
      },
    });
    return response.data;
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
export const getApplicationActivity = async (
  id,
  page,
  perPage,
  isType,
  search,
  isDate
) => {
  try {
    const response = await apiurl.get(`/admin/sub-admin/applications/${id}`, {
      params: {
        page: page,
        perPage: perPage,
        status: isType,
        searchData: search,
        date: isDate
      },
    });
    return response.data;
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
export const getApprovalActivity = async (
  id,
  page,
  perPage,
  isType,
  search,
  isDate
) => {
  try {
    const response = await apiurl.get(
      `/admin/sub-admin/student-agent-data/${id}`,
      {
        params: {
          page: page,
          perPage: perPage,
          userType: isType,
          searchData: search,
          date: isDate
        },
      }
    );
    return response.data;
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

export const editInstitute = async (id, payload) => {
  try {
    const response = await apiurl.patch(`/institute/update/${id}`, payload);
    return response.data;
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
