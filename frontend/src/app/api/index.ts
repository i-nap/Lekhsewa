// const API_BASE_URL = "https://lekhsewa.onrender.com/api";
const API_BASE_URL = "http://localhost:8080/api";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error ||
      response.statusText ||
      `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response.json();
}

export async function getUserPlan(sub: string) {
  const response = await fetch(
    `${API_BASE_URL}/getuserplan?sub=${encodeURIComponent(sub)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to change plan");
  }

  const text = await response.text();
  return text;
}

export async function changePlanToPro(sub: string) {
  const response = await fetch(
    `${API_BASE_URL}/changeplantopro?sub=${encodeURIComponent(sub)}`,
    { method: "GET" }
  );

  if (!response.ok) {
    throw new Error("Failed to change plan");
  }

  const text = await response.text();
  return text;
}

export async function getUserQuota(sub: string) {
  const response = await fetch(
    `${API_BASE_URL}/getuserquota?sub=${encodeURIComponent(sub)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user quota");
  }

  const text = await response.text();
  return parseInt(text, 10) || 0;
}

export async function postCanvasImage(blob: Blob, sub: string) {
  const formData = new FormData();
  formData.append("file", blob, "canvas-image.png");
  const response = await fetch(
    `${API_BASE_URL}/sendcanvasimage?sub=${encodeURIComponent(sub)}`,
    {
      method: "POST",
      body: formData,
    }
  );
  return handleResponse(response);
}

export async function getFormSuggestions(query: string) {
  const response = await fetch(`${API_BASE_URL}/suggest?q=${query}&limit=8`);
  return handleResponse(response);
}

export async function getFormById(id: string | number) {
  const response = await fetch(`${API_BASE_URL}/getformdata/${id}`);
  return handleResponse(response);
}

export async function upgradeUserPlan(token: string) {
  const response = await fetch(`${API_BASE_URL}/user/upgrade-plan`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to upgrade user plan");
  }
  return { success: true };
}

export async function sendContactMessage(
  name: string,
  email: string,
  message: string
) {
  const response = await fetch(`${API_BASE_URL}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName: name,
      email,
      message,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.error ||
      response.statusText ||
      `HTTP error! status: ${response.status}`;
    throw new Error(errorMessage);
  }
  return response;
}
