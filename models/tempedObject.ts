// 此 model 用于暂存员工提交的任务对象修改，修改将在审核通过后被合并到数据库中对应的对象中
import { Schema, model, models } from "mongoose";
import type { TempedObject } from "@/types/modelType/tempted-object";

const tempedObjectSchema = new Schema<TempedObject>({
    task: {
        type: Schema.ObjectId,
        ref: "Task",
    },
    task_target: {
        type: String,
        enum: ['学生', '班主任'],
        required: true
    },
    object_id: {
        type: Schema.ObjectId,
        required: true
    },
    on_submit_object: {
        type: String,
        required: true
    }
}, { timestamps: true });

const TempedObjectModel = models.TempedObject || model("TempedObject", tempedObjectSchema);

export default TempedObjectModel;