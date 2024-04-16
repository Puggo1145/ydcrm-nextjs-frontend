"use client"

import { PropsWithChildren } from "react";
// shadcn
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
// hooks
import useCreateTaskTemp from "@/stores/taskcenter/createTaskTemp";
import { useRouter } from "next-nprogress-bar";

// components
import useActionCheckDialog from "@/components/action-check-dialog";
// icons 
import { ChevronLeft } from "lucide-react";

const CreateTaskLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const createTaskTemp = useCreateTaskTemp();
    const router = useRouter();

    const { Dialog, setIsOpen } = useActionCheckDialog({
        title: "是否保存为草稿",
        desc: "您选择了任务对象但没有创建该任务，是否将当前任务信息保存为草稿？",
        cancelWords: "不保存",
        actionWords: "保存",
        cancel: () => {
            createTaskTemp.clearTempTask()
            router.push("/taskcenter")
        },
        action: () => {
            router.push("/taskcenter")
        }
    });

    return (
        <div className="h-full flex flex-col items-start gap-y-4">
            <Button 
                variant="ghost" 
                className="font-bold flex items-center"
                onClick={() => {
                    if (createTaskTemp.isCreating) {
                        setIsOpen(true)
                        return
                    }
                    router.push("/taskcenter");
                }}
            >
                <ChevronLeft size={24} />
                返回
            </Button>
            <ScrollArea className="w-full flex-1">
                {children}
            </ScrollArea>
            {createTaskTemp.isCreating && <Dialog />}
        </div>
    );
};

export default CreateTaskLayout;