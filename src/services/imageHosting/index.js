import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";

export const uploadImages = async (files) => {
  try {
    let formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await axiosInstance.post(
      apiEndPoints.imageHosting,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    enqueueSnackbar(response.data.message, {
      variant: "success",
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    enqueueSnackbar(`${error?.response?.data?.message}`, {
      variant: "error",
    });
    throw error;
  }
};

export const getData = async () => {
  try {
    const { data } = await axiosInstance.get(`${apiEndPoints.imageHosting}`);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteData = async (id) => {
  try {
    const res = await axiosInstance.put(`${apiEndPoints.imageHosting}/${id}`);
    enqueueSnackbar(res.data.message, {
      variant: "success",
    });
    return res.data;
  } catch (error) {
    console.log(error);
    enqueueSnackbar("Error deleting images", {
      variant: "error",
    });
    throw error;
  }
};
