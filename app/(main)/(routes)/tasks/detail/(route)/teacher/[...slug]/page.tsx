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
import { getTeacherTaskDetail } from "@/actions/task/detail/teacher/action";
// types
import type { Teacher } from "@/types/modelType/teacher";

interface Params {
  params: {
    slug: string[]
  }
}

const TeacherDetailPage: React.FC<Params> = ({ params: { slug } }) => {
  const { Spinner } = useSpinner({ loadByDefault: true });
  const { data: session } = useSession();
  const role = useMemo(() => session?.user.role, [session]);

  const [teacher, setTeacher] = useState<Teacher>();
  const [allowModify, setAllowModify] = useState(false); // 是否允许更改 task
  const [temp, setTemp] = useState<Partial<Teacher> | null>(null);
  const school_name = useMemo(() => teacher?.school_id.school_name, [teacher])

  useEffect(() => {
    const token = PubSub.subscribe("refresh-task-target-teacher", () => getTeacher());

    getTeacher();

    return () => {
      PubSub.unsubscribe(token);
    }
  }, []);

  async function getTeacher() {
    const res = await getTeacherTaskDetail(slug[0], slug[1]);

    if (res.ok) {
      const teacher = JSON.parse(res.teacher) as Teacher;
      const tempData = res.temp ? JSON.parse(res.temp) as Teacher : null;
      
      setTeacher(teacher);
      setAllowModify(res.allowModify);

      // diff 出存在修改处的 temp
      if (tempData) {
        const diffedTemp = diffObject(tempData, teacher) as Partial<Teacher>
        setTemp(diffedTemp)
      }
    } else {
      toast.error(res.error);
    }
  }

  if (!teacher) return <Spinner size="lg" />;

  return (
    <div className="h-full flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Name type="班主任" desc={'来自 ' + school_name}>
            {teacher.teacher_name}
          </Name>
          <TempFlag>{temp?.teacher_name}</TempFlag>
        </div>
        {
          role !== 'super_admin' &&
          allowModify &&
          <SubmitObjectSheet
            object="teacher"
            objectValue={teacher}
          />
        }
      </div>
      <ul className="flex flex-col gap-y-6">
        <InformationSection title="基础信息">
          <li>
            <p className="text-sm text-muted-foreground">电话:</p>
            <div className="flex items-center gap-4">
              <p>{teacher.teacher_phone}</p>
              <TempFlag>{temp?.teacher_phone}</TempFlag>
            </div>
          </li>
          <li>
            <p className="text-sm text-muted-foreground">微信:</p>
            <div className="flex items-center gap-4">
              <p className="text-foreground">{teacher.teacher_wechat || "暂无"}</p>
              <TempFlag>{temp?.teacher_wechat}</TempFlag>
            </div>
          </li>
          <li>
            <p className="text-sm text-muted-foreground">班级:</p>
            <div className="flex items-center gap-4">
              <p className="text-foreground">{teacher.teacher_class || "暂无"}</p>
              <TempFlag>{temp?.teacher_class}</TempFlag>
            </div>
          </li>
        </InformationSection>
        <InformationSection title="状态信息">
          <li>
            <p className="text-sm text-muted-foreground">类型:</p>
            <div className="flex items-center gap-4">
              <p>{teacher.teacher_type}</p>
              <TempFlag>{temp?.teacher_type}</TempFlag>
            </div>
          </li>
          <li>
            <p className="text-sm text-muted-foreground">状态:</p>
            <div className="flex items-center gap-4">
              <ObjectStatusBadge>{teacher.teacher_status}</ObjectStatusBadge>
              <TempFlag>{temp?.teacher_status}</TempFlag>
            </div>
          </li>
        </InformationSection>
        <InformationSection title="备注">
          <p className="text-foreground">{teacher.teacher_remark || "暂无备注"}</p>
          <TempFlag>{temp?.teacher_remark}</TempFlag>
        </InformationSection>
      </ul>
    </div>
  );
};

export default TeacherDetailPage;