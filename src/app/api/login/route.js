import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { setCookie } from 'cookies-next';

export async function POST(req, res) {
  try {
    const { email, password } = await req.json();
    const client = await clientPromise;
    const db = client.db('app');
    const collection = db.collection('login');
    const user = await collection.findOne({ username: email, pass: password });

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
    }

    //set session cookie    DOESNT WORK
    setCookie('app_session', JSON.stringify({ userId: user._id.toString(), userRole: user.acc_type }), {
      req,
      res,
      maxAge: 60 * 60 * 24,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({ data: "true", role: user.acc_type });
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json({ data: "error", message: error.message }, { status: 500 });
  }
}
