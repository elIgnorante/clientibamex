import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import driverReducer from "./slice/driverSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
