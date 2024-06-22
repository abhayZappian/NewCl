import apiEndPoints from "helpers/APIEndPoints";
import axiosInstance from "helpers/apiService";

export const getSuppresion = async () => {
    try {
        const { data } = await axiosInstance.get(apiEndPoints.getSuppresion);
        return data
    } catch (error) {
        console.log(error);
        throw error
    }
};