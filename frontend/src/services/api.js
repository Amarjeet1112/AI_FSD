import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const candidateApi = {
  addCandidate: async (candidateData) => {
    const response = await axios.post(`${API_URL}/candidates`, candidateData);
    return response.data;
  },
  getCandidates: async () => {
    const response = await axios.get(`${API_URL}/candidates`);
    return response.data;
  },
  matchCandidates: async (requirements) => {
    const response = await axios.post(`${API_URL}/candidates/match`, requirements);
    return response.data;
  }
};

export const aiApi = {
  shortlistCandidates: async (candidates, jobRequirements) => {
    const response = await axios.post(`${API_URL}/ai/shortlist`, { candidates, jobRequirements });
    return response.data;
  }
};
