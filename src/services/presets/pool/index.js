import apiEndPoints from 'helpers/APIEndPoints';
import axiosInstance from 'helpers/apiService';
import { enqueueSnackbar } from 'notistack';

export const getPoolDetails = async () => {
    try {
        const data = await axiosInstance.get(apiEndPoints.pool);
        return data;
    } catch (error) {
        throw error;
    }
};
export const handleActionPool = async (id, actionType, message) => {
    try {
        const data = {
            active: actionType
        };
        const res = await axiosInstance.put(`${apiEndPoints.updatepoolActiveStatusL}/${id}`, data);
        enqueueSnackbar(`${res.data.msg}`, {
            variant: 'success'
        });
    } catch (error) {
        enqueueSnackbar(`error`, {
            variant: 'error'
        });
        throw error;
    }
};

//////////////// pool drawer services

export const getTemplateDetails = async () => {
    try {
        const data = await axiosInstance.get(apiEndPoints.getTemplate);
        return data;
    } catch (error) {
        throw error;
    }
};

export const getPoolTypeDetails = async () => {
    try {
        const data = await axiosInstance.get(apiEndPoints.poolType);
        return data;
    } catch (error) {
        throw error;
    }
};

export const getOffersDetails = async () => {
    try {
        const data = await axiosInstance.get(apiEndPoints.offer);
        return data;
    } catch (error) {
        throw error;
    }
};

export const getESPdetails = async () => {
    try {
        const data = await axiosInstance.get(apiEndPoints.emailServiceProvider);
        return data;
    } catch (error) {
        throw error;
    }
};

export const getESAdetails = async (id) => {
    try {
        const data = await axiosInstance.get(`${apiEndPoints.emailServiceProviderAccounts}/${id}`);
        return data;
    } catch (error) {
        throw error;
    }
};

export const getHeaderDetails = async (id) => {
    try {
        const data = await axiosInstance.get(apiEndPoints.getHeaderIdAndName);
        return data;
    } catch (error) {
        throw error;
    }
};

export const addPool = async (data) => {
    try {
        const res = await axiosInstance.post(apiEndPoints.poolCreate, data);
        enqueueSnackbar(`${res?.data?.msg}`, { variant: 'success' });
    } catch (error) {
        enqueueSnackbar(`${error?.response?.data?.msg}`, {
          variant: "error",
        });
        throw error;
    }
};
export const updatePoolDetails = async (id, data) => {
    try {
        const res = await axiosInstance.post(`${apiEndPoints.pool}/${id}`, data);
        enqueueSnackbar(`${res.data.msg}`, { variant: 'success' });
    } catch (error) {
        enqueueSnackbar(`${error?.response?.data?.msg}`, {
            variant: 'error'
        });
        throw error;
    }
};
