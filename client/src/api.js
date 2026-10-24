const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export function getToken() { return localStorage.getItem('imovies_token'); }
export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Something went wrong.');
  return data;
}
export function posterFallback(title = 'IMovies') {
  return `https://placehold.co/600x900/171923/f3f3f3?text=${encodeURIComponent(title)}`;
}
