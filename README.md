# next-auth-cookie-fix

A library to monkey-patch NextAuth to use Session cookies via Next.js middleware.

This allows to force the `session-token` cookies to only have `Session` level expiry.
This is needed because it's not provided by NextAuth by default: https://github.com/nextauthjs/next-auth/pull/4693

### How to use:

1. add the library `npm install next-auth-cookie-fix`
2. add the following middleware to your app:
   ```
    import { setAuthCookieExpiryToSession } from 'next-auth-cookie-fix';

    export const middleware = setAuthCookieExpiryToSession;

    // this needs to only match the document queries
    export const config = { matcher: ['/'] };
   ```
