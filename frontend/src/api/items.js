const API_BASE = `${import.meta.env.VITE_API_URL ?? ""}/api/item`;

async function apiRequest(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    const message =
      data?.error || data?.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  return data;
}

export async function getAllItems() {
  return apiRequest(`${API_BASE}/getall`);
}

export async function reportItem(item) {
  return apiRequest(`${API_BASE}/report`, {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function updateItem(id, updates) {
  return apiRequest(`${API_BASE}/update/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export async function deleteItem(id) {
  return apiRequest(`${API_BASE}/delete/${id}`, {
    method: "DELETE",
  });
}
