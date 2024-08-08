import { NextResponse } from "next/server";
import User from "../../../../models/user";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";

export async function POST (request) {
    try {
        const reqBody = await request.json();
        const {email, password} =  await reqBody;
        console.log(reqBody);


        const user = await User.findOne({email});
        if(!user) {
            return NextResponse.json({error:"User Does not Exists"}, {status: 400});
        }

        const validPassword =  await bcrypt.compare(password, user.password)

        if(!validPassword) {
            return NextResponse.json({error:"Password Does not Exists"}, {status: 400});
        }

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email

        }

        const token = await jwt.sign(tokenData,"mysecret", {expiresIn: "1h"})

        const response = NextResponse.json({
            message:"Login SuccessFully",
            success:true
        })

        response.cookies.set("token",token,{
            httpOnly:true
        })

        return response


    }   catch (error) {
            return NextResponse.json({error:error.message}, {status: 500});
    }
}