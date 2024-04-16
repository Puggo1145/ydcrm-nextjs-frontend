import type { Schema } from "mongoose";
import type { TeacherObject } from "@/stores/taskcenter/createTaskTemp";
import type { StudentObject } from "@/stores/taskcenter/createTaskTemp";

export type TaskStatus = '进行中' | '待审核' | '已完成' | '已逾期' | '需修改' ;
export type TaskStatusColor = {
    [prop in TaskStatus]: string
}
export type TaskTarget = '学生' | '班主任';


export interface Task {
    _id: string & Schema.ObjectId
    task_name: string
    employee: string & Schema.ObjectId // 负责员工
    task_target: TaskTarget | undefined
    task_target_object: (TeacherObject | StudentObject | Schema.ObjectId)[] // 任务对象
    task_amount: number
    status: TaskStatus
    task_remark: string
    deadline: Date | undefined
    createdAt: string
    updatedAt: string
}