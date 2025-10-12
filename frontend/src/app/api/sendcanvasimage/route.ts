import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('file'); // Matches the key "file"

    if (!imageFile) {
      return NextResponse.json({ error: 'Missing file data' }, { status: 400 });
    }

    const springBootBackendUrl = 'http://localhost:8080/sendcanvasimage';

    const backendFormData = new FormData();
    backendFormData.append('file', imageFile);

    const response = await fetch(springBootBackendUrl, {
      method: 'POST',
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error(`Backend failed with status ${response.status}`);
    }

    const backendResponse = await response.json();
    return NextResponse.json({ message: 'Forwarded successfully!', data: backendResponse });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}