import { apiRequest } from "./client";

export async function fetchStockTakings() {
  const result = await apiRequest("/stock-taking");
  return result?.data?.stockTakings || [];
}

export async function fetchStockTakingById(id) {
  const result = await apiRequest(`/stock-taking/${id}`);
  return result?.data?.stockTaking || null;
}

export async function createStockTaking(payload) {
  const result = await apiRequest("/stock-taking", {
    method: "POST",
    body: payload,
  });
  return result?.data?.stockTaking || null;
}

export async function addStockTakingCount(id, payload) {
  const result = await apiRequest(`/stock-taking/${id}/counts`, {
    method: "POST",
    body: payload,
  });
  return result?.data?.count || null;
}

export async function compareStockTaking(id) {
  const result = await apiRequest(`/stock-taking/${id}/compare`, {
    method: "POST",
  });
  return result?.data?.discrepancies || [];
}

export async function investigateDiscrepancy(discrepancyId, payload) {
  const result = await apiRequest(`/stock-taking/discrepancies/${discrepancyId}/investigate`, {
    method: "POST",
    body: payload,
  });
  return result?.data?.discrepancy || null;
}
