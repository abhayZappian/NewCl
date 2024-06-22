import { gatewayURL } from 'config/envConfig';
import apiEndPoints from 'helpers/APIEndPoints';
import axiosInstance from 'helpers/apiService';
import { enqueueSnackbar } from 'notistack';

export const addEspAccount = async (data) => {
    try {
        const res = await axiosInstance.post(`${gatewayURL}${apiEndPoints.addEspAccount}`, data);
        enqueueSnackbar(`${res?.data?.message}`, {
            variant: 'success'
        });
        return res;
    } catch (error) {
        console.log(error);
        enqueueSnackbar(`${error?.response?.data?.message}`, {
            variant: 'error'
        });
        throw error;
    }
};

export const getAllEspProviderAccount = async () => {
    try {
        const { data } = await axiosInstance.get(`${apiEndPoints.getAllEspProviderAccount}`);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const editEspAccount = async (data, id) => {
    try {
        const res = await axiosInstance.post(`/dm/apis/v1/editEspAccount/${id}`, data);
        enqueueSnackbar('Form Updated Successfully !!!', {
            variant: 'success'
        });
        return res;
    } catch (error) {
        console.log(error);
        enqueueSnackbar(error.response.data.message, {
            variant: 'error'
        });
        throw error;
    }
};

export const changeEspIspStatus = async (id, actionType, message) => {
    try {
        const data = {
            active: actionType
        };
        const res = await axiosInstance.put(`/dm/apis/v1/changeEspIspStatus/${id}`, data);
        enqueueSnackbar(res.data.message, {
            variant: 'success'
        });
    } catch (error) {
        throw error;
    }
};
