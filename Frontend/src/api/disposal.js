import { apiRequest } from "./client";

export async function fetchDisposals() {
  const result = await apiRequest("/disposal");
  return result?.data?.requests || [];
}

export async function fetchDisposalById(id) {
  const result = await apiRequest(`/disposal/${id}`);
  return result?.data?.request || null;
}

export async function createDisposal(payload) {
  const result = await apiRequest("/disposal", {
    method: "POST",
    body: payload,
  });
  return result?.data?.request || null;
}

export async function inspectDisposal(id, payload) {
  const data = await apiRequest(`/disposal/${id}/inspect`, {
    method: "POST",
    body: payload,
  });
  return data?.data?.request || null;
}

export async function approveDisposal(id, payload = {}) {
  const result = await apiRequest(`/disposal/${id}/approve`, {
    method: "POST",
    body: payload,
  });
  return result?.data?.request || null;
}

export async function rejectDisposal(id, payload = {}) {
  const result = await apiRequest(`/disposal/${id}/reject`, {
    method: "POST",
    body: payload,
  });
  return result?.data?.request || null;
}

export async function completeDisposal(id, payload) {
  const result = await apiRequest(`/disposal/${id}/complete`, {
    method: "POST",
    body: payload,
  });
  return result?.data?.request || null;
}
