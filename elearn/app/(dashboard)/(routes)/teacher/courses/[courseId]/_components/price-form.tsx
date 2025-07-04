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
import { Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";


interface PriceFormProps {
    initialData: Course;
    courseId: string;
};
const formSchema = z.object({
    price:z.coerce.number(),
});


const PriceForm = ({
    initialData,
    courseId,
}: PriceFormProps) => {
    const [isEditing, setIsEditing] = useState(false);


    const toggleEdit = () => {
        setIsEditing((current) => !current);
    }
    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
        },
    });
    const { isSubmitting, isValid } = form.formState;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course title updated successfully");
            toggleEdit();
            router.refresh();
        } catch {
            toast.error("something went wrong");
        }
    }
    return (
        <div className="mt-6 rounded-md p-4 bg-slate-100">
            <div className="font-medium flex items-center justify-between">
                Course Price
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ?
                        (<> Cancel</>) : (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit price
                            </>
                        )
                    }

                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "text-sm mt-2",
                    !initialData.price && "text-slate-500 italic"
                )}>
                    {initialData.price
                        ? formatPrice(initialData.price)
                        :"No price"
                    }
                </p>
            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. '399.99 " 
                                            {...field} />
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

export default PriceForm;