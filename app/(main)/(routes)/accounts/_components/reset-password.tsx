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
// server actions
import { resetPassword } from "@/actions/account/actions";

interface ResetPasswordProps {
    id: string
    isOpen: boolean
    setIsOpen: (value: boolean) => void
}

const ResetPasswordDialog = ({ id, isOpen, setIsOpen }: ResetPasswordProps) => {
    const { loading, setLoading, Spinner } = useSpinner();
    const [alertMsg, setAlertMsg] = useState("");

    const doubleCheckInputRef = useRef<HTMLInputElement>(null);


    const onConfirm = async () => {
        const newPassword = doubleCheckInputRef.current?.value

        if (
            !newPassword ||
            newPassword.length < 8 ||
            !(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/)).test(newPassword)
        ) {
            return setAlertMsg("请输入正确的密码");
        }

        setLoading(true);
        try {
            const res = await resetPassword({
                user_id: id,
                newPassword
            });

            if (res.ok) {
                toast.success("重置成功")
            } else {
                toast.error("重置失败：" + res.error);
            }

        } catch (error) {
            toast.error("重置失败");
        } finally {
            setLoading(false);
        }

        setIsOpen(false);
    }

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>请输入新密码</AlertDialogTitle>
                    <AlertDialogDescription>
                        密码应由大小写字母与数字组成，且不少于8位
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-2">
                    <span className="text-sm text-muted-foreground">
                        请输入新密码：
                    </span>
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

export default ResetPasswordDialog;