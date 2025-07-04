import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";


export async function POST(
    req: Request
) {
    try {
        const { userId } = await auth();
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("unauthorized", {
                status: 401
            });
        }

        const course = await db.course.create({
            data: {
                userId,
                title
            }
        });
        return NextResponse.json(course);
    }
    catch (error) {

        console.log("[Courses]", error);
        return new NextResponse("internal server error", {
            status: 500
        });
    }
}