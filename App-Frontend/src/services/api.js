const API_BASE_URL = 'http://localhost:8081/api/v1/users';

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Failed to authenticate');
  }

  return data;
}

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    if (data.fieldErrors) {
      const firstError = Object.values(data.fieldErrors)[0];
      throw new Error(firstError);
    }
    throw new Error(data.message || data.error || 'Failed to create account');
  }

  return data;
}
