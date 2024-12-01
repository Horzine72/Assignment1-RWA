import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(req) {
  try {
    const client = await clientPromise;
    const db = client.db('app');
    const collection = db.collection('shopping_cart');

    const orders = await collection.find({}).toArray();

    // if price = numbers = good, if not then use 0
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!item.price || isNaN(parseFloat(item.price))) {
          console.error(`Invalid or missing price for item ${item.pname}: ${item.price}`);
          item.price = 0; //if not working then use 0
        } else {
          item.price = parseFloat(item.price);
        }
        item.quantity = parseInt(item.quantity, 10);
        console.log(`Parsed Item: ${item.pname}, Price: ${item.price}, Quantity: ${item.quantity}`);
      });
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
