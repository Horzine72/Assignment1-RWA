import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET(req) {
  console.log("in the api page");

  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const pass = searchParams.get('pass');

    console.log("Received email:", email);
    console.log("Received pass:", pass);

    const client = await clientPromise;
    const db = client.db('app'); // database name
    const collection = db.collection('login'); // collection name

    const findResult = await collection.find({ "username": email, "pass": pass }).toArray();
    console.log('Found documents =>', findResult);

    let valid = false;
    let acc_type = '';

    if (findResult.length > 0) {
      valid = true;
      acc_type = findResult[0].acc_type; // Assuming the acc_type field indicates the account type (customer/manager)
      console.log("login valid, acc_type:", acc_type);
    } else {
      valid = false;
      console.log("login invalid");
    }

    return NextResponse.json({ data: "" + valid + "", role: acc_type });
  } catch (error) {
    console.error("Error in login API:", error);
    return NextResponse.json({ data: "error", message: error.message });
  }
}
