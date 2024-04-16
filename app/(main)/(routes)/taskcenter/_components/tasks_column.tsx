import { ColumnDef } from "@tanstack/react-table"
import type { AllTask } from "../page"
import type { TaskStatus } from "@/types/modelType/task"

import PubSub from "pubsub-js"
import { toast } from "sonner"
import { format } from "date-fns"
import Link from "next/link"
// components
import TaskStatusBadge from "@/components/task-status-badge"
import useActionCheckDialog from "@/components/action-check-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVertical } from 'lucide-react';
// server actions
import { deleteTask } from "@/actions/task/action"

export const columns: ColumnDef<AllTask>[] = [
    {
        accessorKey: "task_name",
        header: "任务名称"
    },
    {
        accessorKey: "employee",
        header: "负责员工",
        cell: ({ row }) => {
            const employee = row.getValue("employee") as { _id: string, name: string };

            return (
                <span>{employee.name}</span>
            )
        }
    },
    {
        accessorKey: "task_target",
        header: "任务目标"
    },
    {
        accessorKey: "task_amount",
        header: "目标数量"
    },
    {
        accessorKey: "status",
        header: "状态",
        cell: ({ row }) => {
            const status = row.getValue("status") as TaskStatus;

            return (
                <TaskStatusBadge>{status}</TaskStatusBadge>
            )
        }
    },
    {
        accessorKey: "deadline",
        header: "截止日期",
        cell: ({ row }) => {
            const deadline = row.getValue("deadline") as string;
            const formattedDeadline = format(new Date(deadline), "yyyy-MM-dd");

            return (
                <span>{formattedDeadline}</span>
            )
        }
    },
    {
        id: "actions",
        header: "操作",
        cell: ({ row }) => {
            const _id = row.original._id as string;

            // eslint-disable-next-line react-hooks/rules-of-hooks
            const { Dialog, setIsOpen } = useActionCheckDialog({
                title: "删除任务",
                desc: "确定要删除该任务吗？此操作不可撤销",
                cancelWords: "取消",
                actionWords: "删除",
                action: handleTaskDelete
            });

            async function handleTaskDelete() {
                const res = await deleteTask(_id)

                if (res.ok) {
                    toast.success("删除成功");
                } else {
                    toast.error(res.error);
                }

                PubSub.publish("refresh-task-list");
            }

            return (
                <>
                    <Dialog type="destructive"/>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link className="w-full" href={`/tasks/detail/${_id}`}>
                                    查看
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setIsOpen(true)}
                                className="text-red-500"
                            >
                                删除
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        },
    }
]