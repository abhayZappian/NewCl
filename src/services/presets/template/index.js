import apiEndPoints from 'helpers/APIEndPoints';
import axiosInstance from 'helpers/apiService';
import { enqueueSnackbar } from 'notistack';

//___________________Template Table_____________

export const templateAllDetail = async () => {
    try {
        const { data } = await axiosInstance.get(apiEndPoints.allTemplateDetails);
        return data;
    } catch (error) {
        throw error;
    }
};

export const handleTemplateAction = async (id, actionType, message) => {
    const data = {
        action: actionType
    };
    try {
        const res = await axiosInstance.put(`${apiEndPoints.updateTemplateActiveStatus}/${id}`, data);
        enqueueSnackbar(message, {
            variant: 'success'
        });
    } catch (error) {
        enqueueSnackbar('error', {
            variant: 'error'
        });
    }
};

//_______________Tamplate Drawer_________________

export const addTemplate = async (data) => {
    try {
        const res = await axiosInstance.post(apiEndPoints.addTemplateDetails, data);
        if (res.status === 200) {
            enqueueSnackbar('Form Submit Successfully !!!', {
                variant: 'success'
            });
        }
        return res;
    } catch (error) {
        enqueueSnackbar(`${error.response.data.msg}`, {
            variant: 'error'
        });
        throw error;
    }
};

export const templateUpdate = async (id, data) => {
    try {
        const res = await axiosInstance.put(`${apiEndPoints.updateTemplateDetails}/${id}`, data);
        if (res.status === 200) {
            enqueueSnackbar('Form Updated Successfully !!!', {
                variant: 'success'
            });
        }
        return res;
    } catch (error) {
        enqueueSnackbar(`${error.response.data.msg}`, {
            variant: 'error'
        });
        throw error;
    }
};
