import { gatewayURL } from "config/envConfig";
import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";

export const getListData = async () => {
  try {
    const { data } = await axiosInstance.get(apiEndPoints.listData);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getOfferList = async () => {
  try {
    const { data } = await axiosInstance.get(apiEndPoints.offer);
    return data;

    //   dispatch(setOfferData(data));
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getOperators = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getOperators}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getBehaviour = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getBehaviours}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getAbsolutesBehaviour = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getAbsolutesBehaviours}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getRelativesBehaviour = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getRelativesBehaviours}`
    );
    return data;
    //  setRelativesBehaviours(data);
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getSlot = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.getSlots}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getTimes = async () => {
  try {
    const { data } = await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.numberOfTimes}`
    );
    return data;
  } catch (error) {
    console.log(error);
    return error;
  }
};
export const getSegmentsWithListId = async (listId) => {
  try {
    // const { data } = await axiosInstance.get(`${baseURL}/cl/apis/v1/segment/${listId}`);
    const { data } = await await axiosInstance.get(
      `${gatewayURL}${apiEndPoints.segment}/${listId}`
    );

    return data

  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getEmailTags = async () => {
  try {
    const { data } = await axiosInstance.get(apiEndPoints.emailTags);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const getTimeZone = async () => {
  try {
    const { data } = await axiosInstance.get(apiEndPoints.timeZone);
    return data
  } catch (error) {
    console.log(error);
    throw error;
  }
};