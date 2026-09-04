const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getCsrfToken() {
  const name = 'csrftoken';
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const t = cookie.trim();
    if (t.startsWith(name + '=')) return decodeURIComponent(t.substring(name.length + 1));
  }
  return null;
}

async function ensureCsrf() {
  if (!getCsrfToken()) {
    try {
      await fetch(`${API_BASE}/api/accounts/csrf/`, { credentials: 'include' });
    } catch {}
  }
}

export async function apiFetch(path, { method = 'GET', body, headers = {}, isFormData = false } = {}) {
  await ensureCsrf();
  const csrf = getCsrfToken();
  const opts = {
    method,
    credentials: 'include',
    headers: { ...headers },
  };
  if (csrf) opts.headers['X-CSRFToken'] = csrf;
  if (body && !isFormData) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  } else if (body && isFormData) {
    opts.body = body;
    // don't set Content-Type for FormData
  }
  const res = await fetch(`${API_BASE}${path}`, opts);
  let data = null;
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    try { data = await res.json(); } catch { data = null; }
  } else {
    try { data = await res.text(); } catch { data = null; }
  }
  return { res, data, ok: res.ok, status: res.status };
}

export { API_BASE, getCsrfToken };
