"use client"

// zod
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { createTaskSchema } from "@/constants/zodSchema/tasks";
// shadcn
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
} from "@/components/ui/form"
import FormItemInput from "@/components/forms/form-item-input";
import FormItemTextarea from "@/components/forms/form-item-textarea";
import FormItemSelect from "@/components/forms/form-item-select";
import SingleDatePickerForm from "@/components/form-item-date-picker";
// icons
import { X } from "lucide-react";
import type { TempedTaskInfo } from "@/stores/taskcenter/createTaskTemp";
// components
import InformationSection from "@/components/information-section";
import SelectedObject from "./selected-object";
// hooks
import { useState, useEffect } from "react";
import { useRouter } from "next-nprogress-bar";
import useCreateTaskTemp from "@/stores/taskcenter/createTaskTemp";
import useSpinner from "@/hooks/useSpinner";
// utils
import { toast } from "sonner";
// server actions
import { getAllUsers } from "@/actions/account/actions";
import { createTask } from "@/actions/task/action";
// types
import type { User } from "@/types/modelType/user";

const TaskForm: React.FC = () => {
    const router = useRouter();
    const createTaskTemp = useCreateTaskTemp();
    const { Spinner, loading, setLoading } = useSpinner();

    const [employeeList, setEmployeeList] = useState<{ alias: string, value: string }[]>();

    const form = useForm<z.infer<typeof createTaskSchema>>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            task_target: createTaskTemp.task_target,
            task_name: createTaskTemp.task_name,
            employee: createTaskTemp.employee,
            task_remark: createTaskTemp.task_remark,
            deadline: createTaskTemp.deadline,
        }
    });


    // 去选择任务对象
    function selectObject() {
        // 缓存任务对象和任务信息
        const allValues = form.getValues();
        createTaskTemp.tempTask(allValues as TempedTaskInfo);

        // 跳转到选择任务对象页面
        router.push("/database");
    }

    // 获取员工列表
    async function getEmployee() {
        const res = await getAllUsers();

        if (res.ok) {
            const users = JSON.parse(res.users) as User[];

            const formattedEmployee = users.map((employee) => ({
                alias: employee.name,
                value: employee._id
            }));

            setEmployeeList(formattedEmployee);
        } else {
            toast.error("获取员工列表失败，请检查网络");
        }
    }

    useEffect(() => {
        getEmployee();
    }, []);

    async function onSubmit(data: z.infer<typeof createTaskSchema>) {
        // 检查任务对象是否选择
        if (createTaskTemp.task_target_object.length === 0) {
            toast.error("请添加至少一个任务对象");
            return;
        }

        setLoading(true);

        const payload = {
            ...data,
            task_target_object: createTaskTemp.task_target_object.map((object) => object._id),
            task_amount: createTaskTemp.task_target_object.length,
            task_remark: data.task_remark ?? ""
        };

        try {
            const res = await createTask(payload);

            if (res.ok) {
                toast.success("任务创建成功");
                router.push("/taskcenter");
                createTaskTemp.clearTempTask();
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("创建失败，请检查网络");
        } finally { 
            setLoading(false);
        }
    }


    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative h-full flex flex-col items-center"
            >
                <ul className="w-full space-y-4">
                    <InformationSection title="选择任务对象">
                        <FormField
                            control={form.control}
                            name="task_target"
                            render={({ field }) => (
                                <FormItemSelect
                                    field={field}
                                    label={"任务对象"}
                                    placeholder="请选择任务对象"
                                    values={[
                                        { alias: "班主任", value: "班主任" },
                                        { alias: "学生", value: "学生" },
                                    ]}
                                />
                            )}
                        />
                        {
                            form.getValues("task_target") && (
                                createTaskTemp.task_target_object.length > 0 ?
                                    (
                                        <div className="border rounded-md flex flex-col">
                                            <div className="pl-4 p-3 text-sm text-muted-foreground border-b">
                                                总共选择了 {createTaskTemp.task_target_object.length} 人
                                            </div>
                                            <ul className="p-4 flex flex-col gap-y-3">
                                                {
                                                    createTaskTemp.task_target_object.map((object) => (
                                                        <li
                                                            className="flex items-center justify-between"
                                                            key={object._id}
                                                        >
                                                            <SelectedObject
                                                                object={object}
                                                                task_target={form.getValues("task_target")}
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                className="text-muted-foreground"
                                                                onClick={() => createTaskTemp.removeTaskTargetObject(object)}
                                                            >
                                                                <X size={16} />
                                                            </Button>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                onClick={selectObject}
                                                className="rounded-none border-t"
                                            >
                                                继续添加
                                            </Button>
                                        </div>
                                    ) :
                                    (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={selectObject}
                                        >
                                            添加{form.getValues("task_target")}
                                        </Button>
                                    )
                            )
                        }
                    </InformationSection>
                    <InformationSection title="任务信息">
                        <FormField
                            control={form.control}
                            name="task_name"
                            render={({ field }) => (
                                <FormItemInput
                                    field={field}
                                    label="任务名称"
                                    placeholder="您可以简单描述本次任务的目标，例如：联系、跟进或回访"
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="employee"
                            render={({ field }) => (
                                <FormItemSelect
                                    disabled={!employeeList}
                                    field={field}
                                    label="员工"
                                    placeholder={!employeeList ? "正在获取员工列表..." : "请选择员工"}
                                    values={employeeList ?? []}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <SingleDatePickerForm
                                    field={field}
                                    label="截止日期"
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="task_remark"
                            render={({ field }) => (
                                <FormItemTextarea
                                    field={field}
                                    label="备注"
                                    placeholder="请输入备注"
                                />
                            )}
                        />
                    </InformationSection>
                </ul>
                <div className="mt-6">
                    <Button
                        className="w-[160px] flex gap-2"
                        type="submit"
                        disabled={loading}
                    >
                        <Spinner size="default" />
                         创建
                    </Button>
                </div>
            </form>
        </Form>
    );
};

export default TaskForm;