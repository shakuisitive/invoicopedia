import { createSlice } from "@reduxjs/toolkit";

export const customersSlice = createSlice({
  name: "customer",
  initialState: {
    data: [],
  },
  reducers: {
    addCustomer: (state: any, action: any) => {
      state.data.push(action.payload);
      console.log(JSON.stringify(state));
    },
  },
});

export const { addCustomer } = customersSlice.actions;

export default customersSlice.reducer;
