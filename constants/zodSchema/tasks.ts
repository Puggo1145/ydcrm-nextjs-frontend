import { z } from "zod";

export const createTaskSchema = z.object({
    // 任务对象
    task_target: z.enum(["学生", "班主任"], { required_error: "请选择任务对象" }),
    // task_target_object: z.array(z.string().nonempty()),
    // 基本信息
    task_name: z.string().min(1, "任务名称不能为空"),
    employee: z.string().min(1, "请选择员工"),
    task_remark: z.string().optional(),
    deadline: z.date({ required_error: "请选择日期" })
});