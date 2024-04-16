import { z } from 'zod';

export const schoolSchema = z.object({
    school_name: z.string().min(1, { message: "学校名称不能为空" }).max(20, { message: "学校名称不能超过20个字符" }),
    school_remark: z.string().optional()
})


export const teacherSchema = z.object({
    teacher_name: z.string().min(1, { message: "班主任姓名不能为空" }),
    teacher_phone: z.string({ required_error: "班主任电话不能为空" }).regex(/^1\d{10}$/, "请输入正确的手机号"),
    teacher_wechat: z.string().optional(),
    teacher_class: z.string().optional(),
    teacher_type: z.enum(
        ["未知", "合作意向强", "了解观望", "无合作意向"],
        { required_error: "请选择班主任类型" }
    ),
    teacher_status: z.enum(
        ["未对接", "对接中", "对接成功", "对接失败"],
        { required_error: "请选择班主任状态" }
    ),
    teacher_remark: z.string().optional()
})

export const createTeacherSchema = z.object({
    school_id: z.string().min(1, { message: "请选择学校" }),
    teacher_name: z.string().min(1, { message: "班主任姓名不能为空" }),
    teacher_phone: z.string({ required_error: "班主任电话不能为空" }).regex(/^1\d{10}$/, "请输入正确的手机号"),
    teacher_wechat: z.string().optional(),
    teacher_class: z.string().optional(),
    teacher_type: z.enum(
        ["未知", "合作意向强", "了解观望", "无合作意向"],
        { required_error: "请选择班主任类型" }
    ),
    teacher_status: z.enum(
        ["未对接", "对接中", "对接成功", "对接失败"],
        { required_error: "请选择班主任状态" }
    ),
    teacher_remark: z.string().optional()
})


export const studentSchema = z.object({
    student_name: z.string().min(1, { message: "学生姓名不能为空" }),
    student_sex: z.enum(["未知", "男", "女"], { required_error: "请选择学生性别" }),
    student_phone: z.string({ required_error: "学生电话不能为空" }).regex(/^1\d{10}$/, "请输入正确的手机号"),
    student_wechat: z.string().optional(),
    student_mother_phone: z.string().optional(),
    student_father_phone: z.string().optional(),
    student_relative_phone: z.string().optional(),
    student_id_number: z.string().optional(),
    student_type: z.enum(["未知", "意向强", "考虑中", "无意向"], { required_error: "请选择学生类型" }),
    student_target_school_type: z.enum(["未知", "公办中职", "普高", "民办中职", "其他(备注)"], { required_error: "请选择学生目标学校类型" }),
    student_status: z.enum(["未对接", "对接中", "已联系", "未报名", "预报名", "全费报名", "已入学", "退学退费"], { required_error: "请选择学生状态" }),
    student_remark: z.string().optional()
})

export const createStudentSchema = z.object({
    school_id: z.string().min(1, { message: "请选择学校" }),
    teacher_id: z.string().min(1, { message: "请选择班主任" }),
    student_name: z.string().min(1, { message: "学生姓名不能为空" }),
    student_sex: z.enum(["未知", "男", "女"], { required_error: "请选择学生性别" }),
    student_phone: z.string({ required_error: "学生电话不能为空" }).regex(/^1\d{10}$/, "请输入正确的手机号"),
    student_wechat: z.string().optional(),
    student_mother_phone: z.string().optional(),
    student_father_phone: z.string().optional(),
    student_relative_phone: z.string().optional(),
    student_id_number: z.string().optional(),
    student_type: z.enum(["未知", "意向强", "考虑中", "无意向"], { required_error: "请选择学生类型" }),
    student_target_school_type: z.enum(["未知", "公办中职", "普高", "民办中职", "其他(备注)"], { required_error: "请选择学生目标学校类型" }),
    student_status: z.enum(["未对接", "对接中", "已联系", "未报名", "预报名", "全费报名", "已入学", "退学退费"], { required_error: "请选择学生状态" }),
    student_remark: z.string().optional()
})