import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/analyses`;

const downloadAnalysisPDF = async (id) => {
  const response = await axios.get(`${API_URL}/${id}/pdf`, {
    withCredentials: true,
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(
    new Blob([response.data], { type: "application/pdf" })
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = `resume-analysis-${id}.pdf`;

  document.body.appendChild(link);
  link.click();

  link.remove();
  window.URL.revokeObjectURL(url);
};

export { downloadAnalysisPDF };