import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./features/customer/customersSlice";

export default configureStore({
  reducer: {
    customers: customersReducer,
  },
});
