"use client"

// shadcn ui
import { toast } from "sonner";
// components
import Name from '../../_components/name';
import ObjectStatusBadge from "@/components/object-status-badge";
import InformationSection from "../../_components/information-section";
import useSpinner from "@/hooks/useSpinner";
// hooks
import { useEffect, useMemo } from "react";
import useCurrentObject from "@/stores/databse/currentObject";
// server actions
import { getTeacherDetail } from "@/actions/data/teacher/action";

interface Params {
  params: {
    id: string;
  }
}

const TeacherDetailPage: React.FC<Params> = ({ params: { id } }) => {
  const { Spinner } = useSpinner({ loadByDefault: true });

  const { currentObject, setCurrentObject } = useCurrentObject();
  const school_name = useMemo(() => currentObject?.school_id.school_name, [currentObject])

  useEffect(() => {
    getTeacher();

    return () => setCurrentObject(null);
  }, []);
   
  async function getTeacher() {
    const res = await getTeacherDetail(id);

    if (res.ok) {
      const teacher = JSON.parse(res.result);
      setCurrentObject(teacher);
    } else {
      toast.error(res.error);
    }
  }

  if (!currentObject) return <Spinner size="lg" />;

  return (
    <div className="flex flex-col gap-y-4">
      <Name type="班主任" desc={'来自 ' + school_name}>{currentObject.teacher_name}</Name>
      <ul className="flex flex-col gap-y-6">
        <InformationSection title="基础信息">
          <li>
            <p className="text-sm text-muted-foreground">电话:</p>
            <p>{currentObject.teacher_phone}</p>
          </li>
          <li>
            <p className="text-sm text-muted-foreground">微信:</p>
            <p className="text-foreground">{currentObject.teacher_wechat || "暂无"}</p>
          </li>
          <li>
            <p className="text-sm text-muted-foreground">班级:</p>
            <p className="text-foreground">{currentObject.teacher_class || "暂无"}</p>
          </li>
        </InformationSection>
        <InformationSection title="状态信息">
          <li>
            <p className="text-sm text-muted-foreground">类型:</p>
            <p>{currentObject.teacher_type}</p>
          </li>
          <li>
            <p className="text-sm text-muted-foreground">状态:</p>
            <ObjectStatusBadge>{currentObject.teacher_status}</ObjectStatusBadge>
          </li>
        </InformationSection>
        <InformationSection title="备注">
          <p className="text-foreground">{currentObject.teacher_remark || "暂无备注"}</p>
        </InformationSection>
      </ul>
    </div>
  );
};

export default TeacherDetailPage;