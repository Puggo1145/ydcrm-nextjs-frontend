/* eslint-disable @typescript-eslint/no-explicit-any */
// 回调函数 Promise 的类型必须是 any 

"use client"

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSpinner from "@/hooks/useSpinner";
import { toast } from "sonner";
// hooks
import { useState, useCallback, useRef } from "react";

const useDeleteDoubleCheck = () => {
  const { loading, setLoading, Spinner } = useSpinner();

  const [isOpen, setIsOpen] = useState(false);
  const [resolveReject, setResolveReject] = useState<((value: unknown) => void)[]>([]);
  const [callbackFn, setCallbackFn] = useState<() => Promise<unknown>>();

  const [doubleCheckStr, setDoubleCheckStr] = useState<string>(""); // 双重确认的文本
  const doubleCheckInputRef = useRef<HTMLInputElement>(null);


  // 对话框调用方法，收集函数，返回一个 promise
  // 该 Promise 的 resolve 和 reject 被存放在 state 中，以此实现其在全组件的共享
  const openDialog = useCallback((
    checkStr: string,
    callback?: () => Promise<unknown>
  ) => {
    setIsOpen(true);
    // React 会执行一次函数，因此要再包裹一层
    setCallbackFn(() => callback);
    setDoubleCheckStr(checkStr);

    return new Promise((resolve, reject) => {
      setResolveReject([resolve, reject]);
    });
  }, [])


  const onConfirm = useCallback(async () => {
    if (doubleCheckInputRef.current?.value !== doubleCheckStr) {
      return;
    }

    // 如果有回调函数，则执行回调函数 
    if (callbackFn) {
      setLoading(true);
      try {
        const res = await callbackFn();
        resolveReject[0](res);
      } catch (error) {
        toast.error("删除失败");
      } finally {
        setLoading(false);
      }
    } else {
      resolveReject[0](true);
    }

    setIsOpen(false);
  }, [resolveReject, doubleCheckStr, callbackFn]);

  const onCancel = useCallback(() => {
    resolveReject[1](false);

    setIsOpen(false);
  }, [resolveReject]);

  const deleteDialog = (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要删除吗?</AlertDialogTitle>
          <AlertDialogDescription>
            该操作无法撤销，该条数据会被永久删除
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2">
          <span className="text-sm text-muted-foreground">
            请在下方输入
            <span> “{doubleCheckStr}” </span>
            以删除：
          </span>
          <Input ref={doubleCheckInputRef} />
        </div>
        <AlertDialogFooter>
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            取消
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <Spinner size="default" /> : "确定"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { deleteDialog, openDialog }
};

export default useDeleteDoubleCheck;