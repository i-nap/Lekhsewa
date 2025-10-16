import { NextResponse } from 'next/server';
import { auth0 } from '../../../../lib/auth0';

export const GET = async function shows() {
  try {
    const session = await auth0.getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const res = new NextResponse();
    const { token: accessToken } = await auth0.getAccessToken();
    const apiPort = process.env.API_PORT || 3001;
    const response = await fetch(`http://localhost:${apiPort}/api/shows`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    const shows = await response.json();

    return NextResponse.json(shows, res);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    const errorStatus = error && typeof error === 'object' && 'status' in error 
      ? (error as { status?: number }).status || 500 
      : 500;
    return NextResponse.json({ error: errorMessage }, { status: errorStatus });
  }
};
