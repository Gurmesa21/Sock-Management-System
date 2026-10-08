import { apiRequest } from "./client";

const RESOURCE_NAMES = {
  departments: "department",
  units: "unit",
  stores: "store",
  warehouses: "warehouse",
  shelves: "shelf",
  locations: "location",
  categories: "category",
  items: "item",
  suppliers: "supplier",
};

export function unwrapResourceResponse(resource, payload) {
  const data = payload?.data ?? payload;
  const singular = RESOURCE_NAMES[resource] ?? resource.replace(/s$/, "");

  if (!data) {
    return null;
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (data[singular]) {
    return data[singular];
  }

  if (resource.endsWith("s") && data[resource.slice(0, -1)]) {
    return data[resource.slice(0, -1)];
  }

  return data;
}

export function unwrapResourceList(resource, payload) {
  const data = payload?.data ?? payload;
  if (!data) {
    return [];
  }

  const records = data[resource] ?? data[resource.replace(/s$/, "")];
  return Array.isArray(records) ? records : [];
}

export async function fetchResource(resource, { search = "", status = "All", page = 1, limit = 100 } = {}) {
  const query = { page, limit };

  if (search) {
    query.search = search;
  }

  if (status && status !== "All") {
    query.status = status;
  }

  const result = await apiRequest(`/master-data/${resource}`, { query });
  return unwrapResourceList(resource, result);
}

export async function fetchPaginatedResource(resource, { search = "", status = "All", page = 1, limit = 10 } = {}) {
  const query = { page, limit };
  if (search) query.search = search;
  if (status && status !== "All") query.status = status;

  const result = await apiRequest(`/master-data/${resource}`, { query });
  
  const payload = result?.data ?? result;
  if (!payload) return { records: [], pagination: { page, limit, total: 0, totalPages: 0 } };

  const records = payload[resource] ?? payload[resource.replace(/s$/, "")];
  return {
    records: Array.isArray(records) ? records : [],
    pagination: payload.pagination || { page, limit, total: 0, totalPages: 0 }
  };
}

export async function createResource(resource, body) {
  const result = await apiRequest(`/master-data/${resource}`, {
    method: "POST",
    body,
  });

  return unwrapResourceResponse(resource, result);
}

export async function updateResource(resource, id, body) {
  const result = await apiRequest(`/master-data/${resource}/${id}`, {
    method: "PATCH",
    body,
  });

  return unwrapResourceResponse(resource, result);
}

export async function deleteResource(resource, id) {
  const result = await apiRequest(`/master-data/${resource}/${id}`, {
    method: "DELETE",
  });

  return Boolean(result?.data?.deleted ?? result?.deleted ?? true);
}

export async function toggleResourceStatus(resource, id, status) {
  const result = await apiRequest(`/master-data/${resource}/${id}/status`, {
    method: "PATCH",
    body: { status },
  });

  return unwrapResourceResponse(resource, result);
}

export async function getResourceById(resource, id) {
  const result = await apiRequest(`/master-data/${resource}/${id}`);
  return unwrapResourceResponse(resource, result);
}
