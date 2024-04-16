/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSpinner from "@/hooks/useSpinner";
import { toast } from "sonner";
// hooks
import { useState, useRef } from "react";
// utils
import PubSub from "pubsub-js";
// server action
import { modifyUserName } from "@/actions/account/actions";

interface ResetPasswordProps {
    id: string
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

const ResetNameDialog = ({ id, isOpen, setIsOpen }: ResetPasswordProps) => {
    const { loading, setLoading, Spinner } = useSpinner();
    const [alertMsg, setAlertMsg] = useState("");

    const doubleCheckInputRef = useRef<HTMLInputElement>(null);


    const onConfirm = async () => {
        const newName = doubleCheckInputRef.current?.value

        if (!newName || newName.length < 1) {
            return setAlertMsg("用户名不能为空");
        } else if (newName.length > 20) {
            return setAlertMsg("用户名不能超过 20 个字符");
        }

        setLoading(true);
        try {
            const res = await modifyUserName({
                user_id: id,
                modifiedName: newName
            });

            if (res.ok) {
                toast.success("修改成功");
                PubSub.publish("refresh-account-list");
            } else {
                toast.error("修改失败：" + res.error);
            }

        } catch (error) {
            toast.error("修改失败");
        } finally {
            setLoading(false);
        }

        setIsOpen(false);
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>请输入新用户名</AlertDialogTitle>
                    <AlertDialogDescription>
                        用户名不能超过 20 个字符
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2">
                    <Input
                        ref={doubleCheckInputRef}
                        onChange={() => setAlertMsg("")}
                    />
                    <span className="text-sm text-muted-foreground text-rose-500">
                        {alertMsg}
                    </span>
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <Button
                        variant="default"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? <Spinner size="default" /> : "确定"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
};

export default ResetNameDialog;