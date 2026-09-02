import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/analyses`;

const createAnalysis = async (resumeId, jobDescriptionId) => {
  const response = await axios.post(
    API_URL,
    {
      resumeId,
      jobDescriptionId,
    },
    {
      withCredentials: true,
    }
  );

  return response.data;
};

const getMyAnalyses = async () => {
  const response = await axios.get(API_URL, {
    withCredentials: true,
  });

  return response.data;
};

const getAnalysisById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

const deleteAnalysis = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    withCredentials: true,
  });

  return response.data;
};

export {
  createAnalysis,
  getMyAnalyses,
  getAnalysisById,
  deleteAnalysis,
};