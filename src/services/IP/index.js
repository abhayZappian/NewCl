import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";

export const getData = async () => {
  try {
    const { data } = await axiosInstance.get(apiEndPoints?.getallIp);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const addIp = async (formData) => {
  try {
    const response = await axiosInstance.post(apiEndPoints.addIp, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Response:", response.data);
    enqueueSnackbar(`${response?.data?.message}`, {
      variant: "success",
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    enqueueSnackbar(`${error?.response?.data?.message}`, {
      variant: "error",
    });
    throw error;
  }
};

export const updateIp = async (ipData, id) => {
  try {
    const data = await axiosInstance.put(
      `${apiEndPoints.updateIp}/${id}`,
      ipData
    );
    enqueueSnackbar(data?.data?.message, {
      variant: "success",
    });
    return data;
  } catch (error) {
    enqueueSnackbar(`${error.response.data.message}`, {
      variant: "error",
    });
    throw error;
  }
};
