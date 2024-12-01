import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export async function GET(req) {
  console.log("Fetching cart items");

  try {
    const cookieHeaders = await cookies();

    const session = await getIronSession(cookieHeaders, {
      password: process.env.SESSION_PASSWORD,
      cookieName: 'app',
    });

    console.log("Session retrieved with userId:", session.userId);

    const userId = session.userId;

    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db('app');
    const cartCollection = db.collection('shopping_cart');
    const productCollection = db.collection('products');

    const cart = await cartCollection.findOne({ userId });

    if (cart && cart.items) {
      const itemsWithDetails = await Promise.all(
        cart.items.map(async (item) => {
          const product = await productCollection.findOne({ pname: item.pname });
          return { ...item, price: product.price };
        })
      );
      console.log("Fetched cart items with details:", itemsWithDetails);
      return NextResponse.json({ items: itemsWithDetails });
    }

    return NextResponse.json({ items: [] });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Error fetching cart items', message: error.message }, { status: 500 });
  }
}
