import { apiRequest } from "./client";

export const PURCHASE_REQUISITION_STATUSES = [
  "DRAFT",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "ORDERED",
  "PARTIALLY_RECEIVED",
  "RECEIVED",
  "CANCELLED",
];

export const PURCHASE_REQUISITION_STATUS_LABELS = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  ORDERED: "Ordered",
  PARTIALLY_RECEIVED: "Partially Received",
  RECEIVED: "Received",
  CANCELLED: "Cancelled",
};

export function displayPurchaseRequisitionStatus(status) {
  return PURCHASE_REQUISITION_STATUS_LABELS[status] || status || "Draft";
}

function unwrapList(response) {
  const data = response?.data ?? response ?? {};
  const container = data?.data ?? data;
  const records = Array.isArray(container)
    ? container
    : Array.isArray(container?.data)
      ? container.data
      : Array.isArray(container?.requisitions)
        ? container.requisitions
        : Array.isArray(container?.rows)
          ? container.rows
          : [];

  const pagination = container?.pagination ?? data?.pagination ?? {};

  return { records, pagination };
}

function normalizeItem(item = {}) {
  return {
    id: item.id || "",
    itemId: item.itemId || item.item?.id || "",
    itemCode: item.itemCode || item.item?.code || "",
    itemName: item.itemName || item.item?.name || "",
    unit: item.unit || item.item?.unit?.name || "",
    quantity: Number(item.quantity ?? 0),
    notes: item.notes || "",
  };
}

export function normalizePurchaseRequisition(record = {}) {
  return {
    id: record.id || "",
    requestNumber: record.requestNumber || record.requisitionNo || record.id || "",
    requesterId: record.requesterId || record.requester?.id || "",
    requester: record.requester?.fullName || record.requester?.username || record.requester || "",
    departmentId: record.departmentId || record.department?.id || "",
    department: record.department?.name || record.department || "",
    storeId: record.storeId || record.store?.id || "",
    store: record.store?.name || record.store || "",
    supplierId: record.supplierId || record.supplier?.id || "",
    supplier: record.supplier?.name || record.supplier || "",
    requiredDate: record.requiredDate || "",
    purpose: record.purpose || "",
    estimatedCost: Number(record.estimatedCost ?? 0),
    notes: record.notes || "",
    status: record.status || "DRAFT",
    statusLabel: displayPurchaseRequisitionStatus(record.status),
    rejectionReason: record.rejectionReason || "",
    submittedAt: record.submittedAt || null,
    approvedAt: record.approvedAt || null,
    rejectedAt: record.rejectedAt || null,
    approvedBy: record.approvedBy || null,
    createdAt: record.createdAt || null,
    updatedAt: record.updatedAt || null,
    items: Array.isArray(record.items) ? record.items.map(normalizeItem) : [],
    purchaseOrders: Array.isArray(record.purchaseOrders) ? record.purchaseOrders : [],
  };
}

export async function fetchPurchaseRequisitions({
  search = "",
  status = "All",
  page = 1,
  limit = 20,
} = {}) {
  const query = { page, limit };

  if (search.trim()) {
    query.search = search.trim();
  }

  if (status && status !== "All") {
    query.status = status;
  }

  const result = await apiRequest("/procurement/requisitions", { query });
  const { records, pagination } = unwrapList(result);

  return {
    data: records.map(normalizePurchaseRequisition),
    pagination,
  };
}

export async function fetchPurchaseRequisitionById(id) {
  const result = await apiRequest(`/procurement/requisitions/${encodeURIComponent(id)}`);
  const record = result?.data?.requisition ?? result?.data ?? result;
  return normalizePurchaseRequisition(record);
}

function toIsoDate(value) {
  if (!value) return null;
  if (value.includes("T")) return value;
  return `${value}T00:00:00.000Z`;
}

export function mapPurchaseRequisitionFormPayload(form, items) {
  return {
    departmentId: form.departmentId,
    storeId: form.storeId,
    requiredDate: toIsoDate(form.requiredDate),
    purpose: form.purpose.trim(),
    estimatedCost:
      form.estimatedCost === "" || form.estimatedCost === null
        ? undefined
        : Number(form.estimatedCost),
    notes: form.notes.trim() || undefined,
    items: items.map((item) => ({
      itemId: item.itemId,
      quantity: Number(item.quantity),
      notes: item.notes?.trim() || undefined,
    })),
  };
}

function unwrapRequisition(response) {
  const record = response?.data?.requisition ?? response?.data ?? response;
  return normalizePurchaseRequisition(record);
}

export async function createPurchaseRequisition(payload) {
  const result = await apiRequest("/procurement/requisitions", {
    method: "POST",
    body: payload,
  });
  return unwrapRequisition(result);
}

export async function updatePurchaseRequisition(id, payload) {
  const result = await apiRequest(`/procurement/requisitions/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  });
  return unwrapRequisition(result);
}

export async function submitPurchaseRequisition(id) {
  const result = await apiRequest(`/procurement/requisitions/${encodeURIComponent(id)}/submit`, {
    method: "POST",
  });
  return unwrapRequisition(result);
}

export async function approvePurchaseRequisition(id, comments = "") {
  const result = await apiRequest(`/procurement/requisitions/${encodeURIComponent(id)}/approve`, {
    method: "POST",
    body: { comments: comments.trim() || undefined },
  });
  return unwrapRequisition(result);
}

export async function rejectPurchaseRequisition(id, reason) {
  const result = await apiRequest(`/procurement/requisitions/${encodeURIComponent(id)}/reject`, {
    method: "POST",
    body: { reason: reason.trim() },
  });
  return unwrapRequisition(result);
}

export async function assignPurchaseRequisitionSupplier(id, supplierId) {
  const result = await apiRequest(`/procurement/requisitions/${encodeURIComponent(id)}/supplier`, {
    method: "PATCH",
    body: { supplierId },
  });
  return unwrapRequisition(result);
}
