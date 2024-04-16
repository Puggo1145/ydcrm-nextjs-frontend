import type { Schema } from "mongoose";
import type { Teacher } from "./teacher";
import type { Student } from "./student";

type TaskTarget = '学生' | '班主任';

export interface TempedObject {
    _id: string & Schema.ObjectId
    task: string & Schema.ObjectId
    task_target: TaskTarget
    object_id: string & Schema.ObjectId
    on_submit_object: Teacher | Student | string
    createdAt: string
    updatedAt: string
}