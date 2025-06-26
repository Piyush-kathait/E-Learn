import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {
        const authResult = await auth();
        const {courseId} = await params
        const values = await req.json();

        // Extract userId from the auth result
        const userId = authResult?.userId;

        if (!userId) {
            return new Response("Unauthorized",{ status: 401 });
        }

        const course = await db.course.update({
            where:{
                id:courseId,
                userId,
            },
            data:{
                ...values,
            }
        });
        return NextResponse.json(course);
    }
    catch (error) {
        console.log("[COURSEID] ", error);
        return new Response("Internal Server Error",
            { status: 500 });
    }
}