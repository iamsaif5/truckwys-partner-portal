const BASE_URL = 'http://localhost:3700';

function getToken(): string | null {
  return localStorage.getItem('jwt');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Token ${token}` } : {};
}

export async function fetchData(path: string): Promise<any> {
  const url = `${BASE_URL}/${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
  });

  if (res.status === 401) {
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

export async function login(email: string, password: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/v1/partner/auth/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid credentials');
  }

  const data = await res.json();
  const token = data.token || data.access || data.jwt;
  if (!token) throw new Error('No token in response');
  return token;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
