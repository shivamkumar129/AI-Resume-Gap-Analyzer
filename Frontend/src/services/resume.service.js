
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/resumes`;

const uploadResume = async (file) => {
    const formData = new FormData();

    formData.append("resume", file);

    const response = await axios.post(
        `${API_URL}/upload`,
        formData,
        {
            withCredentials: true,
        }
    );

    return response.data;
};

const getMyResumes = async () => {
    const response = await axios.get(API_URL, {
        withCredentials: true,
    });

    return response.data;
};

const getResumeById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
    });

    return response.data;
};
const deleteResume = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });

  return response.data;
};
export {
    uploadResume,
    getMyResumes,
    getResumeById,
    deleteResume
};

