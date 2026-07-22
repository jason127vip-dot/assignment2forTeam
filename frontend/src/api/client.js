const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest(path, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data.detail ||
      data.non_field_errors?.join(" ") ||
      Object.values(data).flat().join(" ") ||
      "Request failed.";
    throw new Error(message);
  }

  return data;
}
