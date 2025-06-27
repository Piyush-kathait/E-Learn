import { IconBadge } from "@/app/(dashboard)/_components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import TitleForm from "./_components/title-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachmentForm from "./_components/attachments-form";
import ChaptersForm from "./_components/chapters-form";

const courseIdPage = async (props: {
    params: { courseId: string }
}) => {
    const { courseId } = await props.params;
    const { userId } = await auth();
    if (!userId) {
        return redirect("/");
    }


    const course = await db.course.findUnique({
        where: {
            id: courseId,
            userId
        },
        include: {
            chapters:{
                orderBy:{
                    position:"asc"
                },
            },
            attachments: {
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });


    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    console.log(categories);
    if (!course) {
        return redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter=>chapter.isPublished), 
    ];
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;



    return (
        <div className="p-6 ">
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium ">
                        Course Setup
                    </h1>
                    <span className="text-sm text-slate-700">
                        complete all fields {completionText}
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                <div>
                    <div className="flex items-center  gap-x-2">
                        <IconBadge icon={LayoutDashboard} />
                        <h2 className="text-xl ">
                            Customize your course
                        </h2>
                    </div>
                    <TitleForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <DescriptionForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <ImageForm
                        initialData={course}
                        courseId={course.id}
                    />
                    <CategoryForm
                        initialData={course}
                        courseId={course.id}
                        options={categories.map((category) => ({
                            label: category.name,
                            value: category.id,
                        }))}
                    />
                </div>
                <div className="space-y-6">
                    <div>
                        <div className=" flex items-center gap-x-2">
                            <IconBadge icon={ListChecks} />
                            <h2>Course Chapters</h2>
                        </div>

                        <ChaptersForm
                            initialData={course}
                            courseId={course.id}
                        />
                    </div>
                    <div>
                        <div className=" flex items-center gap-x-2">
                            <IconBadge icon={CircleDollarSign} />
                            <h2> Sell your course</h2>
                        </div>
                        <PriceForm
                            initialData={course}
                            courseId={course.id} />
                    </div>
                    <div>
                        <div className=" flex items-center gap-x-2">
                            <IconBadge icon={File} />
                            <h2> Resources & Attachments</h2>
                        </div>
                        <AttachmentForm
                            initialData={course}
                            courseId={course.id}
                        />

                    </div>

                </div>

            </div>
        </div>
    );
}

export default courseIdPage;