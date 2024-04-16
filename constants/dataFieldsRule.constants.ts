import type { School } from "@/types/modelType/school"
import type { Teacher } from "@/types/modelType/teacher"
import type { Student } from "@/types/modelType/student"

type Fields<T> = Partial<Record<keyof T, number>>

export const schoolFieldsRule: Record<string, Fields<School>> = {
    getAll: {
        school_remark: 0,
        createdAt: 0,
        updatedAt: 0,
    },
    getOneWithId: {
        school_name: 1,
        school_remark: 1
    }
}

export const teacherFieldsRule: Record<string, Fields<Teacher>> = {
    getAll: {
        teacher_name: 1,
        teacher_status: 1,
    },
    getOneWithId: {
        createdAt: 0,
        updatedAt: 0,
    }
}

export const studentFieldsRule: Record<string, Fields<Student>> = {
    getAll: {
        student_name: 1,
        student_status: 1,
    },
    getOneWithId: {
        createdAt: 0,
        updatedAt: 0,
    }
}