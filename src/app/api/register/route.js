import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req) {
    console.log("in the register API");

    try {
        const { email, password } = await req.json();

        console.log("Received email:", email);
        console.log("Received password:", password);

        const client = await clientPromise;
        const db = client.db('app');
        const collection = db.collection('login');

        // Check if the user already exists
        const existingUser = await collection.findOne({ username: email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Insert the new user
        const result = await collection.insertOne({
            username: email,
            pass: password,
            acc_type: 'customer',
            createdAt: new Date()
        });

        return NextResponse.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json({ error: 'Error registering user' }, { status: 500 });
    }
}
