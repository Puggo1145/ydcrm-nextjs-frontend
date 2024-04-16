"use client"

// shadcn components
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
// components
import useSpinner from "@/hooks/useSpinner";

interface ConfirmModalProps {
    children: React.ReactNode;
    onConfirm: () => Promise<void>;
}

const DeleteConfirmDialog: React.FC<ConfirmModalProps> = (
    { children, onConfirm }
) => {
    const { loading, setLoading, Spinner } = useSpinner();

    const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();

        setLoading(true);
        await onConfirm();
        setLoading(false);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger className="w-full text-left" onClick={e => e.stopPropagation()}>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        确定要删除吗?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    该操作无法撤销，该条记录会从数据库中被永久删除
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={e => e.stopPropagation()}>
                        取消
                    </AlertDialogCancel>
                    <Button variant="destructive" asChild>
                        <AlertDialogAction onClick={handleConfirm}>
                            {loading ? <Spinner size="default" /> : "确认"}
                        </AlertDialogAction>
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteConfirmDialog;