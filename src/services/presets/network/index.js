import axiosInstance from 'helpers/apiService';
import apiEndPoints from 'helpers/APIEndPoints';
import { enqueueSnackbar } from 'notistack';

//______________ Network table_______________
export const networkDetail = async () => {
    try {
        const { data } = await axiosInstance.get(apiEndPoints.allNetworkDetails);
        return data.result;
    } catch (error) {
        throw error;
    }
};

export const NetworkAction = async (id, actionType, message) => {
    try {
        const data = {
            action: actionType
        };
        const res = await axiosInstance.put(`${apiEndPoints.updateNetworkActiveStatus}/${id}`, data);
        enqueueSnackbar(message, {
            variant: 'success'
        });
    } catch (error) {
        throw error;
    }
};

//______________ Network drawer_______________
export const networkPortalListDetail = async (id) => {
    try {
        const { data } = await axiosInstance.get(`${apiEndPoints.networkPortalList}`);
        return data;
    } catch (error) {
        throw error;
    }
};

export const EverFlowNetworksDetail = async (id) => {
    try {
        const { data } = await axiosInstance.get(`${apiEndPoints.EverFlowNetworks}`);
        return data.data;
    } catch (error) {
        throw error;
    }
};

export const addNetwork = async (data) => {
    try {
        const  res  = await axiosInstance.post(apiEndPoints.addNetworkDetails, data);
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

export const updateNetwork = async (id, data) => {
    try {
        const res = await axiosInstance.put(`${apiEndPoints.updateNetworkDetails}/${id}`, data);
        enqueueSnackbar('Form Updated Successfully !!!', {
            variant: 'success'
        });
        return res;
    } catch (error) {
        console.log(error);
        enqueueSnackbar(error.response.data.msg, {
            variant: 'error'
        });
        throw error;
    }
};
