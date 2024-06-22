import axios from "axios";
import { gatewayURL } from "config/envConfig";

const axiosInstance = axios.create({
  baseURL: gatewayURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  const response = await axios.post(
    "https://dev.credmudra.com/apis/public/refresh-token",
    {
      refreshToken,
    }
  );
  return response.data?.data?.token?.accessToken;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = JSON.parse(
      localStorage.getItem("token")
    ).access_token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (accessToken) => {
  refreshSubscribers.forEach((callback) => callback(accessToken));
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;

    if (!error.response) {
      alert(
        "A server/network error occurred. " +
        "Looks like CORS might be the problem. " +
        "Sorry about this - we will get it fixed shortly."
      );
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === `${gatewayURL}/core/refresh-token`
    ) {
      delete axios.defaults.headers.common.Authorization;
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login/";
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      delete axios.defaults.headers.common.Authorization;
      const refreshToken = localStorage.getItem("token")
        ? JSON.parse(localStorage.getItem("token"))?.refresh_token
        : null;
      if (refreshToken) {
        try {
          const refreshResponse = await axios.post(
            `${gatewayURL}/core/refresh-token`,
            {
              data: {
                clientName: "campaignlabs",
                refreshToken: refreshToken,
              },
            }
          );
          const token = { "token": refreshResponse.data.data };
          localStorage.setItem("token", JSON.stringify(token));
          const newToken = refreshResponse.data.data.access_token;

          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newToken}`;

          error.config.headers["Authorization"] = "Bearer " + `${newToken}`;
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return Promise.reject(refreshError);
        }
      } else {
        window.location.href = "/";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
