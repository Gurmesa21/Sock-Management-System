import api from "./apiClient";
import { endpoints } from "../api/endpoints";

const base = endpoints.binCards;

const binCardService = {
  list: (params = {}) => api.request(base, { method: "GET", params, preserveMeta: true }),
  getByLocation: (locationId, params = {}) => api.request(`${base}/${locationId}`, { method: "GET", params, preserveMeta: true }),
};

export default binCardService;
