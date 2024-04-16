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
// hooks
import { useState, useEffect } from "react";
// stores
import useSelectedSchool from "@/stores/databse/selectedSchool";
// server actions
import { getAllSchools } from "@/actions/data/school/actions";
// types
import type { School } from "@/types/modelType/school";

const SchoolList: React.FC = () => {
    const [isFetching, setIsFetching] = useState(false);
    const [allSchools, setAllSchools] = useState<School[]>([]);
    const { selectedSchool, setSelectedSchool } = useSelectedSchool();

    // 分页
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    // 初始化
    useEffect(() => {
        // 订阅刷新学校列表事件
        const refreshSchoolToken = PubSub.subscribe("refresh-school-list", () => getSchools());
        const showSearchResultToken = PubSub.subscribe(
            "show-search-result-school",
            (_, data) => {
                setAllSchools(data as School[])
            }
        );

        // 组件卸载后清空数据并取消订阅
        return () => {
            setAllSchools([]);
            PubSub.unsubscribe(refreshSchoolToken);
            PubSub.unsubscribe(showSearchResultToken);
        }
    }, []);

    useEffect(() => {
        getSchools();
    }, [page]);


    // Core Fn - 获取学校列表
    const getSchools = async () => {
        setIsFetching(true);
        const res = await getAllSchools(1, 10);

        if (res.ok) {
            const schools = JSON.parse(res.result) as School[];
            setAllSchools(schools);
            setTotal(res.total);
        } else {
            toast.error(res.error);
        }

        setIsFetching(false);
    };


    function selectSchool(school: School) {
        if (selectedSchool?._id === school._id) {
            setSelectedSchool(null);
        } else {
            setSelectedSchool(school);
        }
    }


    if (isFetching) return (
        <div className="mt-2 ml-2 flex items-center">
            <Loader size="lg" />
        </div>
    )

    if (allSchools.length === 0) return (
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
                <ul className="p-2 w-full flex-1 flex flex-col">
                    {allSchools.map((school) => (
                        <li
                            key={school._id}
                            className={
                                cn(
                                    "w-full h-10 px-4 rounded-md",
                                    "line-clamp-1 whitespace-nowrap text-sm",
                                    "flex items-center justify-between",
                                    "hover:bg-primary-foreground cursor-pointer",
                                    "group",
                                    selectedSchool?._id === school._id && "bg-primary text-white hover:bg-primary font-bold"
                                )
                            }
                            onClick={() => selectSchool(school)}
                        >
                            {school.school_name}
                            <ObjectAction
                                href="/database/details/school/"
                                object={school}
                                className={cn("invisible group-hover:visible", selectedSchool?._id === school._id && "text-white")}
                            />
                        </li>
                    ))}
                </ul>
            </ScrollArea>
        </>
    );
};

export default SchoolList;