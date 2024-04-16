"use client"

import {
    Sheet,
    SheetTrigger,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
// components
import TeacherForm from "./teacher-form";
import StudentForm from "./student-form";
// hoooks
import { useState } from "react";
// types
import { Teacher } from "@/types/modelType/teacher";
import { Student } from "@/types/modelType/student";

interface Props {
    object: string;
    objectValue: Teacher | Student;
}

const SubmitObjectSheet: React.FC<Props> = ({ object, objectValue }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <Button asChild variant="secondary" className="font-bold text-primary">
                <SheetTrigger>
                    更新信息
                </SheetTrigger>
            </Button>
            <SheetContent className="w-full md:min-w-[480px] flex flex-col">
                <SheetHeader className="items-start">
                    <SheetTitle>
                        更新任务对象信息
                    </SheetTitle>
                    <SheetDescription className="text-left">
                        您提交的新信息将在审核通过后被合并到数据库中，请确保数据内容准确无误
                    </SheetDescription>
                </SheetHeader>
                <section className="h-full overflow-y-scroll">
                    {
                        object === "teacher" &&
                        <TeacherForm
                            setSheetOpen={setIsSheetOpen}
                            defaultValues={objectValue as Teacher}
                        />
                    }
                    {
                        object === "student" &&
                        <StudentForm
                            setSheetOpen={setIsSheetOpen}
                            defaultValues={objectValue as Student}
                        />
                    }
                </section>
            </SheetContent>
        </Sheet>
    );
};

export default SubmitObjectSheet;