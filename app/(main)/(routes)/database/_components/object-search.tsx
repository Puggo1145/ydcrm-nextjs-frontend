"use client"

// shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// icons
import { Search, X } from "lucide-react";
// hooks
import { useState, useRef } from "react";
import useSelectedSchool from "@/stores/databse/selectedSchool";
import useSelectedTeacher from "@/stores/databse/selectedTeacher";
import useSpinner from "@/hooks/useSpinner";
// utils
import PubSub from "pubsub-js";
import { toast } from "sonner";
// server actions
import { getAllSchools } from "@/actions/data/school/actions";
import { getAllTeachers } from "@/actions/data/teacher/action";
import { getAllStudents } from "@/actions/data/student/action";
// types
import { Teacher } from "@/types/modelType/teacher";
import { Student } from "@/types/modelType/student";

const useObjectSearch = () => {
    const { Spinner, loading, setLoading } = useSpinner();

    const { setSelectedSchool } = useSelectedSchool();
    const { setSelectedTeacher } = useSelectedTeacher();

    const [searchResult, setSearchResult] = useState<(Teacher & Student)[]>([]);

    const [object, setObject] = useState<string>();
    const keywordsRef = useRef<HTMLInputElement>(null);

    async function searchObject() {
        const keywords = keywordsRef.current?.value;

        if (!object) return toast.error("请选择查询对象")
        if (!keywords) return toast.error("请输入查询对象名称")

        try {
            setLoading(true);

            let res;
            if (object === 'school') {
                res = await getAllSchools(1, 10, keywords);
            } else if (object === 'teacher') {
                res = await getAllTeachers(1, 10, null, keywords);
            } else if (object === 'student') {
                res = await getAllStudents(1, 10, null, null, keywords);
            }

            if (res!.ok) {
                const result = JSON.parse(res!.result);

                if (object === 'school') {
                    if (result.length === 0) return toast.info("没有搜索到目标学校");

                    PubSub.publish('show-search-result-school', result);
                    setSelectedSchool(null);
                    setSelectedTeacher(null);
                } else if (object === 'teacher') {
                    if (result.length === 0) return toast.info("没有搜索到目标班主任");
                    if (result.length > 1) return setSearchResult(result)

                    // 如果精确匹配到，则直接返回
                    PubSub.publish('show-search-result-teacher', result);
                    setSelectedSchool(result[0].school_id, 'search');
                    setSelectedTeacher(null);
                } else if (object === 'student') {
                    if (result.length === 0) return toast.info("没有搜索到目标学生");
                    if (result.length > 1) return setSearchResult(result)

                    // 如果精确匹配到，则直接返回
                    PubSub.publish('show-search-result-student', result);
                    PubSub.publish('show-search-result-teacher', [result[0].teacher_id]);
                    setSelectedSchool(result[0].school_id, 'search');
                    setSelectedTeacher(result[0].teacher_id, 'search');
                }
            } else {
                toast.error(res?.error)
            }
        } catch (err) {
            toast.error("请检查网络")
        } finally {
            setLoading(false);
        }
    }

    function resetSearchAction() {
        setSelectedSchool(null);
        setSelectedTeacher(null);
        PubSub.publish('refresh-school-list');
    }

    function pushTeacher(result: Teacher) {
        PubSub.publish('show-search-result-teacher', [result]);
        setSelectedSchool(result.school_id, 'search');
        setSelectedTeacher(null);
    }

    function pushStudent(result: Student) {
        PubSub.publish('show-search-result-student', [result]);
        PubSub.publish('show-search-result-teacher', [result.teacher_id]);
        setSelectedSchool(result.school_id, 'search');
        setSelectedTeacher(result.teacher_id, 'search');
    }

    const ObjectSearch = () => (
        <div className="flex items-center justify-between gap-x-8">
            <div className="flex gap-x-2">
                <div className="relative z-40 flex gap-x-2">
                    <Select value={object} onValueChange={val => setObject(val)}>
                        <SelectTrigger className="w-[128px]">
                            <SelectValue placeholder="请选择" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="cursor-pointer" value="school">学校</SelectItem>
                            <SelectItem className="cursor-pointer" value="teacher">班主任</SelectItem>
                            <SelectItem className="cursor-pointer" value="student">学生</SelectItem>
                        </SelectContent>
                    </Select>
                    <section className="relative">
                        <Input 
                            placeholder="输入对象名称以搜索..." 
                            ref={keywordsRef}
                        />
                        {
                            searchResult.length > 1 &&
                            <div className="absolute z-50 top-12 -left-1/2 md:left-0 w-[300px] border bg-background rounded-md">
                                <div className="flex items-center justify-between px-4 py-2 border-b">
                                    <p className="text-sm font-bold">查询到多个相匹配的对象：</p>
                                    <Button
                                        className="p-2"
                                        variant="ghost"
                                        onClick={() => setSearchResult([])}
                                    >
                                        <X size={16} className="text-muted-foreground" />
                                    </Button>
                                </div>
                                <ul className="flex flex-col pb-2">
                                    {
                                        searchResult.map(item => {
                                            return (
                                                object === 'teacher' ?
                                                    (
                                                        <li
                                                            className="cursor-pointer px-4 p-2 w-full hover:bg-secondary space-x-2"
                                                            onClick={() => pushTeacher(item)}
                                                        >
                                                            <span className="text-sm">{item.teacher_name}</span>
                                                            <span className="text-xs text-foreground">-{item.school_id.school_name}</span>
                                                        </li>
                                                    )
                                                    :
                                                    (
                                                        <li
                                                            className="cursor-pointer px-4 p-2 w-full hover:bg-secondary"
                                                            onClick={() => pushStudent(item)}
                                                        >
                                                            <span className="text-sm">{item.student_name}</span>
                                                            <span className="text-xs text-foreground">-{item.teacher_id.teacher_name}-{item.school_id.school_name}</span>
                                                        </li>
                                                    )
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        }
                    </section>
                </div>
                <Button
                    variant="secondary"
                    onClick={searchObject}
                    disabled={loading}
                >
                    {loading ? <Spinner size="default" /> : <Search />}
                </Button>
                <Button
                    variant={"secondary"}
                    onClick={resetSearchAction}
                >
                    重置
                </Button>
            </div>
        </div>
    )

    return { ObjectSearch };
};

export default useObjectSearch;