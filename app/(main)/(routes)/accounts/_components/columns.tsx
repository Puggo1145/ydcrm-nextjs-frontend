"use client"

import { ColumnDef } from "@tanstack/react-table"
// components
import AccountRowActions from "./account-row-actions"
// types
import type { role } from "@/types/modelType/user"
import type { Account } from "@/types/modelType/user"

export const columns: ColumnDef<Account>[] = [
    {
        accessorKey: "name",
        header: "用户名"
    },
    {
        accessorKey: "role",
        header: "权限",
        cell: ({ row }) => {
            const role = row.getValue("role") as role;
            const roleMap = {
                super_admin: "超级管理员",
                admin: "管理员",
                employee: "员工",
                partime_employee: "兼职员工"
            }

            return (
                <span>{roleMap[role]}</span>
            )
        }
    },
    {
        accessorKey: "phone",
        header: "手机号",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const account = row.original as Account;

            return (
                <AccountRowActions account={account} />
            )
        }
    }
]