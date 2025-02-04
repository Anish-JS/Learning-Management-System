import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const course = await db.course.findUnique({
      where: { userId, id: params.courseId },
    });

    if (!course) return new NextResponse("Not Found", { status: 404 });

    const unpublishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: { isPublished: false },
    });

    return NextResponse.json(unpublishedCourse);
  } catch (err) {
    console.log("[COURSE_ID_UNPUBLISH]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
