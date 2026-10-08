import { apiRequest } from "./client";

const STATUS_LABELS = {
  RETURN_REQUEST: "Pending Receive",
  RECEIVED: "Pending Inspection",
  INSPECTED: "Inspected",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

export function toDisplayStatus(status) {
  return STATUS_LABELS[status] || status || "Pending Receive";
}

export function normalizeReturn(record) {
  if (!record) return null;
  return {
    ...record,
    displayStatus: toDisplayStatus(record.status),
    returnDate: record.receivedAt ? record.receivedAt.split("T")[0] : record.createdAt?.split("T")[0] || "",
    department: record.department?.name || record.departmentId || "", // Backend might not resolve department? `getReturn` in service shows `departmentId`
    // Actually the `getReturn` service normalizes some stuff. Let's rely on what the backend sends, and just add displayStatus.
  };
}

export async function fetchReturns({ page = 1, limit = 50, search = "", status } = {}) {
  const query = { page, limit };
  if (search) query.search = search;
  
  if (status && status !== "All") {
    const statusMap = {
      "Pending Receive": "RETURN_REQUEST",
      "Pending Inspection": "RECEIVED",
      "Inspected": "INSPECTED",
      "Accepted": "ACCEPTED",
      "Rejected": "REJECTED",
      "All": undefined,
    };
    const backendStatus = statusMap[status];
    if (backendStatus) query.status = backendStatus;
  }

  const result = await apiRequest("/returns", { query });
  const records = Array.isArray(result?.data) ? result.data : [];
  return { records: records.map(normalizeReturn), pagination: result?.pagination || {} };
}

export async function fetchReturnById(id) {
  const result = await apiRequest(`/returns/${id}`);
  const data = result?.data?.return ?? result?.data ?? null;
  return normalizeReturn(data);
}

export async function createReturn(payload) {
  const result = await apiRequest(`/returns`, { method: "POST", body: payload });
  const data = result?.data?.return ?? result?.data ?? null;
  return normalizeReturn(data);
}

export async function receiveReturn(id) {
  const result = await apiRequest(`/returns/${id}/receive`, { method: "POST" });
  const data = result?.data?.return ?? result?.data ?? null;
  return normalizeReturn(data);
}

export async function inspectReturn(id, payload) {
  const result = await apiRequest(`/returns/${id}/inspect`, { method: "POST", body: payload });
  const data = result?.data?.return ?? result?.data ?? null;
  return normalizeReturn(data);
}

export async function approveReturn(id) {
  const result = await apiRequest(`/returns/${id}/approve`, { method: "POST" });
  const data = result?.data?.return ?? result?.data ?? null;
  return normalizeReturn(data);
}

export async function rejectReturn(id, remarks) {
  const result = await apiRequest(`/returns/${id}/reject`, { method: "POST", body: { remarks } });
  const data = result?.data?.return ?? result?.data ?? null;
  return normalizeReturn(data);
}
