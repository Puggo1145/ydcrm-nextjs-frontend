"use client"

// icons
import { ArrowLeft } from "lucide-react";
// shadcn ui
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
// components
import InformationSection from "@/components/information-section";
import SelectedObject from "../../../taskcenter/create/_components/selected-object";
import TaskStatusBadge from "@/components/task-status-badge";
import TaskAction from "../_components/task-action";
// hooks
import { useState, useEffect, useMemo } from "react";
import useSpinner from "@/hooks/useSpinner";
import { useRouter } from "next-nprogress-bar";
// utils
import { format } from "date-fns";
import Link from "next/link";
// server action
import { getTaskDetail } from "@/actions/task/detail/action";
// types
import type { Task } from "@/types/modelType/task";
import type { Account } from "@/types/modelType/user";

interface Params {
    params: {
        id: string;
    }
}

type TaskDetail = Task & {
    employee: Account;
}

const TaskDetailPage: React.FC<Params> = ({ params: { id } }) => {
    const router = useRouter();

    const { Spinner } = useSpinner({ loadByDefault: true });
    const [task, setTask] = useState<TaskDetail | null>(null);
    const taskDetailLink = useMemo(() => {
        const formattedTaskTarget = task?.task_target === '学生' ? 'student' : 'teacher';

        return `/tasks/detail/${formattedTaskTarget}`
    }, [task?.task_target]);

    async function handleGetTaskDetail() {
        const res = await getTaskDetail(id);

        if (res.ok) {
            const task = JSON.parse(res.task);
            setTask(task);
        } else {
            toast.error(res.error);
        }
    }

    useEffect(() => {
        handleGetTaskDetail();

        return () => setTask(null);
    }, []);

    if (!task) return (
        <div className="p-4 w-full h-full flex items-center justify-center">
            <Spinner size="lg" />
        </div>
    );

    return (
        <div className="pb-4">
            <Card className="flex flex-col gap-6">
                <CardHeader className="py-4 flex flex-row items-center justify-between border-b">
                    <Button
                        variant="ghost"
                        className="p-0 flex items-center gap-x-2"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft />
                        <h6 className="text-md font-bold">返回</h6>
                    </Button>

                    <TaskAction task_id={task._id} status={task.status} />

                </CardHeader>

                <CardContent className="flex flex-col gap-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold">
                        {task.task_name}
                    </h1>
                    <InformationSection title="任务对象">
                        <div>
                            <p className="text-sm text-muted-foreground">任务目标</p>
                            <p className="text-foreground">{task.task_target}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">任务目标 - 共计：{task.task_amount} 条</p>
                            <ul className="flex flex-col gap-y-3 border rounded-md">
                                {
                                    task.task_target_object.map((object) => (
                                        <li
                                            className="flex items-center justify-between"
                                            key={object}
                                        >
                                            <Link
                                                href={`${taskDetailLink}/${object._id}/${task._id}`}
                                                className="p-4 w-full h-full cursor-pointer hover:bg-secondary"
                                            >
                                                <SelectedObject
                                                    object={object}
                                                    task_target={task.task_target!}
                                                />
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </InformationSection>
                    <InformationSection title="任务信息">
                        <div>
                            <p className="text-sm text-muted-foreground">对接员工</p>
                            <p className="text-foreground">{task.employee.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">任务起止时间</p>
                            <p className="text-foreground">
                                {format(task.createdAt, 'yyyy/MM/dd')} - {format(task.deadline!, 'yyyy/MM/dd')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">任务状态</p>
                            <TaskStatusBadge>{task.status}</TaskStatusBadge>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">备注</p>
                            <p className="text-foreground">{task.task_remark || '暂无备注'}</p>
                        </div>
                    </InformationSection>
                </CardContent>
            </Card>
        </div>
    );
};

export default TaskDetailPage;