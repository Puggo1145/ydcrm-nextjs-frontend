"use client"

// zod
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { schoolSchema } from "@/constants/zodSchema/database"
// shadcn components
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
// utils
import Loader from "@/components/loader";
import { toast } from 'sonner';
import Pubsub from "pubsub-js";
// hooks
import { useState } from "react";
// server actions
import { createSchool, modifySchool } from "@/actions/data/school/actions"
// types 
import type { School } from "@/types/modelType/school"

interface Props {
  setSheetOpen: (open: boolean) => void;
  objectId?: string;
  defaultValues?: School
}

const SchoolForm: React.FC<Props> = ({ setSheetOpen, objectId, defaultValues }) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof schoolSchema>>({
    resolver: zodResolver(schoolSchema),
    defaultValues:
      defaultValues ||
      {
        school_name: "",
        school_remark: "",
      }
  })

  async function onSubmit(data: z.infer<typeof schoolSchema>) {
    setLoading(true);

    const payload = {
      school_name: data.school_name,
      school_remark: data.school_remark ?? "",
    }

    const res = objectId ? await modifySchool(objectId, payload) : await createSchool(payload);

    if (res.ok) {
      toast.success(objectId ? "保存成功" : "创建成功");
      form.reset();

      objectId ?
        window.location.reload() :
        Pubsub.publish("refresh-school-list");

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
        className="relative h-full flex flex-col justify-between gap-y-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="school_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">学校名称：</FormLabel>
                <FormControl>
                  <Input placeholder="请输入学校名称" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="school_remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold">备注：</FormLabel>
                <FormControl>
                  <Textarea placeholder="备注（可选）" className="max-h-[300px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
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

export default SchoolForm;