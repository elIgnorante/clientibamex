// routesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route } from "../../api/routeApi";

interface RoutesState {
  routes: Route[];
  loading: boolean;
  error: string | null;
}

const initialState: RoutesState = {
  routes: [],
  loading: false,
  error: null,
};

const routesSlice = createSlice({
  name: "routes",
  initialState,
  reducers: {
    fetchRoutesStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRoutesSuccess(state, action: PayloadAction<Route[]>) {
      state.routes = action.payload;
      state.loading = false;
    },
    fetchRoutesFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    createRouteStart(state) {
      state.loading = true;
      state.error = null;
    },
    createRouteSuccess(state, action: PayloadAction<Route>) {
      state.routes.push(action.payload);
      state.loading = false;
    },
    createRouteFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    // ...otros reducers para update y delete
  },
});

export const {
  fetchRoutesStart,
  fetchRoutesSuccess,
  fetchRoutesFailure,
  createRouteStart,
  createRouteSuccess,
  createRouteFailure,
} = routesSlice.actions;

export default routesSlice.reducer;