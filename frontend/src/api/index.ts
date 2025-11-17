const API_BASE_URL = "https://lekhsewa.onrender.com/api";

async function handleResponse(response: Response) {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || response.statusText || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
    }
    return response.json();
}

export async function postCanvasImage(blob: Blob) {
    const formData = new FormData();
    formData.append('file', blob, 'canvas-image.png');
    const response = await fetch(`${API_BASE_URL}/sendcanvasimage`, {
        method: 'POST',
        body: formData,
    });
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
        method: 'POST',
        headers: {
            'Authorization' : `Bearer ${token}`,
}
    });
    if (!response.ok) {
        throw new Error('Failed to upgrade user plan');
    }
    return {success: true};
}