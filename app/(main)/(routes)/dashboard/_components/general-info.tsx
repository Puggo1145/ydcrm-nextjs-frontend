"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
// hooks
import { useState, useEffect } from "react";
// utils
import { toast } from "sonner";
// server actions
import { getStudentGeneralInfo } from "@/actions/statistics/student/actions";
import { getTeacherGeneralInfo } from "@/actions/statistics/teacher/action";
// types
import type { GeneralInfo } from "@/types/dataType/general-info";

const GeneralInfo = ({ object }: { object: 'teacher' | 'student' }) => {
    const [generalInfo, setGeneralInfo] = useState<GeneralInfo[]>();

    const getGeneralInfo = async () => {
        const res = 
            object === 'teacher' ? 
            await getTeacherGeneralInfo() : 
            await getStudentGeneralInfo();
        
        if (res.ok) {
            const data = JSON.parse(res.result);
            setGeneralInfo([
                { 
                    name: "today_increment", 
                    alias: "今日新增", 
                    quantity: data.today_increment, 
                },
                { 
                    name: "week_increment", 
                    alias: "本周新增", 
                    quantity: data.week_increment, 
                },
                { 
                    name: "total", 
                    alias: "累计", 
                    quantity: data.total,
                },
                { 
                    name: "month_target", 
                    alias: "本月目标", 
                    quantity: 0 
                },
            ])
        } else {
            toast.error(res.error);
        }
    }

    useEffect(() => {
        getGeneralInfo();
    }, [object]);

    return (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {
                !generalInfo && (
                    <div>
                        正在加载中...
                    </div>
                )
            }
            {
                generalInfo &&
                generalInfo.map((item) => {
                    return (
                        <Card key={item.name} className="relative">
                            <CardHeader className="space-y-0 pb-2">
                                <CardTitle className="text-md font-bold">
                                    {item.alias}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {item.quantity}
                                </div>
                                {
                                    item.comparison && (
                                        <p className="
                                            text-xs text-muted-foreground absolute right-6 top-1/2 -translate-y-1/2
                                            py-2 px-4 bg-primary/5 rounded-full font-bold opacity-80"
                                            style={{
                                                color: item.comparison >= 0 ? "#30cb5b" : "#ff9213",
                                                backgroundColor: item.comparison >= 0 ? "#c9ffd8" : "#ffdbb1",
                                            }}
                                        >
                                            {item.comparison >= 0 ? '+' : '-'} {item.comparison * 100}%
                                        </p>
                                    )
                                }
                            </CardContent>
                        </Card>
                    )
                })
            }
        </section>
    );
};

export default GeneralInfo;