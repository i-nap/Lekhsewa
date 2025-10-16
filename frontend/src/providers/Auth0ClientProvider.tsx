'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode, useMemo } from 'react';

export default function Auth0ClientProvider({ children }: { children: ReactNode }) {
    const redirectUri = useMemo(() => {
        if (typeof window !== 'undefined') return window.location.origin;
        return process.env.NEXT_PUBLIC_BASE_URL || '';
    }, []);

    return (
        <Auth0Provider
            domain={process.env.NEXT_PUBLIC_AUTH0_DOMAIN || ''}
            clientId={process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || ''}
            authorizationParams={{
                redirect_uri: redirectUri,
            }}
        >
            {children}
        </Auth0Provider>

    );
}
