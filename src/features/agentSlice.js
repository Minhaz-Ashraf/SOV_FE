import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getAgentData,
  getAllApplication,
  getAllStudentCount,
  getAllStudents,
  getApplicationById,
  getApplicationOverview,
  getStudentApplication,
  shortlistGet,
} from "./agentApi";

export const agentInformation = createAsyncThunk(
  "agents/agentInformation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAgentData();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const allStudent = createAsyncThunk(
  "agents/allStudent",
  async ({ perPage, page, search }, { rejectWithValue }) => {
    try {
      const response = await getAllStudents(perPage, page, search);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);

export const allStudentCount = createAsyncThunk(
  "agents/getAllStudentCount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllStudentCount();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);

export const shortlistedData = createAsyncThunk(
  "agents/shortlistedData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await shortlistGet();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const allApplication = createAsyncThunk(
  "agents/allApplication",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllApplication();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const applictionOverview = createAsyncThunk(
  "agents/applictionOverview",
  async ({ search, page, limit }, { rejectWithValue }) => {
    try {
      const response = await getApplicationOverview(search, page, limit);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const studentApplications = createAsyncThunk(
  "agents/studentApplications",
  async (
    { search,isType, applicationType, studentId, page, perPage },
    { rejectWithValue }
  ) => {
    try {
      const response = await getStudentApplication(
        search,
        isType,
        applicationType,
        studentId,
        page,
        perPage
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
export const applicationById = createAsyncThunk(
  "agents/applicationById",
  async (appId, { rejectWithValue }) => {
    try {
      const response = await getApplicationById(appId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : "Failed to fetch agent data"
      );
    }
  }
);
// Create the slice for agent data management
const agentSlice = createSlice({
  name: "agent",
  initialState: {
    agentData: [],
    shortlisted: [],
    totalStudents: [],
    applicationDataById: null,
    applicationOverviewData: null,
    studentApplicationData: null,
    applications: null,
    studentCount: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(agentInformation.pending, (state) => {
        state.status = "loading";
      })
      .addCase(agentInformation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.agentData = action.payload;
      })
      .addCase(agentInformation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(allStudent.pending, (state) => {
        state.status = "loading";
      })
      .addCase(allStudent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.totalStudents = action.payload;
      })
      .addCase(allStudent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(allStudentCount.pending, (state) => {
        state.status = "loading";
      })
      .addCase(allStudentCount.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.studentCount = action.payload;
      })
      .addCase(allStudentCount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(shortlistedData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(shortlistedData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shortlisted = action.payload;
      })
      .addCase(shortlistedData.rejected, (state, action) => {
        state.status = "failed";
        state.shortlisted = [];
        state.error = action.payload || action.error.message;
      })
      .addCase(allApplication.pending, (state) => {
        state.status = "loading";
      })
      .addCase(allApplication.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applications = action.payload;
      })
      .addCase(allApplication.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(applictionOverview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(applictionOverview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applicationOverviewData = action.payload;
      })
      .addCase(applictionOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(studentApplications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(studentApplications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.studentApplicationData = action.payload;
      })
      .addCase(studentApplications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(applicationById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(applicationById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.applicationDataById = action.payload;
      })
      .addCase(applicationById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export default agentSlice.reducer;
