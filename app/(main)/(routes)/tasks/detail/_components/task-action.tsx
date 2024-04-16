"use client"

// sahdcn 
import { Button } from "@/components/ui/button";
// components
import useActionCheckDialog from "@/components/action-check-dialog";
// utils
import { toast } from "sonner";
// hooks
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next-nprogress-bar";
// server actions
import { submitTask } from "@/actions/task/mine/action";
import { auditTask } from "@/actions/task/action";

interface Props {
    task_id: string
    status: string
}

const TaskAction: React.FC<Props> = ({ task_id, status }) => {

    const router = useRouter();
    const { data: session } = useSession();
    const role = useMemo(() => session?.user.role, [session]);

    // 是否允许提交任务
    const isSubmitTaskAllowed = useMemo(() => {
        return ["admin", "employee", "parttime_employee"].includes(role) && !["待审核", "已完成"].includes(status)
    }, [status, role]);

    // 提交任务操作
    const { Dialog: SubmitTaskDialog, setIsOpen: openSubmit } = useActionCheckDialog({
        title: "确定要提交任务吗？",
        desc: "请再次确保您已经完成了所有任务，并确保提交的数据准确无误。提交后，任务将进入审核阶段，您提交的修改将在审核后通过",
        action: () => handleSubmitTask()
    })

    async function handleSubmitTask() {
        const res = await submitTask(task_id);

        if (res.ok) {
            toast.success("提交成功")
            router.replace('/tasks')
        } else {
            toast.error(res.error);
        }
    }

    // 通过审核操作
    const { Dialog: AuditTaskDialog, setIsOpen: openAudit } = useActionCheckDialog({
        title: "确定要通过审核吗？",
        desc: "请再次确保您已经逐一确认员工所提交的所有修改，审核通过后，所有修改的内容都会被同步至数据库中！！！ [此操作不可撤回]",
        action: () => handleAuditTask()
    })

    async function handleAuditTask() {
        const res = await auditTask(task_id, "已完成");

        if (res.ok) {
            toast.success("审核成功")
            router.replace('/taskcenter')
        } else {
            toast.error(res.error);
        }
    }

    // 打回修改操作
    const { Dialog: SendBackTaskDialog, setIsOpen: openSendBack } = useActionCheckDialog({
        title: "确定要打回任务吗？",
        desc: "任务状态将变更为“需修改”，需要由员工重新提交审核",
        action: () => sendBackTask()
    })

    async function sendBackTask() {
        const res = await auditTask(task_id, "需修改");

        if (res.ok) {
            toast.success("打回成功")
            router.replace('/taskcenter')
        } else {
            toast.error(res.error);
        }
    }

    return (
        <section className="flex gap-x-4">
            <SubmitTaskDialog />
            <AuditTaskDialog />
            <SendBackTaskDialog />
            {
                status === "待审核" &&
                ["super_admin", "admin"].includes(role)
                &&
                <>
                    <Button
                        variant="ghost"
                        className="text-red-500 font-bold"
                        onClick={() => openSendBack(true)}
                    >
                        打回修改
                    </Button>
                    <Button
                        variant="secondary"
                        className="text-primary font-bold"
                        onClick={() => openAudit(true)}
                    >
                        通过审核
                    </Button>
                </>
            }
            {
                isSubmitTaskAllowed &&
                <Button
                    variant="secondary"
                    className="text-primary font-bold"
                    onClick={() => openSubmit(true)}
                >
                    提交任务
                </Button>
            }
        </section>
    );
};

export default TaskAction;