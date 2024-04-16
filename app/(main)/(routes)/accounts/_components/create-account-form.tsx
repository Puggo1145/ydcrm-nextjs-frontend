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
// components
import FormItemInput from "@/components/forms/form-item-input"
import FormItemSelect from "@/components/forms/form-item-select"
// utils
import useSpinner from "@/hooks/useSpinner"
import { toast } from 'sonner';
import PubSub from "pubsub-js";
// server actions
import { signUpUser } from "@/actions/account/actions"

const formSchema = z.object({
    name: z.string().min(2, "用户名长度至少为2位"),
    phone: z.string().regex(/^1\d{10}$/, "请输入正确的手机号"),
    password: z.string()
        .min(8, "密码长度至少为8位")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "密码必须包含大小写字母和数字"),
    role: z.enum(["employee", "partime_employee", "admin"]),
})

interface Props {
    setSheetOpen: (open: boolean) => void;
}

const CreateAccountForm: React.FC<Props> = ({ setSheetOpen }) => {
    const { Spinner, loading, setLoading } = useSpinner();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            phone: "",
            password: "",
            role: "employee",
        }
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        setLoading(true);

        const payload = {
            ...data,
        }

        const res = await signUpUser(payload);

        if (res.ok) {
            toast.success("创建成功");
            form.reset();

            PubSub.publish("refresh-account-list");

            setSheetOpen(false);
            setLoading(false);
        } else {
            toast.error("创建失败：" + res.error);
            setLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form
                className="relative h-full flex flex-col justify-between gap-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItemInput label={"用户名"} field={field} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItemInput label={"密码"} field={field} type="password" />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItemInput label={"手机号"} field={field} />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItemSelect
                                label="权限"
                                field={field}
                                placeholder="请选择权限"
                                values={[
                                    { alias: "员工", value: "employee" },
                                    { alias: "兼职员工", value: "partime_employee" },
                                    { alias: "管理员", value: "admin" },
                                ]}
                            />
                        )}
                    />

                </div>
                <Button className="mt-8 w-full" type="submit" disabled={loading}>
                    {loading ? <Spinner size="default" /> : "创建"}
                </Button>
            </form>
        </Form>
    );
};

export default CreateAccountForm;