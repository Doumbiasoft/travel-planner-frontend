import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

// Extend axios types to include metadata and retry flag
declare module "axios" {
  interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
      endTime?: number;
      durationInMS?: number;
    };
    _retry?: boolean; // Flag to prevent infinite retry loops in auth interceptor
  }
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Internal API instance
const internalAxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds - increased for auth refresh operations
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Enable cookies for refresh token (if using httpOnly cookies)
});

// External API instance (third-party APIs)
const externalAxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add logging interceptors to internal API instance
// NOTE: Auth and refresh interceptors are added in AuthProvider to avoid conflicts
internalAxiosInstance.interceptors.request.use(
  (req) => {
    req.metadata = {
      startTime: new Date().getTime(),
    };
    const startTime = new Date().toLocaleString();
    console.log(
      `⏳ Internal API Request is starting at ${startTime}. (based on local time)`
    );
    console.log(
      `⏳ Method : ${req.method?.toUpperCase()} Request: ${
        req.baseURL + "/" + req.url
      }. (based on local time)`
    );
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

internalAxiosInstance.interceptors.response.use(
  (res) => {
    if (res.config.metadata) {
      res.config.metadata.endTime = new Date().getTime();
      res.config.metadata.durationInMS =
        res.config.metadata.endTime - res.config.metadata.startTime;

      console.log(
        `✅ Internal API Request took ${res.config.metadata.durationInMS} milliseconds.`
      );
    }
    return res;
  },
  (error) => {
    if (error.config?.metadata) {
      error.config.metadata.endTime = new Date().getTime();
      error.config.metadata.durationInMS =
        error.config.metadata.endTime - error.config.metadata.startTime;

      console.log(
        `❌ Internal API Request took ${error.config.metadata.durationInMS} milliseconds.`
      );
    }
    // Don't throw here - let AuthProvider's refresh interceptor handle it first
    return Promise.reject(error);
  }
);

// Add interceptors to external API instance
externalAxiosInstance.interceptors.request.use(
  (req) => {
    req.metadata = {
      startTime: new Date().getTime(),
    };
    const startTime = new Date().toLocaleString();
    console.log(
      `⏳ External API Request is starting at ${startTime}. (based on local time)`
    );
    console.log(
      `⏳ Method :${req.method?.toUpperCase()} Request: ${
        req.url
      }. (based on local time)`
    );
    return req;
  },
  (error) => {
    return Promise.reject(error);
  }
);

externalAxiosInstance.interceptors.response.use(
  (res) => {
    if (res.config.metadata) {
      res.config.metadata.endTime = new Date().getTime();
      res.config.metadata.durationInMS =
        res.config.metadata.endTime - res.config.metadata.startTime;

      console.log(
        `⏳ External API Request took ${res.config.metadata.durationInMS} milliseconds.`
      );
    }
    return res;
  },
  (error) => {
    if (error.config?.metadata) {
      error.config.metadata.endTime = new Date().getTime();
      error.config.metadata.durationInMS =
        error.config.metadata.endTime - error.config.metadata.startTime;

      console.log(
        `⏳ External API Request took ${error.config.metadata.durationInMS} milliseconds.`
      );
    }
    throw error;
  }
);
class Api {
  /** Internal API request method with retry logic */
  static async request<T>(
    endpoint: string,
    data: Record<string, any> = {},
    method: AxiosRequestConfig["method"] = "get",
    customHeaders: Record<string, string> = {},
    retries: number = 3,
    timeout: number = 10000
  ): Promise<T> {
    const headers = {
      ...customHeaders,
    };
    const params = method === "get" ? data : {};
    const requestData = method !== "get" ? data : undefined;
    let responseError: any = null;

    for (let attempt = 0; attempt < Math.max(1, retries); attempt++) {
      try {
        const response: AxiosResponse<T> = await internalAxiosInstance({
          url: endpoint,
          method,
          data: requestData,
          params,
          headers,
          timeout,
        });

        return response.data;
      } catch (error: any) {
        responseError = error;
      }
    }
    const message =
      responseError?.response?.data?.message ||
      responseError?.message ||
      "An unexpected error occurred.";
    throw Array.isArray(message) ? message : [message];
  }

  /** External API request method with retry logic */
  static async externalRequest<T>(
    url: string,
    data: Record<string, any> = {},
    method: AxiosRequestConfig["method"] = "get",
    customHeaders: Record<string, string> = {},
    retries: number = 3,
    timeout: number = 10000
  ): Promise<T> {
    const headers = {
      ...customHeaders,
    };
    const params = method === "get" ? data : {};
    const requestData = method !== "get" ? data : undefined;
    let responseError: any = null;

    for (let attempt = 0; attempt < Math.max(1, retries); attempt++) {
      try {
        const response: AxiosResponse<T> = await externalAxiosInstance({
          url,
          method,
          data: requestData,
          params,
          headers,
          timeout,
        });

        return response.data;
      } catch (error: any) {
        responseError = error;
      }
    }
    const message =
      responseError?.response?.data?.message ||
      responseError?.message ||
      "An unexpected error occurred.";
    throw Array.isArray(message) ? message : [message];
  }

  /** HTTP Helper Methods */
  /** Internal API HTTP Helper Methods */
  static get<T>(
    endpoint: string,
    params: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, params, "get", headers, timeout);
  }

  static post<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "post", headers, timeout);
  }

  static put<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "put", headers, timeout);
  }

  static patch<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "patch", headers, timeout);
  }

  static delete<T>(
    endpoint: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.request<T>(endpoint, data, "delete", headers, timeout);
  }

  /** External API HTTP Helper Methods */
  static externalGet<T>(
    url: string,
    params: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.externalRequest<T>(url, params, "get", headers, timeout);
  }

  static externalPost<T>(
    url: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.externalRequest<T>(url, data, "post", headers, timeout);
  }

  static externalPut<T>(
    url: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.externalRequest<T>(url, data, "put", headers, timeout);
  }

  static externalPatch<T>(
    url: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.externalRequest<T>(url, data, "patch", headers, timeout);
  }

  static externalDelete<T>(
    url: string,
    data: Record<string, any> = {},
    headers: Record<string, string> = {},
    timeout: number = 10000
  ): Promise<T> {
    return Api.externalRequest<T>(url, data, "delete", headers, timeout);
  }
}

export default Api;
export { internalAxiosInstance, externalAxiosInstance };
