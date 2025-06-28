import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }

) {
  try {
    const { userId } = await auth();
    const { isPublished, ...values} = await req.json();
    // const { courseId,chapterId } = await params;


    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId
      },
    });
    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const chapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        ...values,
      }
    });
    //todo: handle video upload 
    return NextResponse.json(chapter);


  } catch (error) {
    console.log("[course_chapter_id]", error);
    return new NextResponse("Internal Error!", { status: 500 })
  }
}