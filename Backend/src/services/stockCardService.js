import api from "./apiClient";
import { endpoints } from "../api/endpoints";

const base = endpoints.stockCards;

const stockCardService = {
  list: (params = {}) => api.request(base, { method: "GET", params, preserveMeta: true }),
  getByItem: (itemId, params = {}) => api.request(`${base}/${itemId}`, { method: "GET", params, preserveMeta: true }),
};

export default stockCardService;
