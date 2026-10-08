import { apiRequest } from "./client";

function getShelfStatus(expiryDate) {
  if (!expiryDate) return { label: "N/A", days: null };
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) return { label: "N/A", days: null };

  expiry.setHours(0, 0, 0, 0);
  
  const difference = Math.round((expiry - today) / (1000 * 60 * 60 * 24));
  
  if (difference < 0) {
    return { label: "Expired", days: difference };
  }
  if (difference <= 30) {
    return { label: "Expiring Soon", days: difference };
  }
  return { label: "Safe", days: difference };
}

export function normalizeShelfLifeBatch(record = {}) {
  const item = record.item || {};
  const location = record.location || {};
  const shelfStatus = getShelfStatus(record.expiryDate);

  return {
    id: record.id || "",
    itemId: item.id || "",
    itemName: item.name || "-",
    itemCode: item.code || "-",
    batchNumber: record.batchNumber || "-",
    expiryDate: record.expiryDate ? new Date(record.expiryDate).toLocaleDateString() : "-",
    quantity: Number(record.quantity || 0),
    locationLabel: [location.code, location.section, location.bin].filter(Boolean).join(" / ") || "-",
    shelfStatus
  };
}

export async function fetchShelfLifeBatches(status) {
  const query = status && status !== "All" ? { status } : {};
  const result = await apiRequest("/shelf-life", { query });
  return (result?.data?.batches || []).map(normalizeShelfLifeBatch);
}

export async function fetchExpiringBatches() {
  const result = await apiRequest("/shelf-life/expiring");
  return (result?.data?.batches || []).map(normalizeShelfLifeBatch);
}

export async function fetchExpiredBatches() {
  const result = await apiRequest("/shelf-life/expired");
  return (result?.data?.batches || []).map(normalizeShelfLifeBatch);
}

export async function fetchShelfLifeBatchById(id) {
  const result = await apiRequest(`/shelf-life/${id}`);
  return result?.data?.batch ? normalizeShelfLifeBatch(result.data.batch) : null;
}

export async function createShelfLifeBatch(data) {
  const result = await apiRequest("/shelf-life", {
    method: "POST",
    body: data
  });
  return result?.data?.batch ? normalizeShelfLifeBatch(result.data.batch) : null;
}
