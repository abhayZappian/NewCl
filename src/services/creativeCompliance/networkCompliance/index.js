import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";

export const getNetworkList = async () => {
  try {
    const { data } = await axiosInstance.get(
      apiEndPoints.networkComplainceDetails
    );
    return data;
    // setSegmentCategory(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getNetworkName = async () => {
  try {
    const { data } = await axiosInstance.get(apiEndPoints.getNetworkName);
    return data;
    // setSegmentCategory(data);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const addNetwork = async (data) => {
  try {
    const res = await axiosInstance.post(
      apiEndPoints.addNetworkComplaince,
      data
    );
    enqueueSnackbar(`${res?.data?.message}`, {
      variant: "success",
    });
    return res;
  } catch (error) {
    console.log(error);
    enqueueSnackbar(`${error?.response?.data?.message}`, {
      variant: "error",
    });
    throw error;
  }
};
export const updateNetwork = async (data, id) => {
  try {
    const res = await axiosInstance.put(
      `${apiEndPoints.editNetworkComplaince}${id}`,
      data
    );
    enqueueSnackbar(`${res?.data?.message}`, {
      variant: "success",
    });
    return res;
  } catch (error) {
    console.log(error);
    enqueueSnackbar(`${error?.response?.data?.message}`, {
      variant: "error",
    });
    throw error;
  }
};