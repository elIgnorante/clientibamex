import axios from "axios";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const requestVerificationCode = async (email: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/request-code`, { email });
    return response.data;
  } catch (error: any) {
    throw (
      error.response?.data || {
        message: "Error al solicitar código de verificación",
      }
    );
  }
};

export const verifyCode = async (
  email: string,
  code: string,
  password: string
) => {
  try {
    console.log("Enviando solicitud de verificación:");
    const response = await axios.post(`${BASE_URL}/verify-code`, {
      email,
      code: code.trim(),
      password,
    });
    console.log("Respuesta recibida:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Error en verificación:",
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Error al verificar código" };
  }
};
