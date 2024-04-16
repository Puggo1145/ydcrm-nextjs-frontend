// 该组件需要应用在 columns 的 cell 中，而不是 data table 组件中，用于显示账户的操作按钮。
"use client"

// shadcn
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
// icons
import { MoreHorizontal } from "lucide-react";
// components
import useDeleteDoubleCheck from "./delete-double-check";
import ResetPasswordDialog from "./reset-password";
import ResetNameDialog from "./reset-name";
// utils
import { toast } from "sonner";
import PubSub from "pubsub-js";
// server actions
import { deleteUser } from "@/actions/account/actions";
// types
import type { Account } from "@/types/modelType/user"
import { useState } from "react";

interface AccountRowActionsProps {
    account: Account;
}

export default function AccountRowActions(
    { account }: AccountRowActionsProps
) {
    const { deleteDialog, openDialog } = useDeleteDoubleCheck();
    const [ openResetDialog, setOpenResetDialog ] = useState(false);
    const [ openResetNameDialog, setOpenResetNameDialog ] = useState(false);

    async function handleDelete() {
        const res = await openDialog(
            account.name,
            () => deleteUser(account._id)
        ) as { ok: boolean, error: string };

        if (res.ok) {
            toast.success("删除成功");
            PubSub.publish("refresh-account-list");
        } else {
            toast.error("删除失败：" + res.error);
        }
    }

    return (
        <>
            {deleteDialog}
            <ResetPasswordDialog
                isOpen={openResetDialog}
                setIsOpen={setOpenResetDialog}
                id={account._id}
            />
            <ResetNameDialog
                isOpen={openResetNameDialog}
                setIsOpen={setOpenResetNameDialog}
                id={account._id}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>数据操作</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenResetNameDialog(true)}>
                        修改用户名
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenResetDialog(true)}>
                        重置密码
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="text-red-500"
                        onClick={handleDelete}
                    >
                        删除
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}