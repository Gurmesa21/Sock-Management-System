import { api } from "./client";
import { endpoints } from "./endpoints";

/*
 * Normalize common backend response shapes.
 *
 * Supports:
 *   { data: [...] }
 *   { items: [...] }
 *   [...]
 */
function extractList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.data)) {
    return payload.data.data;
  }

  if (Array.isArray(payload?.data?.rows)) {
    return payload.data.rows;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.results)) {
    return payload.results;
  }

  if (Array.isArray(payload?.rows)) {
    return payload.rows;
  }

  return [];
}

function extractItem(payload) {
  return payload?.data ?? payload?.item ?? payload;
}

/* =========================================================
   GENERIC RESOURCE HELPERS
========================================================= */

export async function listResource(path, query = {}) {
  const response = await api.get(path, query);
  return extractList(response);
}

export async function getResource(path, id) {
  const response = await api.get(`${path}/${encodeURIComponent(id)}`);
  return extractItem(response);
}

export async function createResource(path, data) {
  const response = await api.post(path, data);
  return extractItem(response);
}

export async function updateResource(path, id, data) {
  const response = await api.patch(
    `${path}/${encodeURIComponent(id)}`,
    data
  );

  return extractItem(response);
}

export async function deleteResource(path, id) {
  return api.delete(
    `${path}/${encodeURIComponent(id)}`
  );
}

/* =========================================================
   MASTER DATA
========================================================= */

export const categoriesApi = {
  list: (query = {}) =>
    listResource("/master-data/categories", query),

  get: (id) =>
    getResource("/master-data/categories", id),

  create: (data) =>
    createResource("/master-data/categories", data),

  update: (id, data) =>
    updateResource("/master-data/categories", id, data),

  delete: (id) =>
    deleteResource("/master-data/categories", id),
};

export const suppliersApi = {
  list: (query = {}) =>
    listResource("/master-data/suppliers", query),

  get: (id) =>
    getResource("/master-data/suppliers", id),

  create: (data) =>
    createResource("/master-data/suppliers", data),

  update: (id, data) =>
    updateResource("/master-data/suppliers", id, data),

  delete: (id) =>
    deleteResource("/master-data/suppliers", id),
};

export const departmentsApi = {
  list: (query = {}) =>
    listResource("/master-data/departments", query),

  get: (id) =>
    getResource("/master-data/departments", id),

  create: (data) =>
    createResource("/master-data/departments", data),

  update: (id, data) =>
    updateResource("/master-data/departments", id, data),

  delete: (id) =>
    deleteResource("/master-data/departments", id),
};

export const storesApi = {
  list: (query = {}) =>
    listResource("/master-data/stores", query),

  get: (id) =>
    getResource("/master-data/stores", id),

  create: (data) =>
    createResource("/master-data/stores", data),

  update: (id, data) =>
    updateResource("/master-data/stores", id, data),

  delete: (id) =>
    deleteResource("/master-data/stores", id),
};

export const warehousesApi = {
  list: (query = {}) =>
    listResource("/master-data/warehouses", query),

  get: (id) =>
    getResource("/master-data/warehouses", id),

  create: (data) =>
    createResource("/master-data/warehouses", data),

  update: (id, data) =>
    updateResource("/master-data/warehouses", id, data),

  delete: (id) =>
    deleteResource("/master-data/warehouses", id),
};

export const locationsApi = {
  list: (query = {}) =>
    listResource("/master-data/locations", query),

  get: (id) =>
    getResource("/master-data/locations", id),

  create: (data) =>
    createResource("/master-data/locations", data),

  update: (id, data) =>
    updateResource("/master-data/locations", id, data),

  delete: (id) =>
    deleteResource("/master-data/locations", id),
};

/* =========================================================
   INVENTORY
========================================================= */

export const inventoryApi = {
  list: (query = {}) =>
    listResource(endpoints.inventory, query),

  getBalance: (itemId, locationId) =>
    api.get(
      `${endpoints.inventory}/${encodeURIComponent(itemId)}/${encodeURIComponent(locationId)}`
    ),
};

export const stockCardsApi = {
  list: (query = {}) =>
    listResource(endpoints.stockCards, query),

  get: (id) =>
    getResource(endpoints.stockCards, id),
};

export const binCardsApi = {
  list: (query = {}) =>
    listResource(endpoints.binCards, query),

  get: (id) =>
    getResource(endpoints.binCards, id),
};

export const transactionsApi = {
  list: (query = {}) =>
    listResource(endpoints.transactions, query),

  get: (id) =>
    getResource(endpoints.transactions, id),
};

/* =========================================================
   STOCK TRANSFERS
========================================================= */

export const stockTransfersApi = {
  list: (query = {}) =>
    listResource(endpoints.stockTransfers, query),

  get: (id) =>
    getResource(endpoints.stockTransfers, id),

  create: (data) =>
    createResource(endpoints.stockTransfers, data),

  update: (id, data) =>
    updateResource(endpoints.stockTransfers, id, data),
};

/* =========================================================
   REQUISITIONS
========================================================= */

export const requisitionsApi = {
  list: (query = {}) =>
    listResource(endpoints.requisitions, query),

  get: (id) =>
    getResource(endpoints.requisitions, id),

  create: (data) =>
    createResource(endpoints.requisitions, data),

  update: (id, data) =>
    updateResource(endpoints.requisitions, id, data),

  remove: (id) =>
    deleteResource(endpoints.requisitions, id),

  updateStatus: (id, status, remarks = "") =>
    api.patch(
      `${endpoints.requisitions}/${encodeURIComponent(id)}/status`,
      {
        status,
        remarks,
      }
    ),
};

/* =========================================================
   RETURNS
========================================================= */

export const returnsApi = {
  list: (query = {}) =>
    listResource(endpoints.returns, query),

  get: (id) =>
    getResource(endpoints.returns, id),

  create: (data) =>
    createResource(endpoints.returns, data),

  update: (id, data) =>
    updateResource(endpoints.returns, id, data),

  remove: (id) =>
    deleteResource(endpoints.returns, id),

  updateStatus: (id, status, remarks = "") =>
    api.patch(
      `${endpoints.returns}/${encodeURIComponent(id)}/status`,
      {
        status,
        remarks,
      }
    ),
};

/* =========================================================
   ISSUING
========================================================= */

export const issuingApi = {
  list: (query = {}) =>
    listResource(endpoints.issuing, query),

  get: (id) =>
    getResource(endpoints.issuing, id),

  create: (data) =>
    createResource(endpoints.issuing, data),

  update: (id, data) =>
    updateResource(endpoints.issuing, id, data),
};

export const issueVouchersApi = {
  list: (query = {}) =>
    listResource(endpoints.issueVouchers, query),

  get: (id) =>
    getResource(endpoints.issueVouchers, id),

  create: (data) =>
    createResource(endpoints.issueVouchers, data),

  update: (id, data) =>
    updateResource(endpoints.issueVouchers, id, data),

  remove: (id) =>
    deleteResource(endpoints.issueVouchers, id),
};

/* =========================================================
   GATE PASSES
========================================================= */

export const gatePassesApi = {
  list: (query = {}) =>
    listResource(endpoints.gatePasses, query),

  get: (id) =>
    getResource(endpoints.gatePasses, id),

  create: (data) =>
    createResource(endpoints.gatePasses, data),

  update: (id, data) =>
    updateResource(endpoints.gatePasses, id, data),
};

/* =========================================================
   STOCK TAKING
========================================================= */

export const stockTakingApi = {
  list: (query = {}) =>
    listResource(endpoints.stockTaking, query),

  get: (id) =>
    getResource(endpoints.stockTaking, id),

  create: (data) =>
    createResource(endpoints.stockTaking, data),

  update: (id, data) =>
    updateResource(endpoints.stockTaking, id, data),
};

/* =========================================================
   ADJUSTMENTS
========================================================= */

export const adjustmentsApi = {
  list: (query = {}) =>
    listResource(endpoints.adjustments, query),

  get: (id) =>
    getResource(endpoints.adjustments, id),

  create: (data) =>
    createResource(endpoints.adjustments, data),

  update: (id, data) =>
    updateResource(endpoints.adjustments, id, data),

  approve: (id, data = {}) =>
    api.post(
      `${endpoints.adjustments}/${encodeURIComponent(id)}/approve`,
      data
    ),

  reject: (id, data = {}) =>
    api.post(
      `${endpoints.adjustments}/${encodeURIComponent(id)}/reject`,
      data
    ),
};

/* =========================================================
   SHELF LIFE
========================================================= */

export const shelfLifeApi = {
  list: (query = {}) =>
    listResource(endpoints.shelfLife, query),

  get: (id) =>
    getResource(endpoints.shelfLife, id),

  create: (data) =>
    createResource(endpoints.shelfLife, data),

  update: (id, data) =>
    updateResource(endpoints.shelfLife, id, data),

  remove: (id) =>
    deleteResource(endpoints.shelfLife, id),
};

/* =========================================================
   DISPOSAL
========================================================= */

export const disposalApi = {
  list: (query = {}) =>
    listResource(endpoints.disposal, query),

  get: (id) =>
    getResource(endpoints.disposal, id),

  create: (data) =>
    createResource(endpoints.disposal, data),

  update: (id, data) =>
    updateResource(endpoints.disposal, id, data),

  approve: (id, data = {}) =>
    api.post(
      `${endpoints.disposal}/${encodeURIComponent(id)}/approve`,
      data
    ),

  reject: (id, data = {}) =>
    api.post(
      `${endpoints.disposal}/${encodeURIComponent(id)}/reject`,
      data
    ),
};

/* =========================================================
   REPORTING
========================================================= */

export const reportsApi = {
  inventory: (query = {}) =>
    listResource(endpoints.reports.inventory, query),

  movements: (query = {}) =>
    listResource(endpoints.reports.movements, query),

  receiving: (query = {}) =>
    listResource(endpoints.reports.receiving, query),

  issues: (query = {}) =>
    listResource(endpoints.reports.issues, query),

  procurement: (query = {}) =>
    listResource(endpoints.reports.procurement, query),

  stockTaking: (query = {}) =>
    listResource(endpoints.reports.stockTaking, query),

  disposals: (query = {}) =>
    listResource(endpoints.reports.disposals, query),
};

/* =========================================================
   FINANCE / VALUATION
========================================================= */

export const valuationApi = {
  list: (query = {}) =>
    listResource(endpoints.valuation, query),
};

export const reconciliationApi = {
  list: (query = {}) =>
    listResource(endpoints.reconciliation, query),

  reconcile: (data) =>
    api.post(
      `${endpoints.reconciliation}/reconcile`,
      data
    ),
};

/* =========================================================
   AUDIT
========================================================= */

export const auditApi = {
  list: (query = {}) =>
    listResource(endpoints.audit, query),

  get: (id) =>
    getResource(endpoints.audit, id),
};

/* =========================================================
   NOTIFICATIONS
========================================================= */

export const notificationsApi = {
  list: (query = {}) =>
    listResource(endpoints.notifications, query),

  get: (id) =>
    getResource(endpoints.notifications, id),

  markRead: (id) =>
    api.patch(
      `${endpoints.notifications}/${encodeURIComponent(id)}/read`
    ),

  markAllRead: () =>
    api.patch(
      `${endpoints.notifications}/read-all`
    ),
};