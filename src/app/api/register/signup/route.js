import { NextResponse } from "next/server";
import connectMongoDb from "../../../../../libs/mongodb";
import User from "../../../../../models/user";
import bcrypt from "bcrypt"

export async function POST(req) {
    try {
        const { username, email, password } = await req.json();

        // Check if all required fields are present
        if (!username || !email || !password) {
            return NextResponse.json({ message: "Missing required fields" }, {
                status: 400
            });
        }

        // Check if user already exists
        await connectMongoDb();
        const existingUser = await User.findOne({ email });

        console.log(email)
        if ( existingUser ) {
            return NextResponse.json({ message: "User already exists" }, {
                status: 409
            });
        }

        // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create the new user
        await User.create({ username, email, password: hashPassword });

        return NextResponse.json({ message: "User registered successfully" }, {
            status: 201
        });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return NextResponse.json({ message: "Internal server error" }, {
            status: 500
        });
    }
}


