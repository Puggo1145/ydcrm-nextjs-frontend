import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
// hooks
import { useState } from "react";
// icons
import { X } from "lucide-react";

interface Props {
    title: string;
    desc: string;
    cancelWords?: string;
    actionWords?: string;
    cancel?: () => void;
    action?: () => void;
}

type actionType = 'default' | 'destructive';

const useActionCheckDialog = ({ cancel, action, title, desc, cancelWords, actionWords }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const Dialog = ({ type }: { type?: actionType }) => (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center justify-between">
                        <AlertDialogTitle>
                            {title ?? "确定要关闭吗？"}
                        </AlertDialogTitle>
                        <X size={16} className="text-muted-foreground cursor-pointer" onClick={() => setIsOpen(false)} />
                    </div>
                    <AlertDialogDescription className="text-left">
                        {desc}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={cancel}>
                        {cancelWords ?? "取消"}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={
                            type === 'destructive' ?
                                'bg-red-500 hover:bg-red-600' :
                                'bg-primary'
                        }
                        onClick={action}
                    >
                        {actionWords ?? "确定"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    return { Dialog, setIsOpen };
};

export default useActionCheckDialog;