import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import driverReducer from "./slice/driverSlice";
import routesReducer from "./slice/routesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    driver: driverReducer,
    routes: routesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
