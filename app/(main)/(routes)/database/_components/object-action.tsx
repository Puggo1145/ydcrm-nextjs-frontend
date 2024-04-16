"use client"

// shadcn component
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// icons
import { EllipsisVertical } from 'lucide-react';
// components
import Link from "next/link";
import DeleteConfirmDialog from "@/components/modals/delete-confirm-dialog";
// hooks
import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import useCreateTaskTemp from "@/stores/taskcenter/createTaskTemp";
// utils
import { toast } from "sonner";
// server actions
import { deleteSchool } from "@/actions/data/school/actions";
import { deletedTeacher } from "@/actions/data/teacher/action";
import { deleteStudent } from "@/actions/data/student/action";
// types
import type { TeacherObject } from "@/stores/taskcenter/createTaskTemp";
import type { StudentObject } from "@/stores/taskcenter/createTaskTemp";
import type { School } from "@/types/modelType/school";

interface Props {
    objectType?: '学生' | '班主任';
    object: TeacherObject | StudentObject | School;
    href: `/${string}/`;
    className?: string;
}

const ObjectAction: React.FC<Props> = ({ href, object, className, objectType }) => {
    const router = useRouter();

    const { isCreating, task_target, task_target_object, selectTaskTargetObject } = useCreateTaskTemp();

    const getObjectType = useMemo(() => {
        return href.split("/")[3];
    }, []);

    const onConfiemDelete = useCallback(async () => {
        if (getObjectType === "school") {
            return handleDeleteSchool();
        } else if (getObjectType === "teacher") {
            return handleDeleteTeacher();
        } else if (getObjectType === "student") {
            return handleDeleteStudent();
        }
    }, [getObjectType]);

    const handleDeleteSchool = async () => {
        const res = await deleteSchool(object._id);

        if (res?.ok) {
            PubSub.publish(`refresh-school-list`);
            toast.success("删除成功");
            setTimeout(() => {
                router.push("/database");
            }, 1000);
        } else {
            toast.error(res?.error);
        }
    }

    const handleDeleteTeacher = async () => {
        const res = await deletedTeacher(object._id);

        if (res?.ok) {
            PubSub.publish(`refresh-teacher-list`, { school_id: res.school_id });
            toast.success("删除成功");
        } else {
            toast.error(res?.error);
        }
    }

    const handleDeleteStudent = async () => {
        const res = await deleteStudent(object._id);

        if (res?.ok) {
            PubSub.publish(`refresh-student-list`, { 
                school_id: res.school_id, 
                teacher_id: res.teacher_id 
            });
            toast.success("删除成功");
        } else {
            toast.error(res?.error);
        }
    }


    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger className={className}>
                    <EllipsisVertical size={20} />
                </DropdownMenuTrigger>
                <DropdownMenuContent onClick={e => e.stopPropagation()}>
                    {
                        objectType &&
                        isCreating &&
                        task_target === objectType &&
                        <DropdownMenuItem
                            onClick={() => selectTaskTargetObject(object as TeacherObject | StudentObject)}
                            disabled={task_target_object.some(item => item._id === object._id)}
                        >
                            {
                                task_target_object.some(item => item._id === object._id) ?
                                    "已被选择" :
                                    "选择为任务对象"
                            }
                        </DropdownMenuItem>
                    }
                    <DropdownMenuItem>
                        <Link href={href + object?._id} className="w-full">
                            查看
                        </Link>
                    </DropdownMenuItem>
                    {
                        !isCreating &&
                        <DropdownMenuItem
                            className="text-red-500 hover:!text-red-500"
                            onClick={e => e.stopPropagation()}
                        >
                            <DeleteConfirmDialog onConfirm={onConfiemDelete}>
                                删除
                            </DeleteConfirmDialog>
                        </DropdownMenuItem>
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default ObjectAction;