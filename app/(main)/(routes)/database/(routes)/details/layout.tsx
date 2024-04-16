"use client"
import { PropsWithChildren } from "react";

// icons
import { ArrowLeft } from "lucide-react";
// shadcn ui
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
// components
import DeleteCheckDialog from "./_components/delete-check-dialog";
import EditObjectSheet from "./_components/edit-object-sheet";
import DeleteConfirmDialog from "@/components/modals/delete-confirm-dialog";
// hooks
import { useState, useMemo, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
// server actions
import { deleteSchool } from "@/actions/data/school/actions";
import { deletedTeacher } from "@/actions/data/teacher/action";
import { deleteStudent } from "@/actions/data/student/action";
// utils
import { toast } from "sonner";
import PubSub from "pubsub-js";

const DetailsLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const pathname = usePathname();
    const [dialogOpen, setDialogOpen] = useState(false);
    const router = useRouter();

    const currentObject = useMemo(() => {
        const object = pathname.split("/")[3];
        const object_id = pathname.split("/")[4];
        return { object, object_id };
    }, [pathname]);

    const onConfiemDelete = useCallback(async () => {
        if (currentObject.object === "school") {
            return handleDeleteSchool();
        } else if (currentObject.object === "teacher") {
            return handleDeleteTeacher();
        } else if (currentObject.object === "student") {
            return handleDeleteStudent();
        }
    }, [currentObject]);

    const handleDeleteSchool = async () => {
        const res = await deleteSchool(currentObject.object_id);

        if (res.ok) {
            PubSub.publish(`refresh-school-list`);
            toast.success("删除成功");
            setTimeout(() => {
                router.push("/database");
            }, 1000);
        } else {
            toast.error(res.error);
        }
    }

    const handleDeleteTeacher = async () => {
        const res = await deletedTeacher(currentObject.object_id);

        if (res.ok) {
            PubSub.publish(`refresh-teacher-list`, { school_id: res.school_id });
            toast.success("删除成功");
            setTimeout(() => {
                router.push("/database");
            }, 1000);
        } else {
            toast.error(res.error);
        }
    }

    const handleDeleteStudent = async () => {
        const res = await deleteStudent(currentObject.object_id);

        if (res.ok) {
            PubSub.publish(`refresh-student-list`, { school_id: res.school_id, teacher_id: res.teacher_id });
            toast.success("删除成功");
            setTimeout(() => {
                router.push("/database");
            }, 1000);
        } else {
            toast.error(res.error);
        }
    }

    return (
        <div className="h-full">
            <DeleteCheckDialog
                open={dialogOpen}
                changeOpen={setDialogOpen}
                object={currentObject.object}
                objectId={currentObject.object_id}
            />

            <Card className="h-full space-y-4">
                <CardHeader className="py-4 flex flex-row items-center justify-between border-b">
                    <Button
                        variant={"ghost"}
                        className="flex items-center gap-x-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft />
                        <h6 className="text-md font-bold">返回</h6>
                    </Button>
                    <section className="flex gap-x-4">
                        <DeleteConfirmDialog onConfirm={onConfiemDelete}>
                            <Button
                                variant="ghost"
                                className="font-bold hover:text-red-500"
                            >
                                删除
                            </Button>
                        </DeleteConfirmDialog>
                        <EditObjectSheet object={currentObject.object} />
                    </section>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>

            {/* 占位 */}
            <div className="h-4" />
        </div>
    );
};

export default DetailsLayout;