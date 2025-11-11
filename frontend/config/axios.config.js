import axios from "axios";
import {
  clear,
  clearAllCookies,
  extractDomainFromUrl,
  getCookie,
  setCookie,
  setItem,
} from "../helpers/localStorage";
import {
  ACCESS_TOKEN,
  ACTIVEDOMAIN,
  REFRESH_TOKEN,
} from "../constants/defaultKeys";
import { getTokenIfNotExpired } from "../helpers/utility";
import { message } from "antd";
import { redirectToDashboard } from "../components/Auth/helper";

const axiosConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const axiosInstance = axios.create(axiosConfig);

axiosInstance.interceptors.request.use((config) => {
  const token = getCookie(ACCESS_TOKEN);
  const Organization = getCookie("organisation_id");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (Organization) {
    config.headers.Organization = Organization;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const refreshTokenApi = "/accounts/refresh-token/";
    const originalRequest = error?.config;
    // const errorCode = error?.response?.data?.code;
    const errorMessage = error?.response?.data?.detail?.code;
    const errorStatusCode = error?.response?.status;
    const tokenInvalid = "TOKEN_EXPIRED";
    const accountNotFound = "UNAUTHORIZED_USER";

    // Prevent infinite loops
    if (errorStatusCode === 401 && originalRequest.url === refreshTokenApi) {
      clear();
      clearAllCookies();
      window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/`;
      return Promise.reject(error);
    }
    if (errorStatusCode === 403) {
      redirectToDashboard(getCookie(ACTIVEDOMAIN));
      error?.response?.data?.message &&
        setItem("customError", error?.response?.data?.message);
    }

    //Invalid credentials or user not exist
    if (errorMessage === accountNotFound && errorStatusCode === 401) {
      clear();
      window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/logout`;
    }

    //triggers when user session is expired
    if (errorMessage === tokenInvalid && errorStatusCode === 401) {
      const refreshToken = getCookie(REFRESH_TOKEN);
      const mainDomainUrl = process.env.NEXT_PUBLIC_DOMAIN_BASE_URL;
      const mainDomain = extractDomainFromUrl(mainDomainUrl);
      if (refreshToken) {
        const regex = new RegExp(
          "^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$"
        );

        if (regex.test(refreshToken)) {
          const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

          // exp date in token is expressed in seconds, while now() returns milliseconds:
          const now = Math.ceil(Date.now() / 1000);

          //triggers if refresh token is not expired
          if (tokenParts.exp > now) {
            return axiosInstance
              .post(refreshTokenApi, { refresh: refreshToken })
              .then((response) => {
                setCookie(
                  ACCESS_TOKEN,
                  response.data.access,
                  `.${process.env.NEXT_PUBLIC_DOMAIN}`,
                  "/"
                );
                return axiosInstance(originalRequest);
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            clear();
            window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/logout`;
            message.error(
              "Your session has been expired, please login again",
              8
            );
          }
        } else {
          clear();
          window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/logout`;
        }
      } else {
        clear();
        window.location.href = `${process.env.NEXT_PUBLIC_DOMAIN_BASE_URL}/logout`;
        message.error("Your session has been expired, please login again", 8);
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export default axiosInstance;
