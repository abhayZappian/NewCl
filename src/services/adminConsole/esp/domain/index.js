import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";
import { enqueueSnackbar } from "notistack";

export const getDomainDetails = async () => {
  try {
    const res = await axiosInstance.get(
      `${apiEndPoints.domainAccountsDetails}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};
export const DomainAction = async (id, actionType, message) => {
  try {
    const data = {
      action: actionType,
    };
    const res = await axiosInstance.put(
      `${apiEndPoints.updateDomainAccountActiveStatus}/${id}`,
      data
    );
    enqueueSnackbar(message, {
      variant: "success",
    });
  } catch (error) {
    throw error;
  }
};
export const getDomainServicesDetails = async () => {
  try {
    const res = await axiosInstance.get(
      `${apiEndPoints.getDomainServicesNames}`
    );
    return res;
  } catch (error) {
    throw error;
  }
};

export const EditDomainAction = async (id, actionType, message) => {
  try {
    const data = {
      action: actionType,
    };
    const res = await axiosInstance.put(
      `${apiEndPoints.updateDomainActiveStatus}/${id}`,
      data
    );
    enqueueSnackbar(message, {
      variant: "success",
    });
  } catch (error) {
    throw error;
  }
};

// domainHistoricalData ---------------------------------------------------------------------
export const getData = async () => {
  try {
    const { data } = await axiosInstance.get(apiEndPoints?.domainHistoricalData);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
