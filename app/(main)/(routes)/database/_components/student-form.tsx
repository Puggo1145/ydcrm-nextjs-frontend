"use client"

// zod
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { studentSchema } from "@/constants/zodSchema/database"
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
import useSpinner from "@/hooks/useSpinner"
// utils
import { toast } from "sonner"
import PubSub from "pubsub-js"
// stores
import useSelectedSchool from "@/stores/databse/selectedSchool"
import useSelectedTeacher from "@/stores/databse/selectedTeacher"
// server actions
import { createStudent, modifyStudent } from "@/actions/data/student/action"
// types
import type { Student } from "@/types/modelType/student"

interface Props {
  setSheetOpen: (open: boolean) => void;
  objectId?: string;
  defaultValues?: Student
}

const StudentForm: React.FC<Props> = ({ setSheetOpen, objectId, defaultValues }) => {
  const { selectedSchool } = useSelectedSchool();
  const { selectedTeacher } = useSelectedTeacher();
  const { loading, setLoading, Spinner } = useSpinner();

  const form = useForm<z.infer<typeof studentSchema>>({
    resolver: zodResolver(studentSchema),
    defaultValues:
      defaultValues ||
      {
        student_name: "",
        student_sex: "未知",
        student_phone: "",
        student_wechat: "",
        student_mother_phone: "",
        student_father_phone: "",
        student_relative_phone: "",
        student_id_number: "",
        student_remark: "",
        student_type: "未知",
        student_target_school_type: "未知",
        student_status: "未对接",
      }
  });


  async function onSubmit(data: z.infer<typeof studentSchema>) {
    setLoading(true);

    const payload = {
      ...data,
      student_id_number: data.student_id_number || "",
      student_remark: data.student_remark || "",
    };

    const res = objectId ? 
      await modifyStudent(objectId, payload) : 
      await createStudent({
        ...payload, 
        school_id: selectedSchool?._id, 
        teacher_id: selectedTeacher?._id
      });

    if (res.ok) {
      toast.success(objectId ? "保存成功" : "创建成功");
      form.reset();

      objectId ?
        window.location.reload() :
        PubSub.publish("refresh-student-list", { school_id: selectedSchool?._id, teacher_id: selectedTeacher?._id });

      setSheetOpen(false);
    } else {
      toast.error((objectId ? "保存失败：" : "创建失败：") + res.error);
    }

    setLoading(false);
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
          {
            loading ?
              <Spinner size="default" className="text-white" /> :
              "提交"
          }
        </Button>
      </form>
    </Form>
  );
};

export default StudentForm;