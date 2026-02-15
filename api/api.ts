const BASE_URL = "http://localhost:3000";

export async function createSession() {
  const res = await fetch(`${BASE_URL}/sessions`, {
    method: "POST",
  });

  return res.json();
}

export async function updateSession(id: number, data: any) {
  const res = await fetch(`${BASE_URL}/sessions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getStats() {
  const res = await fetch(`${BASE_URL}/stats`);
  return res.json();
}
