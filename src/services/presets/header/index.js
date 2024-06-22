import apiEndPoints from 'helpers/APIEndPoints';
import axiosInstance from 'helpers/apiService';
import { enqueueSnackbar } from 'notistack';

//____________Header Table____________

export const headerAllDetails = async () => {
    try {
        const data = await axiosInstance.get(apiEndPoints.allHeaderDetails);
        return data;
    } catch (error) {
        throw error;
    }
};

export const handleHeaderAction = async (id, actionType, message) => {
    try {
        const data = {
            action: actionType
        };
        const res = await axiosInstance.put(`${apiEndPoints.updateHeaderActiveStatus}/${id}`, data);
        enqueueSnackbar(`${res.data.message}`, {
            variant: 'success'
        });
        return res;
    } catch (error) {
        throw error;
    }
};

//________________Header Drawer_________________

export const addHeader = async (data) => {
    try {
        const res = await axiosInstance.post(`${apiEndPoints.addHeaderDetails}`, data);
        enqueueSnackbar('Form Submit Successfully !!!', {
            variant: 'success'
        });
        return res;
    } catch (error) {
        enqueueSnackbar(`${error?.response?.data?.msg}`, {
            variant: 'error'
        });
        throw error;

    }
};

export const headerUpdateData = async (id, data) => {
    try {
        const res = await axiosInstance.put(`${apiEndPoints.updateHeaderDetails}/${id}`, data);
        enqueueSnackbar('Form Submit Successfully !!!', {
            variant: 'success'
        });
        return res;
    } catch (error) {
        enqueueSnackbar(`${error?.response?.data?.msg}`, {
            variant: 'error'
        });
        throw error;
    }
};
