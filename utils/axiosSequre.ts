import axios from "axios";
import { cookies } from "next/headers";


export const secureClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});


secureClient.interceptors.request.use(async (config) => {
    const token = (await cookies()).get("accesstoken")?.value;
    if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export const axiosSequre = {
    get: (url: string, config?: any) => secureClient.get(url, config).then(res => res.data),
    post: (url: string, data?: any, config?: any) => secureClient.post(url, data, config).then(res => res.data),
    patch: (url: string, data?: any, config?: any) => secureClient.patch(url, data, config).then(res => res.data),
    put: (url: string, data?: any, config?: any) => secureClient.put(url, data, config).then(res => res.data),
    delete: (url: string, config?: any) => secureClient.delete(url, config).then(res => res.data),
};