import apiEndPoints from 'helpers/APIEndPoints';
import axiosInstance from 'helpers/apiService';
import { enqueueSnackbar } from 'notistack';

export const getOfferData = async () => {
    try {
        const data = await axiosInstance.get(apiEndPoints.allOfferDetails);
        return data;
    } catch (error) {
        throw error;
    }
};

export const handleActionOffer = async (id, actionType, message) => {
    try {
        const data = {
            action: actionType
        };
        const res = await axiosInstance.put(`${apiEndPoints.updateOfferActiveStatus}/${id}`, data);
        enqueueSnackbar(message, {
            variant: 'success'
        });
        return res;
    } catch (error) {
        enqueueSnackbar('error', {
            variant: 'error'
        });
    }
};

////// offer drawer API services ////////////////////////

export const networkPortalListDetailsOffer = async () => {
    try {
        const data = await axiosInstance.get(`${apiEndPoints.networkPortalList}`);
        return data;
    } catch (error) {
        throw error;
    }
};

export const EverFlowAffiliatesOffer = async () => {
    try {
        const data = await axiosInstance.get(`${apiEndPoints.EverFlowAffiliates}`);
        return data;
    } catch (error) {
        throw error;
    }
};

export const EverFlowNetworksDetailsOffer = async (id) => {
    try {
        const data = await axiosInstance.post(`${apiEndPoints.EverFlowNetworksOffersForm}/${id}`);
        return data;
    } catch (error) {
        throw error;
    }
};

export const EverFlowOffersDetailsOffer = async (id) => {
    try {
        const data = await axiosInstance.post(`${apiEndPoints.EverFlowOffers}/${id}`);
        return data;
    } catch (error) {
        throw error;
    }
};

export const addOfferData = async (data) => {
    try {
        const { res } = await axiosInstance.post(`${apiEndPoints.addOfferDetails}`, data);
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
export const getUpdateDataOffer = async (id, data) => {
    try {
        const { res } = await axiosInstance.put(`${apiEndPoints.updateOfferDetails}/${id}`, data);
        enqueueSnackbar('Form Submit Successfully !!!', {
            variant: 'success'
        });
    } catch (error) {
        enqueueSnackbar(`${error?.response?.data?.msg}`, {
            variant: 'error'
        });
        throw error;
    }
};
