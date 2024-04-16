import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
// components
import TaskStatusBadge from "@/components/task-status-badge"
// types
import type { Task, TaskStatus } from "@/types/modelType/task"


export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "employee",
        header: "对接员工",
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
        id: "actions",
        cell: ({ row }) => {
            const _id = row.original._id as string;

            return (
                <Link href={`/tasks/detail/${_id}`}>
                    <ChevronRight size="20" />
                </Link>
            )
        },
    }
]