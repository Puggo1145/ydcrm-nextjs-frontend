"use client"

// shadcn components
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
// schema
import { studentSchema } from "@/constants/zodSchema/database"
// components
import FormItemInput from "@/components/forms/form-item-input"
import FormItemSelect from "@/components/forms/form-item-select"
import FormItemTextarea from "@/components/forms/form-item-textarea"
// hooks
import { useMemo } from "react"
import { usePathname } from "next/navigation"
import useSpinner from "@/hooks/useSpinner"
// utils
import { toast } from "sonner"
import PubSub from "pubsub-js"
// server action
import { updateStudentTaskDetail } from "@/actions/task/detail/student/action"
// types
import { Student } from "@/types/modelType/student"

interface Props {
    setSheetOpen: (open: boolean) => void;
    defaultValues?: Student
}

const TeacherForm: React.FC<Props> = ({ setSheetOpen, defaultValues }) => {
    const { Spinner, loading, setLoading } = useSpinner();

    const pathname = usePathname();
    const object_id = useMemo(() => pathname.split('/')[4], [pathname]);
    const task_id = useMemo(() => pathname.split('/')[5], [pathname]);

    const form = useForm<z.infer<typeof studentSchema>>({
        resolver: zodResolver(studentSchema),
        defaultValues: defaultValues
    })

    async function onSubmit(data: z.infer<typeof studentSchema>) {
        setLoading(true);

        const payload = {
            task_id,
            object_id,
            on_submit_object: JSON.stringify(data),
        };

        const res = await updateStudentTaskDetail(payload);

        if (res.ok) {
            toast.success("提交成功，您提交的修改将在审核后通过");
            form.reset();

            PubSub.publish("refresh-task-target-student");

            setSheetOpen(false);
            setLoading(false);
        } else {
            toast.error(res.error);
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                className="relative h-full"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="space-y-4">
                    {/*  student_name */}
                    <FormField
                        control={form.control}
                        name="student_name"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"学生姓名"} field={field} />
                        )}
                    />
                    {/* student_sex */}
                    <FormField
                        control={form.control}
                        name="student_sex"
                        render={({ field }) => (
                            <FormItemSelect
                                field={field}
                                placeholder="请选择学生性别"
                                label={"学生性别"}
                                values={[
                                    { alias: "未知", value: "未知" },
                                    { alias: "男", value: "男" },
                                    { alias: "女", value: "女" },
                                ]}
                            />
                        )}
                    />
                    {/* student_phone */}
                    <FormField
                        control={form.control}
                        name="student_phone"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"学生电话"} field={field} />
                        )}
                    />
                    {/* student_wechat */}
                    <FormField
                        control={form.control}
                        name="student_wechat"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"学生微信（可选）"} field={field} />
                        )}
                    />
                    {/* student_mother_phone */}
                    <FormField
                        control={form.control}
                        name="student_mother_phone"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"母亲电话（可选）"} field={field} />
                        )}
                    />
                    {/* student_father_phone */}
                    <FormField
                        control={form.control}
                        name="student_father_phone"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"父亲电话（可选）"} field={field} />
                        )}
                    />
                    {/* student_relative_phone */}
                    <FormField
                        control={form.control}
                        name="student_relative_phone"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"其他联系人电话（可选）"} field={field} />
                        )}
                    />
                    {/* student_id_number */}
                    <FormField
                        control={form.control}
                        name="student_id_number"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"学生身份证号（可选）"} field={field} />
                        )}
                    />
                    {/* student_type */}
                    <FormField
                        control={form.control}
                        name="student_type"
                        render={({ field }) => (
                            <FormItemSelect
                                field={field}
                                placeholder="请选择学生类型"
                                label={"学生类型"}
                                values={[
                                    { alias: "未知", value: "未知" },
                                    { alias: "意向强", value: "意向强" },
                                    { alias: "考虑中", value: "考虑中" },
                                    { alias: "无意向", value: "无意向" },
                                ]}
                            />
                        )}
                    />
                    {/* student_target_school_type */}
                    <FormField
                        control={form.control}
                        name="student_target_school_type"
                        render={({ field }) => (
                            <FormItemSelect
                                field={field}
                                placeholder="请选择学生目标学校类型"
                                label={"学生目标学校类型"}
                                values={[
                                    { alias: "未知", value: "未知" },
                                    { alias: "公办中职", value: "公办中职" },
                                    { alias: "普高", value: "普高" },
                                    { alias: "民办中职", value: "民办中职" },
                                    { alias: "其他(备注)", value: "其他(备注)" },
                                ]}
                            />
                        )}
                    />
                    {/* student_status */}
                    <FormField
                        control={form.control}
                        name="student_status"
                        render={({ field }) => (
                            <FormItemSelect
                                field={field}
                                placeholder="请选择学生状态"
                                label={"学生状态"}
                                values={[
                                    { alias: "未对接", value: "未对接" },
                                    { alias: "对接中", value: "对接中" },
                                    { alias: "已联系", value: "已联系" },
                                    { alias: "未报名", value: "未报名" },
                                    { alias: "预报名", value: "预报名" },
                                    { alias: "全费报名", value: "全费报名" },
                                    { alias: "已入学", value: "已入学" },
                                    { alias: "退学退费", value: "退学退费" },
                                ]}
                            />
                        )}
                    />
                    {/* student_remark */}
                    <FormField
                        control={form.control}
                        name="student_remark"
                        render={({ field }) => (
                            <FormItemTextarea<typeof field>
                                label={"备注"}
                                field={field}
                                placeholder="请输入备注"
                            />
                        )}
                    />
                </div>
                <Button className="mt-8 w-full" type="submit" disabled={loading}>
                    { loading ? <Spinner size="default" /> : "提交" }
                </Button>
            </form>
        </Form>
    );
};

export default TeacherForm;