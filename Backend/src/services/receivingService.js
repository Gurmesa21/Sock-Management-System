import api from "./apiClient";
import { endpoints } from "../api/endpoints";

const { receiving } = endpoints;

export const receivingService = {
  list: async (params = {}) => {
    const result = await api.request(receiving.base, { method: "GET", params, preserveMeta: true });
    return result;
  },
  getById: (id) => api.get(`${receiving.base}/${id}`),
  create: (data) => api.post(receiving.base, data),
  verify: (id, data = {}) => api.post(`${receiving.base}/${id}/verify`, data),
  listInspections: (params = {}) => api.request(`${receiving.base}/inspections`, { method: "GET", params, preserveMeta: true }),
  getInspection: (id) => api.get(`${receiving.base}/inspections/${id}`),
  createInspection: (data) => api.post(`${receiving.base}/inspections`, data),
  evaluateInspection: (id, data) => api.post(`${receiving.base}/inspections/${id}/evaluate`, data),
  options: () => api.get(receiving.options),
  listGRNs: (params = {}) => api.request(receiving.grnList, { method: "GET", params, preserveMeta: true }),
  getGRN: (id) => api.get(`${receiving.grn}/${id}`),
  createGRN: (data) => api.post(receiving.grn, data),
};

export default receivingService;