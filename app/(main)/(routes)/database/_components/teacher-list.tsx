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
// stores
import useSelectedSchool from "@/stores/databse/selectedSchool";
import useSelectedTeacher from "@/stores/databse/selectedTeacher";
import useCreateTaskTemp from "@/stores/taskcenter/createTaskTemp";
// server actions
import { getAllTeachers } from "@/actions/data/teacher/action";
// types
import type { Teacher } from "@/types/modelType/teacher";

const TeacherList: React.FC = () => {
    const createTaskTemp = useCreateTaskTemp();

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
    const { selectedSchool, action: selectedSchoolAction } = useSelectedSchool();
    const { selectedTeacher, setSelectedTeacher } = useSelectedTeacher();

    // 分页
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // 订阅列表刷新事件
    useEffect(() => {
        const refreshToken = PubSub.subscribe("refresh-teacher-list", (_, data) => getTeachers(data.school_id));
        const searchToken = PubSub.subscribe(
            "show-search-result-teacher",
            (_, data) => {
                setAllTeachers(data as Teacher[])
            }
        )

        return () => {
            PubSub.unsubscribe(refreshToken);
            PubSub.unsubscribe(searchToken);
        }
    }, []);

    // 根据 school 对象变动存在3种情况：1. 初始化 2. 选中了新的学校 => 清除并重新获取 3. 取消选中学校 => 清除
    useEffect(() => {
        if (!selectedSchool || selectedSchoolAction === 'search') return;

        setSelectedTeacher(null);
        setAllTeachers([]);
        getTeachers(selectedSchool._id);
    }, [selectedSchool, page]);
    // 切换学校时，重置分页
    useEffect(() => {
        setPage(1);
    }, [selectedSchool]);

    // Core-Fn: 获取班主任列表
    const getTeachers = async (school_id: string) => {
        setIsFetching(true);
        const res = await getAllTeachers(page, 10, school_id);

        if (res.ok) {
            const teachers = JSON.parse(res.result) as Teacher[];
            setAllTeachers(teachers);
            setTotal(res.total);
        } else {
            toast.error(res.error);
        }

        setIsFetching(false);
    };


    function selectTeacher(teacher: Teacher) {
        if (selectedTeacher?._id === teacher._id) {
            setSelectedTeacher(null);
        } else {
            setSelectedTeacher(teacher);
        }
    }

    if (isFetching) return (
        <div className="mt-2 ml-2">
            <Loader size="lg" />
        </div>
    )

    if (allTeachers.length === 0) return (
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
                    {allTeachers.map((teacher) => (
                        <li
                            key={teacher._id}
                            className={
                                cn(
                                    "w-full h-10 px-4 rounded-md",
                                    "line-clamp-1 whitespace-nowrap text-sm",
                                    "flex items-center justify-between",
                                    "hover:bg-primary-foreground cursor-pointer",
                                    "group",
                                    selectedTeacher?._id === teacher._id && "bg-primary text-white hover:bg-primary",
                                    createTaskTemp.task_target_object.some(obj => obj._id === teacher._id) && "bg-primary-foreground"
                                )
                            }
                            onClick={() => selectTeacher(teacher)}
                        >
                            <div className="flex items-center gap-x-4">
                                <span className={createTaskTemp.task_target_object.some(obj => obj._id === teacher._id) ? "text-muted-foreground" : ""}>
                                    {teacher.teacher_name}
                                </span>
                                <ObjectStatusBadge>
                                    {teacher.teacher_status}
                                </ObjectStatusBadge>
                            </div>
                            <ObjectAction
                                objectType="班主任"
                                object={teacher}
                                href="/database/details/teacher/"
                                className={cn("invisible group-hover:visible", selectedTeacher?._id === teacher._id && "text-white")}
                            />
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </>
    );
};

export default TeacherList;