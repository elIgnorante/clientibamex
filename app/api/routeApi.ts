// routesApi.ts
import api, { setToken } from "./axios";
import { Dispatch } from "@reduxjs/toolkit";
import {
  fetchRoutesStart,
  fetchRoutesSuccess,
  fetchRoutesFailure,
  createRouteStart,
  createRouteSuccess,
  createRouteFailure,
  // ...otros actions que necesites
} from "../store/slice/routesSlice";

// Tipos para las rutas y paradas
export interface RouteStop {
  id?: number;
  name: string;
  lat: number;
  lng: number;
}

export interface Route {
  id?: number;
  routeId?: string;
  name: string;
  description?: string;
  active?: boolean;
  stops: RouteStop[];
}

// Obtener todas las rutas
export const fetchRoutes = async (dispatch: Dispatch) => {
  try {
    dispatch(fetchRoutesStart());
    const response = await api.get("/routes");
    dispatch(fetchRoutesSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(fetchRoutesFailure(error.response?.data?.msg || "Error al obtener rutas"));
    throw error;
  }
};

// Crear una nueva ruta
export const createRoute = async (routeData: Route, dispatch: Dispatch) => {
  try {
    dispatch(createRouteStart());
    const response = await api.post("/routes", routeData);
    dispatch(createRouteSuccess(response.data));
    return response.data;
  } catch (error: any) {
    dispatch(createRouteFailure(error.response?.data?.msg || "Error al crear ruta"));
    throw error;
  }
};

// Actualizar una ruta
export const updateRoute = async (id: number, routeData: Partial<Route>, dispatch: Dispatch) => {
  try {
    const response = await api.put(`/routes/${id}`, routeData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Eliminar una ruta
export const deleteRoute = async (id: number, dispatch: Dispatch) => {
  try {
    const response = await api.delete(`/routes/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};