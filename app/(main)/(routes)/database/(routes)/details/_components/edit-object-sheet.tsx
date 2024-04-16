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
import SchoolForm from "../../../_components/school-form";
import TeacherForm from "../../../_components/teacher-form";
import StudentForm from "../../../_components/student-form";
// hoooks
import { useState } from "react";
import useCurrentObject from "@/stores/databse/currentObject";
// types
import { School } from "@/types/modelType/school";
import { Teacher } from "@/types/modelType/teacher";
import { Student } from "@/types/modelType/student";

interface Props {
    object: string;
}

const EditObjectSheet: React.FC<Props> = ({ object }) => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { currentObject } = useCurrentObject();

    return (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <Button asChild variant="secondary" className="font-bold text-primary">
                <SheetTrigger>
                    编辑
                </SheetTrigger>
            </Button>
            <SheetContent className="w-full md:min-w-[480px] flex flex-col">
                <SheetHeader className="items-start">
                    <SheetTitle>

                    </SheetTitle>
                    <SheetDescription className="text-left">
                        为了更好地对人名进行区分，系统不允许添加同名对象。请在出现 “XX已存在” 错误时，手动添加一些后缀来区分
                    </SheetDescription>
                </SheetHeader>
                <section className="h-full overflow-y-scroll">
                    {
                        object === "school" &&
                        <SchoolForm
                            setSheetOpen={setIsSheetOpen}
                            objectId={currentObject?._id}
                            defaultValues={currentObject as School}
                        />
                    }
                    {
                        object === "teacher" &&
                        <TeacherForm                         setSheetOpen={setIsSheetOpen}
                            objectId={currentObject?._id}
                            defaultValues={currentObject as Teacher}
                        />
                    }
                    {
                        object === "student" &&
                        <StudentForm
                            setSheetOpen={setIsSheetOpen}
                            objectId={currentObject?._id}
                            defaultValues={currentObject as Student}
                        />
                    }
                </section>
            </SheetContent>
        </Sheet>
    );
};

export default EditObjectSheet;