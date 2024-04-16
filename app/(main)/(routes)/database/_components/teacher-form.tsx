"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { teacherSchema } from "@/constants/zodSchema/database"
// shadcn components
import { useForm } from "react-hook-form"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
// components
import FormItemInput from "@/components/forms/form-item-input"
import FormItemSelect from "@/components/forms/form-item-select"
import FormItemTextarea from "@/components/forms/form-item-textarea"
// stores
import useSelectedSchool from "@/stores/databse/selectedSchool";
// hooks
import { useState } from "react"
// utils
import Loader from "@/components/loader"
import { toast } from "sonner"
import PubSub from "pubsub-js"
// server actions
import { createTeacher, modifyTeacher } from "@/actions/data/teacher/action"
// types
import type { Teacher } from "@/types/modelType/teacher"


interface Props {
    setSheetOpen: (open: boolean) => void;
    objectId?: string;
    defaultValues?: Teacher
}

const TeacherForm: React.FC<Props> = ({ setSheetOpen, objectId, defaultValues }) => {
    const { selectedSchool } = useSelectedSchool();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof teacherSchema>>({
        resolver: zodResolver(teacherSchema),
        defaultValues:
            defaultValues ||
            {
                teacher_name: "",
                teacher_phone: "",
                teacher_wechat: "",
                teacher_class: "",
                teacher_remark: "",
                teacher_type: "未知",
                teacher_status: "未对接",
            }
    })

    async function onSubmit(data: z.infer<typeof teacherSchema>) {
        setLoading(true);

        const payload = {
            ...data,
            teacher_remark: data.teacher_remark ?? "",
        };

        const res = objectId ? 
            await modifyTeacher(objectId, payload) : 
            await createTeacher({
                ...payload, 
                school_id: selectedSchool?._id
            });

        if (res.ok) {
            toast.success(objectId ? "保存成功" : "创建成功");

            form.reset();

            objectId ?
                window.location.reload() :
                PubSub.publish("refresh-teacher-list", { school_id: selectedSchool?._id });

            setSheetOpen(false);
            setLoading(false);
        } else {
            toast.error((objectId ? "保存失败：" : "创建失败：") + res.error);
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
                    {/*  teacher_name */}
                    <FormField
                        control={form.control}
                        name="teacher_name"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"班主任姓名"} field={field} />
                        )}
                    />
                    {/* teacher_phone */}
                    <FormField
                        control={form.control}
                        name="teacher_phone"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"班主任电话"} field={field} />
                        )}
                    />
                    {/* teacher_wechat */}
                    <FormField
                        control={form.control}
                        name="teacher_wechat"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"班主任微信（可选）"} field={field} />
                        )}
                    />
                    {/* teacher_class */}
                    <FormField
                        control={form.control}
                        name="teacher_class"
                        render={({ field }) => (
                            <FormItemInput<typeof field> label={"毕业班班级（可选）"} field={field} />
                        )}
                    />
                    {/* teacher_type */}
                    <FormField
                        control={form.control}
                        name="teacher_type"
                        render={({ field }) => (
                            <FormItemSelect
                                field={field}
                                placeholder="请选择班主任类型"
                                label={"班主任类型"}
                                values={[
                                    { alias: "未知", value: "未知" },
                                    { alias: "合作意向强", value: "合作意向强" },
                                    { alias: "了解观望", value: "了解观望" },
                                    { alias: "无合作意向", value: "无合作意向" },
                                ]}
                            />
                        )}
                    />
                    {/* teacher_status */}
                    <FormField
                        control={form.control}
                        name="teacher_status"
                        render={({ field }) => (
                            <FormItemSelect
                                field={field}
                                placeholder="请选择班主任状态"
                                label={"班主任状态"}
                                values={[
                                    { alias: "未对接", value: "未对接" },
                                    { alias: "对接中", value: "对接中" },
                                    { alias: "对接成功", value: "对接成功" },
                                    { alias: "对接失败", value: "对接失败" },
                                ]}
                            />
                        )}
                    />
                    {/* teacher_remark */}
                    <FormField
                        control={form.control}
                        name="teacher_remark"
                        render={({ field }) => (
                            <FormItemTextarea<typeof field>
                                label={"备注（可选）"}
                                field={field}
                            />
                        )}
                    />
                </div>
                <Button className="mt-8 w-full" type="submit" disabled={loading}>
                    {
                        loading ?
                            <Loader size="default" className="text-white" /> :
                            "提交"
                    }
                </Button>
            </form>
        </Form>
    );
};

export default TeacherForm;