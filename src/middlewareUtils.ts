import { NextRequest, NextResponse } from 'next/server';

export const SECURE_TOKEN_PREFIX = '__Secure-';

export const AUTH_TOKEN_SUFFIX = 'next-auth.session-token';

export interface TokenExpiryOptions {
  securePrefix?: string;
  tokenSuffix?: string;
}

const getAuthCookie = (request: NextRequest, tokenSuffix: string) => {
  return request.cookies.getAll().find((cookie) => cookie.name.endsWith(tokenSuffix));
};
export const setAuthCookieExpiryToSession = (request: NextRequest, options?: TokenExpiryOptions): NextResponse => {
  const { securePrefix = SECURE_TOKEN_PREFIX, tokenSuffix = AUTH_TOKEN_SUFFIX } = options || {};

  const path = request.nextUrl.pathname;

  if (path.startsWith('/_next') // exclude Next.js internals
      || path.startsWith('/api') //  exclude all API routes
      || path.startsWith('/static')// exclude static files
  ) {
    return NextResponse.next();
  }

  const authCookie = getAuthCookie(request, tokenSuffix);
  if (authCookie?.value) {
    const response = NextResponse.next();
    response.cookies.set({
      name: authCookie.name,
      value: authCookie.value,
      path: '/',
      sameSite: 'lax',
      expires: undefined,
      maxAge: undefined,
      httpOnly: true,
      secure: authCookie.name.startsWith(securePrefix),
    });
    return response;
  }

  return NextResponse.next();
};
