"use client"

// shadcn ui
import { toast } from "sonner";
// components
import Name from "../../_components/name";
import ObjectStatusBadge from "@/components/object-status-badge";
import InformationSection from "../../_components/information-section";
// hooks
import { useEffect, useMemo } from "react";
import useSelectedStudent from "@/stores/databse/selectedStudent";
import useSpinner from "@/hooks/useSpinner";
import useCurrentObject from "@/stores/databse/currentObject";
// server action
import { getStudentDetail } from "@/actions/data/student/action";

interface Params {
  params: {
    id: string;
  }
}

const StudentDetailPage: React.FC<Params> = ({ params: { id } }) => {
  const { Spinner } = useSpinner({ loadByDefault: true });

  const { currentObject, setCurrentObject } = useCurrentObject();
  const { setSelectedStudent } = useSelectedStudent();
  const school_name = useMemo(() => currentObject?.school_id.school_name, [currentObject]);
  const teacher_name = useMemo(() => currentObject?.teacher_id.teacher_name, [currentObject]);

  useEffect(() => {
    getstudent();

    return () => setCurrentObject(null);
  }, []);

  async function getstudent() {
    const res = await getStudentDetail(id);

    if (res.ok) {
      const student = JSON.parse(res.result)
      setCurrentObject(student);
      setSelectedStudent(student);
    } else {
      toast.error(res.error);
    }
  }

  if (!currentObject) return <Spinner size="lg" />;

  return (
    <div className="flex flex-col gap-y-4">
      <Name type="学生" desc={`来自 ${school_name}， 是班主任 ${teacher_name} 的学生`}>{currentObject.student_name}</Name>
      <ul className="flex flex-col gap-y-8">
        <InformationSection title="基础信息">
          <div>
            <p className="text-sm text-muted-foreground">性别</p>
            <p className="text-foreground">{currentObject.student_sex}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">电话</p>
            <p className="text-foreground">{currentObject.student_phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">微信</p>
            <p className="text-foreground">{currentObject.student_wechat}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">母亲电话</p>
            <p className="text-foreground">{currentObject.student_mother_phone || "暂无"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">父亲电话</p>
            <p className="text-foreground">{currentObject.student_father_phone || "暂无"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">亲友电话</p>
            <p className="text-foreground">{currentObject.student_relative_phone || "暂无"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">身份证号</p>
            <p className="text-foreground">{currentObject.student_id_number || "暂无"}</p>
          </div>
        </InformationSection>

        <InformationSection title="状态信息">
          <div>
            <p className="text-sm text-muted-foreground">类型</p>
            <p className="text-foreground">{currentObject.student_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">目标院校类型</p>
            <p className="text-foreground">{currentObject.student_target_school_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">状态</p>
            <ObjectStatusBadge>
              {currentObject.student_status}
            </ObjectStatusBadge>
          </div>
        </InformationSection>

        <InformationSection title="备注">
          <p className="text-foreground">{currentObject.student_remark || "暂无备注"}</p>
        </InformationSection>
      </ul>
    </div >
  );
};

export default StudentDetailPage;