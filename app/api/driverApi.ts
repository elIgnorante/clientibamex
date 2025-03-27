import api from "./axios";
import { Dispatch } from "@reduxjs/toolkit";
import { setDrivers, setLoading, setError } from "../store/slice/driverSlice";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const getDrivers = async (dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    const response = await api.get(`${BASE_URL}/drivers`);
    dispatch(setDrivers(response.data));
  } catch (error: any) {
    dispatch(
      setError(error.response?.data?.message || "Error fetching drivers")
    );
  }
};

export const createDriver = async (driverData: any, dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.post(`${BASE_URL}/drivers`, driverData);
    getDrivers(dispatch);
  } catch (error: any) {
    dispatch(
      setError(error.response?.data?.message || "Error creating driver")
    );
  }
};

export const updateDriver = async (
  id: string,
  driverData: any,
  dispatch: Dispatch
) => {
  try {
    dispatch(setLoading(true));
    await api.put(`${BASE_URL}/drivers/${id}`, driverData);
    getDrivers(dispatch);
  } catch (error: any) {
    dispatch(
      setError(error.response?.data?.message || "Error updating driver")
    );
  }
};

export const deleteDriver = async (id: string, dispatch: Dispatch) => {
  try {
    dispatch(setLoading(true));
    await api.delete(`${BASE_URL}/drivers/${id}`);
    getDrivers(dispatch);
  } catch (error: any) {
    dispatch(
      setError(error.response?.data?.message || "Error deleting driver")
    );
  }
};
