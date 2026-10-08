import { apiRequest } from "./client";

export async function fetchTransfers({ page = 1, limit = 50, search = "", status } = {}) {
  const query = { page, limit };
  if (search) query.search = search;
  if (status && status !== "All") query.status = status;

  const result = await apiRequest("/stock-transfers", { query });
  const records = Array.isArray(result?.data) ? result.data : [];
  return { records, pagination: result?.pagination || {} };
}

export async function fetchTransferById(id) {
  const result = await apiRequest(`/stock-transfers/${id}`);
  return result?.data ?? null;
}

export async function createTransfer(payload) {
  const result = await apiRequest(`/stock-transfers`, {
    method: "POST",
    body: payload,
  });
  return result?.data?.transfer ?? result?.data ?? null;
}


export async function submitTransfer(id) {
  const result = await apiRequest(`/stock-transfers/${id}/submit`, { method: "POST" });
  return result?.data ?? null;
}

export async function approveTransfer(id) {
  const result = await apiRequest(`/stock-transfers/${id}/approve`, { method: "POST" });
  return result?.data ?? null;
}

export async function completeTransfer(id) {
  const result = await apiRequest(`/stock-transfers/${id}/complete`, { method: "POST" });
  return result?.data ?? null;
}
