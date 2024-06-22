import axiosInstance from 'helpers/apiService';
import apiEndPoints from '../../../helpers/APIEndPoints';
import { enqueueSnackbar } from 'notistack';
import { createdByName, createdBy } from 'helpers/userInfo';
export const getData = async () => {
    try {
        const { data } = await axiosInstance.get(`${apiEndPoints.allFooterDetails}`);
        console.log(data?.result);
        return data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
export const handleAction = async (id, actionType, message) => {
    try {
        const data = {
            action: actionType
        };
        const res = await axiosInstance.put(`${apiEndPoints.updateFooterActiveStatus}/${id}`, data);
        enqueueSnackbar(`${res.data.message}`, {
            variant: 'success'
        });
        return res.data;
    } catch (error) {
        enqueueSnackbar(`${error?.response?.data?.msg}`, {
            variant: 'error'
        });
        throw error;
    }
};

////// Footer drawer API services ////////////////////////

export const addFooter = async (values) => {
    try {
        const data = {
            footerDetails: {
                footer_name: values.footer_name.trim(),
                footer_message: values.footer_message,
                creator_name: createdByName,
                created_by: createdBy
            }
        };
        const res = await axiosInstance.post(`${apiEndPoints.addFooterDetails}`, data);
        enqueueSnackbar(res?.data?.msg, {
            variant: 'success'
        });
        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.msg);
        enqueueSnackbar(`${error?.response?.data?.msg}`, {
            variant: 'error'
        });
        throw error;
    }
};
export const updatedFooter = async (values, id) => {
    try {
        const data = {
            footerDetails: {
                footer_name: values.footer_name.trim(),
                footer_message: values.footer_message
            }
        };
        const res = await axiosInstance.put(`${apiEndPoints.updateFooterDetails}/${id}`, data);
        enqueueSnackbar(res.data.message, {
            variant: 'success'
        });
        return res;
    } catch (error) {
        console.log(error.response.data.msg);
        enqueueSnackbar(`${error.response.data.msg}`, {
            variant: 'error'
        });
    }
};
