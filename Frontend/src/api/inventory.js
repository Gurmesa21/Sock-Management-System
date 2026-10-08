import { apiRequest } from "./client";

const STOCK_TRANSACTION_LABELS = {
  INBOUND: "Receipt",
  OUTBOUND: "Issue",
  TRANSFER: "Transfer",
  RETURN: "Return",
  ADJUSTMENT: "Adjustment",
};

const TRANSACTION_DIRECTION_LABELS = {
  INBOUND: "Inbound",
  OUTBOUND: "Outbound",
  TRANSFER: "Transfer",
  RETURN: "Inbound",
  ADJUSTMENT: "Adjustment",
};

function asNumber(value) {
  const num = Number(value ?? 0);
  return Number.isFinite(num) ? num : 0;
}

function toDisplayDate(value) {
  if (!value) return "-";

  try {
    return new Date(value).toISOString().split("T")[0];
  } catch {
    return "-";
  }
}

export function normalizeInventoryBalance(record = {}) {
  const item = record.item || {};
  const location = record.location || {};
  const category = item.category || {};
  const store = location.store || {};
  
  const quantity = asNumber(record.quantity);
  const minimum = asNumber(item.minimum);
  const reorder = asNumber(item.reorder);
  const maximum = asNumber(item.maximum);
  
  let status = "Normal";
  if (item.status === "Obsolete" || record.hasObsolete) {
    status = "Obsolete";
  } else if (record.hasDamaged) {
    status = "Damaged";
  } else if (minimum > 0 && quantity <= minimum) {
    status = "Low Stock";
  } else if (reorder > 0 && quantity <= reorder) {
    status = "Reorder";
  } else if (maximum > 0 && quantity > maximum) {
    status = "Overstock";
  }

  return {
    id: record.id || "",
    itemId: item.id || "",
    itemCode: item.code || "",
    itemName: item.name || "",
    category: category.name || "-",
    store: store.name || "-",
    locationId: location.id || "",
    locationCode: location.code || "",
    locationLabel: [store.name, location.code, location.section, location.bin].filter(Boolean).join(" / ") || "-",
    quantity,
    minimum,
    reorder,
    maximum,
    status
  };
}

export function normalizeStockCard(record = {}) {
  const item = record.item || {};
  const location = record.location || {};
  const transaction = record.transaction || {};

  return {
    id: record.id || "",
    itemId: item.id || "",
    itemCode: item.code || "",
    itemName: item.name || "",
    date: toDisplayDate(record.transactionDate),
    reference: transaction.transactionNumber || transaction.referenceType || "-",
    transactionType: STOCK_TRANSACTION_LABELS[record.transactionType] || record.transactionType || STOCK_TRANSACTION_LABELS[transaction.type] || transaction.type || "-",
    quantityIn: asNumber(record.quantityIn),
    quantityOut: asNumber(record.quantityOut),
    runningBalance: asNumber(record.balance),
    locationLabel: [location.code, location.section, location.bin].filter(Boolean).join(" / ") || "-",
  };
}

export function normalizeBinCard(record = {}) {
  const item = record.item || {};
  const location = record.location || {};
  const transaction = record.transaction || {};

  return {
    id: record.id || "",
    itemId: item.id || "",
    itemCode: item.code || "",
    itemName: item.name || "",
    date: toDisplayDate(record.transactionDate),
    locationLabel: [location.code, location.section, location.bin].filter(Boolean).join(" / ") || "-",
    inbound: asNumber(record.quantityIn),
    outbound: asNumber(record.quantityOut),
    balance: asNumber(record.balance),
    supportingDocument: transaction.transactionNumber || transaction.referenceType || "-",
  };
}

export function normalizeTransaction(record = {}) {
  const item = record.item || {};
  const location = record.location || {};

  return {
    id: record.id || "",
    transactionNumber: record.transactionNumber || "-",
    date: toDisplayDate(record.createdAt),
    type: STOCK_TRANSACTION_LABELS[record.type] || record.type || "-",
    document: record.transactionNumber || record.referenceType || "-",
    itemCode: item.code || "",
    itemName: item.name || "",
    direction: TRANSACTION_DIRECTION_LABELS[record.type] || record.type || "-",
    quantity: asNumber(record.quantity),
    store: location.store?.name || "-",
    user: record.performedBy?.fullName || record.performedBy?.username || "-",
    reference: record.reason || "-",
  };
}

export async function fetchInventoryOverview({ page = 1, limit = 100 } = {}) {
  const result = await apiRequest("/inventory", { query: { page, limit } });
  const records = Array.isArray(result?.data) ? result.data : [];
  return records.map(normalizeInventoryBalance);
}

export async function fetchStockCards({ page = 1, limit = 100, itemId, locationId } = {}) {
  const result = await apiRequest("/stock-cards", {
    query: { page, limit, itemId, locationId },
  });

  const records = Array.isArray(result?.data) ? result.data : [];
  return records.map(normalizeStockCard);
}

export async function fetchBinCards({ page = 1, limit = 100, itemId, locationId } = {}) {
  const result = await apiRequest("/bin-cards", {
    query: { page, limit, itemId, locationId },
  });

  const records = Array.isArray(result?.data) ? result.data : [];
  return records.map(normalizeBinCard);
}

export async function fetchTransactions({ page = 1, limit = 50, type, itemId, locationId, search } = {}) {
  const query = { page, limit };

  if (type && type !== "All") query.type = type;
  if (search) query.search = search;
  if (itemId) query.itemId = itemId;
  if (locationId) query.locationId = locationId;

  const result = await apiRequest("/transactions", { query });
  const records = Array.isArray(result?.data) ? result.data : [];
  return records.map(normalizeTransaction);
}

export async function fetchTransactionById(id) {
  const result = await apiRequest(`/transactions/${id}`);
  return normalizeTransaction(result?.data);
}

export async function getPaginatedInventory({ page = 1, limit = 10, search } = {}) {
  const query = { page, limit };
  if (search) query.search = search;
  const result = await apiRequest("/inventory", { query });
  
  return {
    data: (Array.isArray(result?.data) ? result.data : []).map(normalizeInventoryBalance),
    pagination: result?.pagination || { page: 1, totalPages: 1 },
    summary: result?.summary || { totalItems: 0, availableStock: 0, lowStockItems: 0 }
  };
}

export async function getPaginatedTransactions({ page = 1, limit = 10, type, search } = {}) {
  const query = { page, limit };
  if (type && type !== "All") query.type = type;
  if (search) query.search = search;
  const result = await apiRequest("/transactions", { query });
  
  return {
    data: (Array.isArray(result?.data) ? result.data : []).map(normalizeTransaction),
    pagination: result?.pagination || { page: 1, totalPages: 1 }
  };
}
