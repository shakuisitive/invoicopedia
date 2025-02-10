import { createSlice } from "@reduxjs/toolkit";

export const customersSlice = createSlice({
  name: "customer",
  initialState: {
    data: [],
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { increment, decrement, incrementByAmount } =
  customersSlice.actions;

export default customersSlice.reducer;
