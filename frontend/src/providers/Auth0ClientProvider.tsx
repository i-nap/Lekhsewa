'use client';

import { Auth0Provider } from '@auth0/auth0-react';
import { ReactNode, useMemo } from 'react';
import { useRouter } from 'next/navigation';

export default function Auth0ClientProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const redirectUri = useMemo(() => {
    if (typeof window !== 'undefined') return window.location.origin;
    // fallback for build-time; should match your site origin exactly
    return process.env.NEXT_PUBLIC_BASE_URL || '';
  }, []);

  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!;
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!;
  // only set audience if you actually configured an API in Auth0
  const audience = process.env.NEXT_PUBLIC_AUTH0_AUDIENCE; // optional

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        ...(audience ? { audience } : {}),
        // If you want refresh tokens, you need offline_access in some setups
        // scope: 'openid profile email offline_access'
      }}
      // Kill the “reload hangs” problem:
      useRefreshTokens
      cacheLocation="localstorage"
      // Stop landing on callback limbo after login:
      onRedirectCallback={(appState) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const target = (appState && (appState as any).returnTo) || '/';
        router.replace(target);
      }}
    >
      {children}
    </Auth0Provider>
  );
}
