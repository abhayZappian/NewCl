import apiEndPoints from "helpers/APIEndPoints";
import { enqueueSnackbar } from "notistack";
import axiosInstance from "helpers/apiService";

export const createQuickJourney = async (values) => {
    try {

        const { data } = await axiosInstance.post(`${apiEndPoints.createQuickJourney}`, values);
        enqueueSnackbar(data?.message, {
            variant: 'success'
        });
        return data;
    } catch (error) {
        console.log(error);
        enqueueSnackbar(`${error?.response?.data?.message
            }`, {
            variant: 'error'
        });
        throw error;
    }
};

export const allQuickJourney = async () => {
    try {
        const { data } = await axiosInstance.get(
            apiEndPoints.allQuickJourney);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getSendTestEmail = async (sendTestEmail) => {
    try {
        const data = await axiosInstance.post(apiEndPoints.getSendTestEmail, sendTestEmail);
        if (data.status === 200) {
            enqueueSnackbar(data.data.message, {
                variant: 'success'
            });
            // setSendTestEmail(data);
        }
        return data
    } catch (error) {
        enqueueSnackbar(error.response.data.error, {
            variant: 'error'
        });
    }

};
export const updateQuickJourney = async (values, id) => {
    try {
        const { data } = await axiosInstance.put(`${apiEndPoints.updateQuickJourney}/${id}`, values);
        console.log(data);
        enqueueSnackbar(data.message, {
            variant: 'success'
        });
        return data;
    } catch (error) {
        console.log(error.response.data.msg);
        enqueueSnackbar(`${error.response.data.message}`, {
            variant: 'error'
        });
    }
};
