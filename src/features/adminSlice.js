import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  applicationOverviewData,
  getAdminProfileData,
  getAgentDataByAdmin,
  getAllAgent,
  getAllApplicationforApproval,
  getAllApproval,
  getAllInstitutes,
  getAllStudent,
  getAllTeam,
  getApplicationActivity,
  getApprovalActivity,
  getInstituteById,
  getStudentDataByAdmin,
  getTeamById,
  getTicketActivity,
  getTickets,
  getTicketsDataById,
  getUrlData,
} from "./adminApi";

// Async thunk to fetch agent data
export const applicationForApproval = createAsyncThunk(
  "agents/applicationForApproval",
  async (
    { tabType, page, perPage, search, isTypeFilter },
    { rejectWithValue }
  ) => {
    try {
      const response = await getAllApplicationforApproval(
        tabType,
        page,
        perPage,
        search,
        isTypeFilter
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const agentStudentApprovals = createAsyncThunk(
  "agents/agentStudentApprovals",
  async (
    { tabType, search, page, perPage, isTypeFilter },
    { rejectWithValue }
  ) => {
    try {
      const response = await getAllApproval(
        tabType,
        search,
        page,
        perPage,
        isTypeFilter
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const agentDataProfile = createAsyncThunk(
  "admin/agentDataProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAgentDataByAdmin(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);

export const getStudentById = createAsyncThunk(
  "admin/getStudentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getStudentDataByAdmin(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getAllTickets = createAsyncThunk(
  "admin/getAllTickets",
  async (
    {
      page,
      perPage,
      isPriorityType,
      isStatusType,
      search,
      updateTicketTab,
      dateObj,
    },
    { rejectWithValue }
  ) => {
    console.log(updateTicketTab);
    try {
      const response = await getTickets(
        page,
        perPage,
        isPriorityType,
        isStatusType,
        search,
        updateTicketTab,
        dateObj
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);

export const getTicketById = createAsyncThunk(
  "admin/getTicketById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getTicketsDataById(id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);

export const getAllAgentList = createAsyncThunk(
  "admin/getAllAgentList",
  async ({ page, perPage, search }, { rejectWithValue }) => {
    try {
      const response = await getAllAgent(page, perPage, search);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getAllStudentList = createAsyncThunk(
  "admin/getAllStudentList",
  async ({ path, page, perPage, search, agentId }, { rejectWithValue }) => {
    try {
      const response = await getAllStudent(
        path,
        page,
        perPage,
        search,
        agentId
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const adminProfileData = createAsyncThunk(
  "admin/adminProfileData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminProfileData();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const adminApplicationOverview = createAsyncThunk(
  "admin/adminApplicationOverview",
  async ({ page, perPage, search, isTypeFilter }, { rejectWithValue }) => {
    try {
      const response = await applicationOverviewData(
        page,
        perPage,
        search,
        isTypeFilter
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const adminUrlData = createAsyncThunk(
  "admin/adminUrlData",
  async (studentId, { rejectWithValue }) => {
    try {
      const response = await getUrlData(studentId);
      console.log(response, "test");
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getInstitutes = createAsyncThunk(
  "admin/getInstitutes",
  async ({isTypeFilter, search, page, perPage}, { rejectWithValue }) => {
    try {
      const response = await getAllInstitutes(isTypeFilter, search, page, perPage);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getSingleInstitute = createAsyncThunk(
  "admin/getSingleInstitute",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getInstituteById(
       id
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getAllTeamData = createAsyncThunk(
  "admin/getAllTeamData",
  async ({ perPage, page, search }, { rejectWithValue }) => {
    try {
      const response = await getAllTeam(perPage, page, search);
      console.log(response, "test");
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getMemberProfile = createAsyncThunk(
  "admin/getMemberProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await getTeamById(
       id
      );
      console.log(response, "test");
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getTeamTickets = createAsyncThunk(
  "admin/getTeamTickets",
  async ({id, page, perPage, dateObj,  search, isPriorityType }, { rejectWithValue }) => {
    try {
      const response = await getTicketActivity(id, page, perPage, dateObj,  search, isPriorityType );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getTeamApplication = createAsyncThunk(
  "admin/getTeamApplication",
  async ({id, page, perPage, isType, search  }, { rejectWithValue }) => {
    try {
      const response = await getApplicationActivity(id, page, perPage, isType, search );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const getTeamApproval = createAsyncThunk(
  "admin/getTeamApproval",
  async ({id, page, perPage, isType, search }, { rejectWithValue }) => {
    try {
      const response = await getApprovalActivity(id, page, perPage, isType, search);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    approvals: [],
    applications: [],
    tabType: "",
    status: "idle",
    error: null,
    updateState: false,
    updateTicketTab: "underreview",
    agentProfile: "",
    ticketAll: [],
    ticketById: "",
    getAllAgentData: [],
    getAllStudentData: [],
    getStudentDataById: null,
    getAdminProfile: null,
    getApplicationOverview: null,
    getUrlData: [],
    allInstitutes: null,
    instituteById: null,
    getTeams:null,
    getMember:null,
    getApplicationActivityData: null,
    getTicketActivityData: null,
    getApprovalActivityData: null,  

  },
  reducers: {
    setTabType: (state, action) => {
      state.updateState = !state.updateState;
      state.tabType = action.payload;
      state.applications = [];
    },

    setUpdateTicket: (state, action) => {
      state.updateState = !state.updateState;
      state.updateTicketTab = action.payload;
    },
    setNullStudentDirectory: (state) => {
      state.getAllStudentData = [];
    },
    setEmptyInstitute: (state) => {
      state.instituteById = [];
    },
    setEmptyMemberInput: (state) => {
      state.getMember = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(applicationForApproval.pending, (state) => {
        state.status = "loading";
      })
      .addCase(applicationForApproval.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = action.payload;
      })
      .addCase(applicationForApproval.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(agentStudentApprovals.pending, (state) => {
        state.status = "loading";
      })
      .addCase(agentStudentApprovals.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log("Payload received:", action.payload);

        state.approvals = action.payload;
      })
      .addCase(agentStudentApprovals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(agentDataProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(agentDataProfile.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.agentProfile = action.payload;
      })
      .addCase(agentDataProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getStudentById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getStudentById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getStudentDataById = action.payload;
      })
      .addCase(getStudentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTickets.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ticketAll = action.payload;
      })
      .addCase(getAllTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.ticketAll = [];
      })
      .addCase(getTicketById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTicketById.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.ticketById = action.payload;
      })
      .addCase(getTicketById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllAgentList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllAgentList.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getAllAgentData = action.payload;
      })
      .addCase(getAllAgentList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllStudentList.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllStudentList.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getAllStudentData = action.payload || [];
      })
      .addCase(getAllStudentList.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.getAllStudentData = [];
      })
      .addCase(adminProfileData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminProfileData.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getAdminProfile = action.payload;
      })
      .addCase(adminProfileData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(adminApplicationOverview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminApplicationOverview.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getApplicationOverview = action.payload;
      })
      .addCase(adminApplicationOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(adminUrlData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(adminUrlData.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action);

        state.getUrlData = action.payload;
      })
      .addCase(adminUrlData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      .addCase(getInstitutes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getInstitutes.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.allInstitutes = action.payload;
      })
      .addCase(getInstitutes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getSingleInstitute.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSingleInstitute.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.instituteById = action.payload;
      })
      .addCase(getSingleInstitute.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getAllTeamData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllTeamData.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getTeams = action.payload;
      })
      .addCase(getAllTeamData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getMemberProfile.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getMemberProfile.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getMember = action.payload;
      })
      .addCase(getMemberProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.getMember =[]
      })
      .addCase(getTeamTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTeamTickets.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getTicketActivityData = action.payload;
      })
      .addCase(getTeamTickets.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.getTicketActivityData =[]
      })
      .addCase(getTeamApplication.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTeamApplication.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getApplicationActivityData = action.payload;
      })
      .addCase(getTeamApplication.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.getApplicationActivityData =[]
      })
      .addCase(getTeamApproval.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getTeamApproval.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.getApprovalActivityData = action.payload;
      })
      .addCase(getTeamApproval.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        state.getApprovalActivityData = []
      });
  },
});
export const { setTabType, setUpdateTicket, setNullStudentDirectory, setEmptyInstitute, setEmptyMemberInput } =
  adminSlice.actions;
export default adminSlice.reducer;
