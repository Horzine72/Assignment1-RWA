//DOESNT WORK DOESNT WORK

import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';

const sessionOptions = {
  password: process.env.SESSION_PASSWORD,
  cookieName: 'app_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function middleware(req) {
  const res = NextResponse.next();
  const session = await getIronSession(req, res, sessionOptions);

  const url = req.nextUrl.clone();

  if (!session.userId && url.pathname === '/dashboard') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ['/dashboard'],
};
