import { apiRequest } from "./client";

const ISSUE_STATUS_LABELS = {
  PICKING: "Picking",
  ISSUED: "Issued",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const REQUISITION_STATUS_LABELS = {
  DRAFT: "Draft",
  SUBMITTED: "Submitted",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PICKING: "Picking",
  ISSUED: "Issued",
  COMPLETED: "Completed",
};

function toDisplayStatus(value) {
  return ISSUE_STATUS_LABELS[value] || REQUISITION_STATUS_LABELS[value] || value || "Picking";
}

function asNumber(value) {
  const number = Number(value ?? 0);
  return Number.isFinite(number) ? number : 0;
}

export function normalizeIssue(record = {}) {
  const items = Array.isArray(record.items) ? record.items.map((item) => ({
    id: item.id ?? item.requisitionItemId ?? item.itemId ?? "",
    requisitionItemId: item.requisitionItemId ?? item.id ?? "",
    itemId: item.itemId ?? item.item?.id ?? "",
    itemCode: item.item?.code ?? item.itemCode ?? "",
    itemName: item.item?.name ?? item.itemName ?? "",
    unit: item.item?.unit?.name ?? item.item?.unit ?? item.unit ?? "",
    locationId: item.locationId ?? item.location?.id ?? null,
    locationName: item.location?.code ?? item.location?.name ?? "",
    requestedQty: asNumber(item.requestedQty ?? item.requestedQuantity ?? 0),
    approvedQty: asNumber(item.approvedQty ?? item.requestedQty ?? 0),
    issuedQty: asNumber(item.issuedQty ?? item.issueQuantity ?? 0),
    remarks: item.remarks ?? "",
  })) : [];

  return {
    id: record.id ?? "",
    issueNo: record.issueNo ?? record.id ?? "",
    requisitionId: record.requisitionId ?? record.requisition?.id ?? "",
    requisitionNo: record.requisition?.requisitionNo ?? record.requisitionNo ?? "",
    storeId: record.storeId ?? record.store?.id ?? "",
    storeName: record.store?.name ?? record.store ?? "",
    departmentId: record.requisition?.departmentId ?? record.departmentId ?? "",
    department: record.requisition?.department?.name ?? record.department ?? "",
    purpose: record.requisition?.purpose ?? record.purpose ?? "",
    remarks: record.remarks ?? "",
    status: toDisplayStatus(record.status),
    issueDate: record.issueDate ? new Date(record.issueDate).toISOString().split("T")[0] : "",
    createdAt: record.createdAt ? new Date(record.createdAt).toISOString().split("T")[0] : "",
    items,
    metadata: record,
  };
}

export function normalizeIssueVoucher(record = {}) {
  const storeIssue = record.storeIssue ?? {};
  const issuedToUser =
    record.issuedToUser ??
    storeIssue.requisition?.requester ??
    null;

  return {
    id: record.id ?? "",
    voucherNo: record.voucherNo ?? record.voucherNumber ?? "",
    type: record.type ?? "SIV",
    storeIssueId: record.storeIssueId ?? storeIssue.id ?? "",
    issueId: record.storeIssueId ?? storeIssue.id ?? "",
    issueNo: storeIssue.issueNo ?? storeIssue.issueNumber ?? "",
    requisitionNo: storeIssue.requisition?.requisitionNo ?? "",
    status: toDisplayStatus(storeIssue.status),
    remarks: record.remarks ?? "",
    voucherDate: record.voucherDate ? new Date(record.voucherDate).toISOString().split("T")[0] : "",
    storeName: storeIssue.store?.name ?? "",
    department: storeIssue.requisition?.department?.name ?? "",
    issuedToUser,

    items: Array.isArray(storeIssue.items) ? storeIssue.items.map((item) => ({
      id: item.id ?? "",
      itemCode: item.item?.code ?? "",
      itemName: item.item?.name ?? "",
      unit: item.item?.unit?.name ?? item.unit ?? "",
      issuedQty: asNumber(item.issuedQty ?? item.quantity ?? 0),
    })) : [],
    metadata: record,
  };
}

export async function fetchIssues({ search = "", status = "All Statuses", page = 1, limit = 20 } = {}) {
  const query = { page, limit };
  if (search) query.search = search;
  if (status && status !== "All Statuses") {
    const statusMap = {
      Picking: "PICKING",
      Completed: "COMPLETED",
      Cancelled: "CANCELLED",
    };
    const backendStatus = statusMap[status] || status.toUpperCase();
    if (backendStatus) query.status = backendStatus;
  }

  const result = await apiRequest("/issuing", { query });

  // Handle new paginated structure vs old array structure
  const rawRecords = Array.isArray(result?.data) ? result.data : (Array.isArray(result?.data?.data) ? result.data.data : []);
  const records = rawRecords.map(normalizeIssue);

  const pagination = result?.data?.pagination || {
    page: 1, limit: 20, total: records.length, totalPages: 1
  };

  return {
    data: records,
    pagination
  };
}

export async function fetchIssueById(id) {
  const result = await apiRequest(`/issuing/${id}`);
  const issue = result?.data?.issue ?? result?.data ?? result;
  return normalizeIssue(issue);
}

export async function createIssue(payload) {
  const result = await apiRequest("/issuing", {
    method: "POST",
    body: payload,
  });
  const issue = result?.data?.issue ?? result?.data ?? result;
  return normalizeIssue(issue);
}

export async function completeIssue(id) {
  const result = await apiRequest(`/issuing/${id}/complete`, { method: "POST" });
  const issue = result?.data?.issue ?? result?.data ?? result;
  return normalizeIssue(issue);
}

export async function fetchIssueVouchers({ page = 1, limit = 20 } = {}) {
  const result = await apiRequest("/issue-vouchers", { query: { page, limit } });
  const records = Array.isArray(result?.data) ? result.data : Array.isArray(result?.data?.vouchers) ? result.data.vouchers : [];

  const pagination = result?.data?.pagination || {
    page: 1, limit: 20, total: records.length, totalPages: 1
  };

  return {
    data: records.map(normalizeIssueVoucher),
    pagination,
  };
}

export async function fetchIssueVoucherById(id) {
  const result = await apiRequest(`/issue-vouchers/${id}`);
  const voucher = result?.data?.voucher ?? result?.data ?? result;
  return normalizeIssueVoucher(voucher);
}

export async function createIssueVoucher(payload) {
  const result = await apiRequest("/issue-vouchers", {
    method: "POST",
    body: payload,
  });
  const voucher = result?.data?.voucher ?? result?.data ?? result;
  return normalizeIssueVoucher(voucher);
}

export function mapIssueFormPayload(form, items) {
  return {
    requisitionId: form.requisitionId,
    storeId: form.storeId,
    remarks: form.remarks || null,
    items: items.map((item) => ({
      requisitionItemId: item.requisitionItemId,
      itemId: item.itemId,
      locationId: item.locationId,
      issuedQty: Number(item.issuedQty ?? item.issueQuantity ?? item.quantity ?? 0),
      remarks: item.remarks || null,
    })),
  };
}
