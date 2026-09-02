
import axios from "axios";

const API_URL = "http://localhost:3000/api/job-descriptions";

const createJobDescription = async (title, company, description) => {
    const response = await axios.post(
        API_URL,
        {
            title,
            company,
            description,
        },
        {
            withCredentials: true,
        }
    );

    return response.data;
};

const getMyJobDescriptions = async () => {
    const response = await axios.get(API_URL, {
        withCredentials: true,
    });

    return response.data;
};

const getJobDescriptionById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
    });

    return response.data;
};

export {
    createJobDescription,
    getMyJobDescriptions,
    getJobDescriptionById,
};

