import { apiRequest } from "./client";

function unwrapList(response, key) {
  const data = response?.data ?? response ?? {};
  if (Array.isArray(data[key])) return data[key];
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.rows)) return data.rows;
  return [];
}

export async function fetchPurchaseOrders({ search = "", status = "All", page = 1, limit = 100 } = {}) {
  const query = { page, limit };

  if (search) {
    query.search = search;
  }

  if (status && status !== "All") {
    query.status = status;
  }

  const result = await apiRequest("/procurement/purchase-orders", { query });
  return unwrapList(result, "purchaseOrders").map((order) => ({
    ...order,
    supplier: order.supplier?.name ?? order.supplier ?? "Unknown supplier",
    requisition: order.requisition?.requestNumber ?? order.requisition ?? order.requisitionId ?? "N/A",
    number: order.number ?? order.orderNumber ?? "N/A",
    amount: order.amount ?? order.totalAmount ?? 0,
    date: order.date ?? order.orderDate ?? "",
  }));
}

export async function fetchDeliveries({ search = "", status = "All", page = 1, limit = 100 } = {}) {
  const query = { page, limit };

  if (search) {
    query.search = search;
  }

  if (status && status !== "All") {
    query.status = status;
  }

  const result = await apiRequest("/procurement/deliveries", { query });
  const rows = unwrapList(result, "deliveries").map((delivery) => ({
    ...delivery,
    id: delivery.id ?? delivery.deliveryNumber ?? "",
    po: delivery.po ?? delivery.purchaseOrder?.orderNumber ?? delivery.purchaseOrderId ?? "",
    supplier: delivery.supplier?.name ?? delivery.supplier ?? "Unknown supplier",
    expected: delivery.expected ?? delivery.expectedDate ?? "",
    actual: delivery.actual ?? delivery.actualDate ?? "",
  }));
  
  const pagination = result?.data?.pagination || { page, limit, total: rows.length, totalPages: 1 };
  
  return { data: rows, pagination };
}

export async function createPurchaseOrder(payload) {
  const { requisitionId, ...body } = payload;
  if (!body.expectedDeliveryDate) delete body.expectedDeliveryDate;

  const result = await apiRequest(`/procurement/requisitions/${requisitionId}/purchase-order`, {
    method: "POST",
    body: body,
  });

  return result?.data?.purchaseOrder ?? result?.data ?? result;
}

export async function updatePurchaseOrder(id, payload) {
  const { requisitionId, ...body } = payload;
  if (!body.expectedDeliveryDate) delete body.expectedDeliveryDate;

  const result = await apiRequest(`/procurement/purchase-orders/${id}`, {
    method: "PATCH",
    body: body,
  });

  return result?.data?.purchaseOrder ?? result?.data ?? result;
}

export async function createDelivery(payload) {
  const result = await apiRequest("/procurement/deliveries", {
    method: "POST",
    body: payload,
  });

  return result?.data?.delivery ?? result?.data ?? result;
}

export async function updateDelivery(id, payload) {
  const result = await apiRequest(`/procurement/deliveries/${id}`, {
    method: "PATCH",
    body: payload,
  });

  return result?.data?.delivery ?? result?.data ?? result;
}

export async function fetchProcurementOverview() {
  const result = await apiRequest("/procurement/overview");
  return result?.data ?? result;
}

export async function generateProcurementReport(payload) {
  const result = await apiRequest("/procurement/reports", {
    method: "POST",
    body: payload,
  });
  return result?.data?.report ?? result?.data ?? result;
}

export async function fetchProcurementReportFilters() {
  const result = await apiRequest("/procurement/reports/filters");
  return result?.data ?? { departments: [], suppliers: [] };
}

export async function fetchPurchaseRequisitions({ search = "", status = "All", page = 1, limit = 100 } = {}) {
  const query = { page, limit };

  if (search) {
    query.search = search;
  }

  if (status && status !== "All") {
    query.status = status;
  }

  const result = await apiRequest("/procurement/requisitions", { query });
  return unwrapList(result, "requisitions").map((req) => ({
    ...req,
    department: req.department?.name ?? req.department ?? "Unknown department",
  }));
}

export async function fetchPurchaseRequisition(id) {
  const result = await apiRequest(`/procurement/requisitions/${id}`);
  return result?.data ?? result;
}
