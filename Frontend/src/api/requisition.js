import { apiRequest } from "./client";

const STATUS_LABELS = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PICKING: "Picking",
  ISSUED: "Issued",
  COMPLETED: "Completed",
};

export function displayStatus(status) {
  return STATUS_LABELS[status] || status || "Draft";
}

export function normalizeRequisition(record = {}) {
  const items = Array.isArray(record.items) ? record.items.map((item) => ({
    id: item.id ?? item.requisitionItemId ?? item.itemId ?? "",
    itemId: item.itemId ?? item.item?.id ?? "",
    itemCode: item.item?.code ?? item.itemCode ?? "",
    itemName: item.item?.name ?? item.itemName ?? "",
    unit: item.item?.unit?.name ?? item.item?.unit ?? item.unit ?? "",
    requestedQty: Number(item.requestedQty ?? item.quantity ?? 0),
    quantity: Number(item.requestedQty ?? item.quantity ?? 0),
    approvedQty: Number(item.approvedQty ?? 0),
    issuedQty: Number(item.issuedQty ?? 0),
    locationId: item.locationId ?? item.location?.id ?? null,
    locationName: item.location?.code ?? item.location?.name ?? "",
    remarks: item.remarks ?? "",
  })) : [];

  return {
    id: record.id ?? "",
    requisitionNo: record.requisitionNo ?? record.id ?? "",
    requesterId: record.requesterId ?? record.requester?.id ?? "",
    requester: record.requester?.fullName ?? record.requester?.username ?? record.requester ?? "",
    departmentId: record.departmentId ?? record.department?.id ?? "",
    department: record.department?.name ?? record.department ?? "",
    storeId: record.storeId ?? record.store?.id ?? "",
    store: record.store?.name ?? record.store ?? "",
    purpose: record.purpose ?? "",
    requiredDate: record.requiredDate ? new Date(record.requiredDate).toISOString().split("T")[0] : "",
    remarks: record.remarks ?? "",
    status: displayStatus(record.status),
    createdDate: record.createdAt ? new Date(record.createdAt).toISOString().split("T")[0] : "",
    items,
    metadata: record,
  };
}

function toBackendStatus(status) {
  if (!status || status === "All") {
    return undefined;
  }

  const statusMap = {
    Draft: "DRAFT",
    "Pending Approval": "PENDING_APPROVAL",
    Approved: "APPROVED",
    Rejected: "REJECTED",
    Submitted: "SUBMITTED",
    Picking: "PICKING",
    Issued: "ISSUED",
    Completed: "COMPLETED",
  };

  return statusMap[status] || status;
}

function toIsoDate(value) {
  if (!value) {
    return null;
  }

  const normalized = value.includes("T") ? value : `${value}T00:00:00Z`;
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

export async function fetchRequisitions({ search = "", status = "All", page = 1, limit = 50 } = {}) {
  const query = { page, limit };

  if (search) {
    query.search = search;
  }

  const backendStatus = toBackendStatus(status);
  if (backendStatus) {
    query.status = backendStatus;
  }

  const result = await apiRequest("/requisitions", { query });
  const records = Array.isArray(result?.data) ? result.data : Array.isArray(result?.data?.requisitions) ? result.data.requisitions : [];

  return {
    data: records.map(normalizeRequisition),
    pagination: result?.pagination || { totalPages: 1 },
  };
}

export async function fetchRequisitionById(id) {
  const result = await apiRequest(`/requisitions/${id}`);
  const requisition = result?.data?.requisition ?? result?.data ?? result;
  return normalizeRequisition(requisition);
}

export async function createRequisition(payload) {
  const result = await apiRequest("/requisitions", {
    method: "POST",
    body: payload,
  });

  const requisition = result?.data?.requisition ?? result?.data ?? result;
  return normalizeRequisition(requisition);
}

export async function updateRequisition(id, payload) {
  const result = await apiRequest(`/requisitions/${id}`, {
    method: "PATCH",
    body: payload,
  });

  const requisition = result?.data?.requisition ?? result?.data ?? result;
  return normalizeRequisition(requisition);
}

export async function submitRequisition(id) {
  const result = await apiRequest(`/requisitions/${id}/submit`, { method: "POST" });
  const requisition = result?.data?.requisition ?? result?.data ?? result;
  return normalizeRequisition(requisition);
}

export async function approveRequisition(id, payload = {}) {
  const result = await apiRequest(`/requisitions/${id}/approve`, {
    method: "POST",
    body: {
      comments: payload.comments ?? null,
      items: Array.isArray(payload.items) ? payload.items : [],
    },
  });

  const requisition = result?.data?.requisition ?? result?.data ?? result;
  return normalizeRequisition(requisition);
}

export async function rejectRequisition(id, comments) {
  const result = await apiRequest(`/requisitions/${id}/reject`, {
    method: "POST",
    body: { comments },
  });

  const requisition = result?.data?.requisition ?? result?.data ?? result;
  return normalizeRequisition(requisition);
}

export async function amendRequisition(id) {
  const result = await apiRequest(`/requisitions/${id}/amend`, { method: "POST" });
  const requisition = result?.data?.requisition ?? result?.data ?? result;
  return normalizeRequisition(requisition);
}

export function mapRequisitionFormPayload(form, items) {
  return {
    departmentId: form.departmentId || form.department,
    storeId: form.storeId || form.store,
    purpose: form.purpose,
    requiredDate: toIsoDate(form.requiredDate),
    remarks: form.remarks || null,
    items: items.map((item) => ({
      itemId: item.itemId || item.id || item.itemCode,
      locationId: item.locationId || null,
      requestedQty: Number(item.requestedQty ?? item.quantity ?? 0),
      remarks: item.remarks || null,
    })),
  };
}
