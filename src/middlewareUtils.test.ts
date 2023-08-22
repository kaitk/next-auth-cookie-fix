import { NextRequest } from 'next/server';
import { expect, test, describe } from 'vitest';
import { setAuthCookieExpiryToSession } from './middlewareUtils.ts';

const DUMMY_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

describe('setAuthCookieExpiryToSession', () => {

  test('Works with localhost', () => {
    const request = new NextRequest(new Request('https://localhost:4200/'), {});
    const cookieName = 'next-auth.session-token';

    request.cookies.set(
        cookieName,
        DUMMY_TOKEN,
    );
    const response = setAuthCookieExpiryToSession(request);
    expect(response?.cookies.get(cookieName)).toEqual({
      name: cookieName,
      value: DUMMY_TOKEN,
      httpOnly: true,
      expires: undefined,
      maxAge: undefined,
      path: '/',
      sameSite: 'lax',
      secure: false,
    });

  });


  test('Works with production site', () => {
    const request = new NextRequest(new Request('https://www.mysite.dev/'), {});
    const cookieName = '__Secure-next-auth.session-token';
    request.cookies.set(cookieName, DUMMY_TOKEN);

    const response = setAuthCookieExpiryToSession(request);
    expect(response?.cookies.get(cookieName)).toEqual({
      name: cookieName,
      value: DUMMY_TOKEN,
      httpOnly: true,
      expires: undefined,
      maxAge: undefined,
      path: '/',
      sameSite: 'lax',
      secure: true,
    });
  });

});
