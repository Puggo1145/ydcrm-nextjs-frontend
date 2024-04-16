"use client"

// shadcn
import { ScrollArea } from "@/components/ui/scroll-area";
// utils
import { cn } from "@/lib/utils";
import Loader from "@/components/loader";
import { toast } from "sonner";
import PubSub from "pubsub-js";
// components
import NoData from "@/components/no-data";
import ObjectAction from "./object-action";
import CustomPagination from "@/components/pagination";
import ObjectStatusBadge from "@/components/object-status-badge";
// hooks
import { useState, useEffect } from "react";
import useCreateTaskTemp from "@/stores/taskcenter/createTaskTemp";
// stores
import useSelectedSchool from "@/stores/databse/selectedSchool";
import useSelectedTeacher from "@/stores/databse/selectedTeacher";
// server actions
import { getAllStudents } from "@/actions/data/student/action";
// types
import type { Student } from "@/types/modelType/student";

const StudentList: React.FC = () => {
  const createTaskTemp = useCreateTaskTemp();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const { selectedSchool } = useSelectedSchool();
  const { selectedTeacher, action: selectedTeacherAction } = useSelectedTeacher();

  // 分页
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // 订阅刷新教师列表事件
  useEffect(() => {
    const refreshToken = PubSub.subscribe(
      "refresh-student-list", 
      (_, data) => getStudents(data.school_id, data.teacher_id)
    );

    const searchToken = PubSub.subscribe(
      "show-search-result-student",
      (_, data) => setAllStudents(data)
    );

    return () => {
      PubSub.unsubscribe(refreshToken);
      PubSub.unsubscribe(searchToken);
    }
  }, []);


  // 根据 teacher 对象变动存在 3 种情况：1. 初始化 2. 选中了新的老师 => 清除并重新获取 3. 取消选中老师 => 清除
  useEffect(() => {
    if (!selectedTeacher || selectedTeacherAction === 'search') {
      return
    }

    setAllStudents([]);
    getStudents(selectedSchool!._id, selectedTeacher._id);
  }, [selectedTeacher, page]);
  // 切换老师时，重置页码
  useEffect(() => {
    setPage(1);
  }, [selectedTeacher])

  // Core-Fn: 获取学生列表
  const getStudents = async (school_id: string, teacher_id: string) => {
    setIsFetching(true);

    const res = await getAllStudents(page, 10, school_id, teacher_id);

    if (res?.ok) {
      const students = JSON.parse(res.result);
      setAllStudents(students);
      setTotal(res.total);
    } else {
      toast.error(res?.error);
    }

    setIsFetching(false);
  };


  if (isFetching) return (
    <div className="mt-2 ml-2">
      <Loader size="lg" />
    </div>
  )

  if (!isFetching && allStudents.length === 0) return (
    <div className="mt-6 w-full h-full flex items-center justify-center">
      <NoData />
    </div>
  )

  return (
    <>
      <div className="absolute top-4 right-4">
        <CustomPagination total={total} page={page} onPageChange={setPage} />
      </div>
      <ScrollArea className="flex-1">
        <ul className="p-2 w-full flex flex-col">
          {allStudents.map((student) => (
            <li
              key={student._id}
              className={
                cn(
                  "w-full h-10 px-4 rounded-md",
                  "line-clamp-1 whitespace-nowrap text-sm",
                  "flex items-center justify-between",
                  "hover:bg-primary-foreground cursor-pointer",
                  "group",
                  createTaskTemp.task_target_object.some(obj => obj._id === student._id) && "bg-primary-foreground"
                )
              }
            >
              <div className="flex items-center gap-x-4">
                <span className={createTaskTemp.task_target_object.some(obj => obj._id === student._id) ? "text-muted-foreground" : ""}>
                  {student.student_name}
                </span>
                <ObjectStatusBadge>
                  {student.student_status}
                </ObjectStatusBadge>
              </div>
              <ObjectAction
                objectType="学生"
                object={student}
                href="/database/details/student/"
                className="invisible group-hover:visible"
              />
            </li>
          ))}
        </ul>
      </ScrollArea>
    </>
  );
};

export default StudentList;