// src/app/oauth/route.js

import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

import {createAdminClient} from "@/lib/appwrite";

import {AUTH_COOKIE} from "@/features/auth/constants";

export async function GET(request: NextRequest) {
    const userId = request.nextUrl.searchParams.get("userId");
    const secret = request.nextUrl.searchParams.get("secret");

    if (!userId || !secret) {
        return new NextResponse("Missing credentials", {status: 400});
    }

    const {account} = await createAdminClient();
    const session = await account.createSession(userId, secret);

    cookies().set(AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
    });

    return NextResponse.redirect(`${request.nextUrl.origin}/`);
}
