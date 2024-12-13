import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  countryInstituteOptions,
  countryOptions,
  courseData,
  getAllDocument,
  getAllTicket,
  getStudentDataById,
  getVisaStatus,
  getWithdrawalData,
  prefferedCountry,
  recieveDocument,
} from "./generalApi";

export const getCountryOption = createAsyncThunk(
  "general/getCountryOption",
  async (_, { rejectWithValue }) => {
    try {
      const res = await countryOptions();

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const getPrefCountryOption = createAsyncThunk(
  "general/getPrefCountryOption",
  async (_, { rejectWithValue }) => {
    try {
      const res = await prefferedCountry();

      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);

export const getInstituteOption = createAsyncThunk(
  "general/getInstituteOption",
  async (country, { rejectWithValue }) => {
    try {
      const res = await countryInstituteOptions(country);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const getCourses = createAsyncThunk(
  "general/getCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await courseData();
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);

export const studentById = createAsyncThunk(
  "general/studentById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getStudentDataById(id);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const allTicket = createAsyncThunk(
  "general/allTicket",
  async ({page, perPage, isPriorityType, isStatusType, search, isDate}, { rejectWithValue }) => {
    try {
      const res = await getAllTicket(page, perPage, isPriorityType, isStatusType, search, isDate);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const visaStatusData = createAsyncThunk(
  "general/visaStatusData",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getVisaStatus(id);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const getDocumentAll = createAsyncThunk(
  "general/getDocumentAll",
  async ({path, search, page, perPage}, { rejectWithValue }) => {
    try {
      const res = await getAllDocument(path,search, page, perPage);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const getRecievedDocument = createAsyncThunk(
  "general/getRecievedDocument",
  async ({studentId, page, perPage, search, isType }, { rejectWithValue }) => {
    try {
      const res = await recieveDocument(studentId, page, perPage, search, isType );
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
export const withdrawalDataGet = createAsyncThunk(
  "general/withdrawalDataGet",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await getWithdrawalData(userId);
      // console.log(res);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.message || "Failed to fetch country options"
      );
    }
  }
);
const generalSlice = createSlice({
  name: "general",
  initialState: {
    countryOption: [],
    prefCountryOption: [],
    instituteOption: [],
    courses:[],
    studentData:null,
    getAllTicket: [],
    visaStatus:[],
    getAllDocuments: [],
    recieveDocs:[],
    withdrawalData: "",
    status: "idle",
    error: null,
  },
  reducers: {
    // Add a reducer to remove a university optimistically (immediate UI update)
    removeShortlistedUniversity: (state, action) => {
      state.instituteOption = state.instituteOption.filter(
        (institute) => institute.id !== action.pay
      );
    },

  },

  extraReducers: (builder) => {
    builder
      .addCase(getCountryOption.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCountryOption.fulfilled, (state, action) => {
        state.countryOption = action.payload[0].allCountry;
        state.status = "succeeded";
      })
      .addCase(getCountryOption.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getInstituteOption.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getInstituteOption.fulfilled, (state, action) => {
        state.instituteOption = action.payload;
        state.status = "succeeded";
      })
      .addCase(getInstituteOption.rejected, (state, action) => {
        state.status = "failed";
        state.instituteOption = []
        state.error = action.payload || action.error.message;
      })
      .addCase(getPrefCountryOption.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getPrefCountryOption.fulfilled, (state, action) => {
        state.prefCountryOption = action.payload[0].preferredCountry;
        state.status = "succeeded";
      })
      .addCase(getPrefCountryOption.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(getCourses.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.status = "succeeded";
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })  .addCase(studentById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(studentById.fulfilled, (state, action) => {
        state.studentData = action.payload;
        state.status = "succeeded";
      })
      .addCase(studentById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      }).addCase(allTicket.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(allTicket.fulfilled, (state, action) => {
        state.getAllTicket = action.payload;
        state.status = "succeeded";
      })
      .addCase(allTicket.rejected, (state, action) => {
        state.status = "failed";
        state.getAllTicket = []
        state.error = action.payload || action.error.message;
      })
      .addCase(visaStatusData.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(visaStatusData.fulfilled, (state, action) => {
        state.visaStatus = action.payload;
        state.status = "succeeded";
      })
      .addCase(visaStatusData.rejected, (state, action) => {
        state.status = "failed";
     
        state.error = action.payload || action.error.message;
      })
      .addCase(getDocumentAll.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getDocumentAll.fulfilled, (state, action) => {
        state.getAllDocuments = action.payload;
        state.status = "succeeded";
      })
      .addCase(getDocumentAll.rejected, (state, action) => {
        state.status = "failed";
     
        state.error = action.payload || action.error.message;
      })
      .addCase(getRecievedDocument.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getRecievedDocument.fulfilled, (state, action) => {
        state.recieveDocs = action.payload;
        state.status = "succeeded";
      })
      .addCase(getRecievedDocument.rejected, (state, action) => {
        state.status = "failed";
     
        state.error = action.payload || action.error.message;
      })
      .addCase(withdrawalDataGet.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(withdrawalDataGet.fulfilled, (state, action) => {
        state.withdrawalData = action.payload;
        state.status = "succeeded";
      })
      .addCase(withdrawalDataGet.rejected, (state, action) => {
        state.status = "failed";
     
        state.error = action.payload || action.error.message;
      });
  },
});
export const { clearInstituteOption } = generalSlice.actions;
export default generalSlice.reducer;
