import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function POST(req) {
  try {
    const { pname, quantity } = await req.json();

    const cookieHeaders = await cookies();
    const session = await getIronSession(cookieHeaders, {
      password: process.env.SESSION_PASSWORD,
      cookieName: 'app',
    });

    const userId = session.userId;
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    console.log("Product name:", pname, "User ID:", userId);

    const client = await clientPromise;
    const db = client.db('app'); // Database name
    const collection = db.collection('shopping_cart'); // Collection name

    let cart = await collection.findOne({ userId });
    if (!cart) {
      cart = { userId, items: [] };
    }

    const itemIndex = cart.items.findIndex(item => item.pname === pname);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ pname, quantity });
    }

    await collection.updateOne({ userId }, { $set: { items: cart.items } }, { upsert: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Error adding item to cart', message: error.message }, { status: 500 });
  }
}
