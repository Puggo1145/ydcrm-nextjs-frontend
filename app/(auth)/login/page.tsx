"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/loader";
import { toast } from 'sonner';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
// hooks
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next-nprogress-bar";
// import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
// server actions
// import { validateRecaptcha } from "@/actions/recaptcha/action";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "用户名必须至少包含2个字符"
    }),
    password: z.string().min(8, {
        message: "密码必须至少包含8个字符"
    })
})

const Login: React.FC = () => {
    const router = useRouter();
    // const { executeRecaptcha } = useGoogleReCaptcha();
    
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            password: ""
        }
    });

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true);

        // TODO - 等待 recaptcha 恢复，重新启用
        // recaptcha
        // if (!executeRecaptcha) {
        //     toast.error("人机验证加载失败，请刷新页面");
        //     return;
        // }
        // const recaptchaToken = await executeRecaptcha("login");
        // const recaptchaRes = await validateRecaptcha(recaptchaToken);
        
        // if (!recaptchaRes?.ok) {
        //     toast.error("您的登录环境异常，请刷新页面重试");
        //     setLoading(false);
        //     return;
        // }

        
        const res = await signIn("credentials", {
            redirect: false,
            name: data.name,
            password: data.password,
        });

        if (res?.ok) {
            form.reset();
            toast.success("登录成功");
            router.push("/");
        } else {
            form.setError("password", { message: "用户名或密码错误" });
            form.setError("name", { message: "用户名或密码错误" });
        }

        setLoading(false);
    }


    return (
        <div className="h-full flex items-center justify-center">
            <Card className="max-w-[350px] w-full">
                <CardHeader>
                    <CardTitle>登录</CardTitle>
                    <CardDescription>请登录以继续</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col items-center gap-y-4">
                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full space-y-1.5">
                                        <FormLabel className="font-bold">用户名</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="请输入用户名" {...field} autoComplete="name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col w-full space-y-1.5">
                                        <FormLabel className="font-bold">密码</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="请输入密码" {...field} autoComplete="password" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button className="text-white w-full gap-x-2" type="submit" disabled={loading} >
                                {loading ? <Loader size="default" className="text-white" /> : "登录"}
                            </Button>
                        </Form>
                    </form>
                    {/* recaptcha-box */}
                    <div id="recaptcha-badge" className="w-full mt-4 flex justify-center" />
                </CardContent>
            </Card>
        </div>
    );
};

export default Login;