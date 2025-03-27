import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Driver {
  id: string;
  username: string;
  email: string;
  fullName: string;
  active: boolean;
}

interface DriverState {
  drivers: Driver[];
  isLoading: boolean;
  error: string | null;
}

const initialState: DriverState = {
  drivers: [],
  isLoading: false,
  error: null,
};

const driverSlice = createSlice({
  name: "driver",
  initialState,
  reducers: {
    setDrivers: (state, action: PayloadAction<Driver[]>) => {
      state.drivers = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setDrivers, setLoading, setError } = driverSlice.actions;
export default driverSlice.reducer;
