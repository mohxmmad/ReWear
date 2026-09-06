const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

let memoryCsrf = null;
try { memoryCsrf = localStorage.getItem('csrfToken'); } catch {}

function getCsrfToken() {
  if (memoryCsrf) return memoryCsrf;
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const t = cookie.trim();
    if (t.startsWith(name + '=')) return decodeURIComponent(t.substring(name.length + 1));
  }
  return null;
}

async function ensureCsrf() {
  // Try to get token from backend JSON (works cross-site where cookie is not accessible via document.cookie)
  if (getCsrfToken()) return;
  try {
    const res = await fetch(`${API_BASE}/api/accounts/csrf/`, { credentials: 'include' });
    const data = await res.json().catch(()=>null);
    if (data?.csrfToken) {
      memoryCsrf = data.csrfToken;
      try { localStorage.setItem('csrfToken', memoryCsrf); } catch {}
    }
  } catch {}
}

export async function apiFetch(path, { method = 'GET', body, headers = {}, isFormData = false } = {}) {
  // Only need CSRF for mutating methods, but ensure it lazily
  if (method !== 'GET' && method !== 'HEAD') {
    await ensureCsrf();
  }
  const csrf = getCsrfToken();
  const opts = {
    method,
    credentials: 'include',
    headers: { ...headers },
  };
  if (csrf && method !== 'GET' && method !== 'HEAD') opts.headers['X-CSRFToken'] = csrf;
  if (body && !isFormData) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  } else if (body && isFormData) {
    opts.body = body;
  }
  const res = await fetch(`${API_BASE}${path}`, opts);
  let data = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    try { data = await res.text(); } catch { data = null; }
  }
  // If backend returned new csrf token, cache it
  if (data?.csrfToken) {
    memoryCsrf = data.csrfToken;
    try { localStorage.setItem('csrfToken', memoryCsrf); } catch {}
  }
  return { res, data, ok: res.ok, status: res.status };
}

export { API_BASE, getCsrfToken };
