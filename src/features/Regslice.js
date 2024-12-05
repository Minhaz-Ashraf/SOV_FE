// src/app/stepperSlice.js

import { createSlice } from '@reduxjs/toolkit';

const stepperSlice = createSlice({
  name: 'stepper',
  initialState: {
    currentStep: 1,
    formData: {}, 
  },
  reducers: {
    setStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
  },
});

export const { setStep, setFormData } = stepperSlice.actions;
export const selectStepper = (state) => state.stepper;
export default stepperSlice.reducer;



