'use server'

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}
interface LoginPayload {
  email: string;
  password: string;
}

interface ServiceResponse {
  success: boolean;
  message: string;
}

export const login = async (
  payload: LoginPayload
): Promise<ServiceResponse> => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/login`,
      payload
    );

    const data = res.data;

    // ✅ trust backend success flag ONLY
    if (data?.success === true && data?.token) {
      (await cookies()).set({
        name: "accesstoken",
        value: data.token,
        httpOnly: true,
        secure: true,
        path: "/",
      });

      return {
        success: true,
        message: data.message || "Login successful",
      };
    }

    return {
      success: false,
      message: data?.message || "Invalid credentials",
    };
  } catch (error: any) {
    if (error.response?.data) {
      return {
        success: false,
        message: error.response.data.message || "Login failed",
      };
    }

    return {
      success: false,
      message: "Network or server error",
    };
  }
};

export const logOut = async () => {
    (await cookies()).delete("accesstoken");
    redirect("/login");

}

export const getUser = async () => {
    const token = ((await cookies()).get("accesstoken"))?.value;
    if (!token) return null;
    const { name } = jwtDecode(token);
    return { name };
}

export const createUser = async (
  payload: CreateUserPayload
): Promise<ServiceResponse> => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_API}/auth/reg`,
      payload
    );

    const data = res.data;

    // ✅ ONLY trust backend success flag
    if (data?.success === true) {
      return {
        success: true,
        message: data.message || "Registration successful",
      };
    }

    return {
      success: false,
      message: data?.message || "Registration failed",
    };
  } catch (error: any) {
    // 🔥 Handle axios/network/backend errors safely
    if (error.response?.data) {
      return {
        success: false,
        message:
          error.response.data.message ||
          "Request failed",
      };
    }

    return {
      success: false,
      message: "Network or server error",
    };
  }
};


