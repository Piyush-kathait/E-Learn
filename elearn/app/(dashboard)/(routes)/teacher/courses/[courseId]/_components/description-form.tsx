"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Course } from "@prisma/client";


interface DescriptionFormProps {
    initialData: Course;
    courseId: string;
};
const formSchema = z.object({
    description: z.string().min(1, {
        message: "description is required",
    }),
});


const DescriptionForm = ({
    initialData,
    courseId,
}: DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);


    const toggleEdit = () => {
        setIsEditing((current) => !current);
    }
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || "",
        },
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course description updated successfully");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("something went wrong");
        }
    }
    return (
        <div className="mt-6 rounded-md p-4 bg-slate-100">
            <div className="font-medium flex items-center justify-between">
                Course Description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ?
                        (<> Cancel</>) : (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit Description
                            </>
                        )
                    }

                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.description && "text-slate-500 italic"
                )}>
                    {initialData.description || "no description"}
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'This course is about...'" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={!isValid || isSubmitting}
                                type="submit"

                            >
                                save
                            </Button>

                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}

export default DescriptionForm;