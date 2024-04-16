import { ColumnDef } from "@tanstack/react-table"
import type { AllTask } from "../page"
import type { TaskStatus } from "@/types/modelType/task"

import { format } from "date-fns"
import Link from "next/link"

import TaskStatusBadge from "@/components/task-status-badge"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { EllipsisVertical } from 'lucide-react';
import { Button } from "@/components/ui/button"


export const Columns: ColumnDef<AllTask>[] = [
    {
        accessorKey: "task_name",
        header: "任务名称"
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
            const _id = row.original._id;
            // const status = row.original.status

            // const actions = () => {
            //     switch (status) {
            //         case "待审核":
            //             return (
            //                 <>
            //                     审核中...
            //                 </>
            //             )
            //             break;

            //         case "已完成":
            //             return (
            //                 <>
            //                     任务已完成
            //                 </>
            //             )
            //             break;

            //         default:
            //             return (
            //                 <Link className="w-full text-primary" href={`/tasks/detail/${_id}`}>
            //                     查看
            //                 </Link>
            //             )
            //             break;
            //     }
            // }
            return (
                <>
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>
                                <Link className="w-full" href={`/tasks/detail/${_id}`}>
                                    查看
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}
                    <Button
                        className="p-0 hover:bg-transparent"
                        variant={"ghost"}
                        // disabled={status === "待审核" || status === "已完成"}
                    >
                        {/* {actions()} */}
                        <Link className="w-full text-primary" href={`/tasks/detail/${_id}`}>
                            查看
                        </Link>
                    </Button>
                </>
            )
        },
    }
]