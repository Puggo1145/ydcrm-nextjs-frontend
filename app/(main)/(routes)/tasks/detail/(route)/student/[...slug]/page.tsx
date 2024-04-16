"use client"

// shadcn ui
import { toast } from "sonner";
// components
import Name from "@/app/(main)/_components/name";
import ObjectStatusBadge from "@/components/object-status-badge";
import InformationSection from "@/components/information-section";
import useSpinner from "@/hooks/useSpinner";
import SubmitObjectSheet from "../../_components/submit-object-sheet";
import TempFlag from "../../_components/temp-flag";
// hooks
import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
// utils
import diffObject from "@/utils/diffObject";
import PubSub from "pubsub-js";
// server actions
import { getStudentTaskDetail } from "@/actions/task/detail/student/action";
// types
import type { Student } from "@/types/modelType/student";

interface Params {
    params: {
        slug: string[]
    }
}

const StudentDetailPage: React.FC<Params> = ({ params: { slug } }) => {
    const { Spinner } = useSpinner({ loadByDefault: true });
    const { data: session } = useSession();
    const role = useMemo(() => session?.user.role, [session]);

    const [student, setStudent] = useState<Student>();
    const [temp, setTemp] = useState<Partial<Student> | null>(null);
    const [allowModify, setAllowModify] = useState(false); // 是否允许更改 task
    const school_name = useMemo(() => student?.school_id.school_name, [student])
    const teacher_name = useMemo(() => student?.teacher_id.teacher_name, [student])

    useEffect(() => {
        const token = PubSub.subscribe("refresh-task-target-student", () => getStudent());

        getStudent();

        return () => {
            PubSub.unsubscribe(token);
        }
    }, []);

    async function getStudent() {
        const res = await getStudentTaskDetail(slug[0], slug[1]);

        if (res.ok) {
            setAllowModify(res.allowModify);
            const student = await JSON.parse(res.student) as Student
            const tempData = res.temp ? JSON.parse(res.temp) as Student : null

            setStudent(student);

            // diff 出存在修改处的 temp
            if (tempData) {
                const diffedTemp = diffObject(tempData, student) as Partial<Student>

                setTemp(diffedTemp)
            }
        } else {
            toast.error(res.error);
        }
    }

    if (!student) return <Spinner size="lg" />;

    return (
        <div className="h-full flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <Name type="学生" desc={'来自 ' + school_name + '，' + '是 ' + teacher_name + ' 的学生'}>
                        {student.student_name}
                    </Name>
                    <TempFlag>{temp?.student_name}</TempFlag>
                </div>
                {
                    role !== 'super_admin' &&
                    allowModify &&
                    <SubmitObjectSheet
                        object="student"
                        objectValue={student}
                    />
                }
            </div>
            <ul className="flex flex-col gap-y-6">
                <InformationSection title="基础信息">
                    <li>
                        <p className="text-sm text-muted-foreground">性别:</p>
                        <div className="flex items-center gap-4">
                            <p>{student.student_sex}</p>
                            <TempFlag>{temp?.student_sex}</TempFlag>
                        </div>
                    </li>
                    <li>
                        <p className="text-sm text-muted-foreground">电话:</p>
                        <div className="flex items-center gap-4">
                            <p>{student.student_phone}</p>
                            <TempFlag>{temp?.student_phone}</TempFlag>
                        </div>
                    </li>
                    <li>
                        <p className="text-sm text-muted-foreground">微信:</p>
                        <div className="flex items-center gap-4">
                            <p className="text-foreground">{student.student_wechat || "暂无"}</p>
                            <TempFlag>{temp?.student_wechat}</TempFlag>
                        </div>
                    </li>
                    <li>
                        <p className="text-sm text-muted-foreground">母亲电话:</p>
                        <div className="flex items-center gap-4">
                            <p className="text-foreground">{student.student_mother_phone || "暂无"}</p>
                            <TempFlag>{temp?.student_mother_phone}</TempFlag>
                        </div>
                    </li>
                    <li>
                        <p className="text-sm text-muted-foreground">父亲电话:</p>
                        <div className="flex items-center gap-4">
                            <p className="text-foreground">{student.student_father_phone || "暂无"}</p>
                            <TempFlag>{temp?.student_father_phone}</TempFlag>
                        </div>
                    </li>
                    <li>
                        <p className="text-sm text-muted-foreground">亲友电话:</p>
                        <div className="flex items-center gap-4">
                            <p className="text-foreground">{student.student_relative_phone || "暂无"}</p>
                            <TempFlag>{temp?.student_relative_phone}</TempFlag>
                        </div>
                    </li>
                    <li>
                        <p className="text-sm text-muted-foreground">身份证:</p>
                        <div className="flex items-center gap-4">
                            <p className="text-foreground">{student.student_id_number || "暂无"}</p>
                            <TempFlag>{temp?.student_id_number}</TempFlag>
                        </div>
                    </li>
                </InformationSection>
                <InformationSection title="状态信息">
                    <li>
                        <p className="text-sm text-muted-foreground">类型:</p>
                        <div className="flex items-center gap-4">
                            <p>{student.student_type}</p>
                            <TempFlag>{temp?.student_type}</TempFlag>
                        </div>
                    </li>
                    <li>
                        <p className="text-sm text-muted-foreground">目标院校:</p>
                        <div className="flex items-center gap-4">
                            <p>{student.student_target_school_type}</p>
                            <TempFlag>{temp?.student_target_school_type}</TempFlag>
                        </div>
                    </li>
                    <li>
                        <p className="text-sm text-muted-foreground">状态:</p>
                        <div className="flex items-center gap-4">
                            <ObjectStatusBadge>{student.student_status}</ObjectStatusBadge>
                            <TempFlag>{temp?.student_status}</TempFlag>
                        </div>
                    </li>
                </InformationSection>
                <InformationSection title="备注">
                    <p className="text-foreground">{student.student_remark || "暂无备注"}</p>
                    <TempFlag>{temp?.student_remark}</TempFlag>
                </InformationSection>
            </ul>
        </div>
    );
};

export default StudentDetailPage;