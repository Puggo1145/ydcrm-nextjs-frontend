import { create } from "zustand";
// types
import type { Task } from "@/types/modelType/task";
import type { Teacher } from "@/types/modelType/teacher";
import type { Student } from "@/types/modelType/student";

export type TempedTaskInfo = Omit<Task, '_id' | 'task_amount' | 'createdAt' | 'updatedAt' | "status">
export type TeacherObject = Pick<Teacher, '_id' | 'teacher_name' | 'teacher_status'>
export type StudentObject = Pick<Student, '_id' | 'student_name' | 'student_status'>

interface Store extends TempedTaskInfo {
    isCreating: boolean

    tempTask: (taskInfo: TempedTaskInfo) => void
    selectTaskTargetObject: (object: TeacherObject | StudentObject) => void
    removeTaskTargetObject: (object: TeacherObject | StudentObject) => void
    clearTempTask: () => void
}

const useCreateTaskTemp = create<Store>()(set => ({
    isCreating: false,

    task_name: '',
    employee: '',
    task_target: undefined,
    task_target_object: [],
    task_remark: '',
    deadline: undefined,

    selectTaskTargetObject: (object) => {
        set(state => {
            if (state.task_target === '学生') {
                return {
                    ...state,
                    task_target_object: [...state.task_target_object, object as StudentObject]
                }
            } else {
                return {
                    ...state,
                    task_target_object: [...state.task_target_object, object as TeacherObject]
                }
            }
        })
    },
    removeTaskTargetObject: (object) => {
        set(state => ({
            ...state,
            task_target_object: state.task_target_object.filter(obj => obj._id !== object._id)
        }))
    },
    tempTask: (taskInfo) => {
        set(state => ({
            ...state,
            ...taskInfo,
            isCreating: true
        }))
    },
    clearTempTask: () => {
        set(state => ({
            ...state,
            task_name: '',
            employee: '',
            task_target: undefined,
            task_target_object: [],
            task_remark: '',
            deadline: undefined,
            isCreating: false
        }))
    }
}));

export default useCreateTaskTemp;