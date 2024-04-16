"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Plus } from 'lucide-react';
// utils
import Link from "next/link";
import { addDays, format } from "date-fns";
import { toast } from "sonner";
// components
import { DataTable } from "@/components/ui/data-tabel";
import { columns } from "./recent_tasks_column"
// hooks
import { useState, useEffect } from "react";
import useSpinner from "@/hooks/useSpinner";
// server actions
import { getAllTasks } from "@/actions/task/action";
// types
import type { Task } from "@/types/modelType/task";
import type { Account } from "@/types/modelType/user";

export interface AllTask extends Task {
    employee: Pick<Account, '_id' | 'name'>;
}

const RecentTasks: React.FC = () => {

    const { Spinner } = useSpinner({ loadByDefault: true });
    const [tasks, setTasks] = useState<AllTask[]>();

    useEffect(() => {
        getTasks();
    }, []);

    async function getTasks() {
        const formattedFrom = format(addDays(new Date(), -7), 'yyyy-MM-dd');
        const formattedTo = format(addDays(new Date(), 7), 'yyyy-MM-dd');

        try {
            const res = await getAllTasks(
                1,
                10,
                formattedFrom,
                formattedTo,
                "",
                ""
            );

            if (res.ok) {
                const tasks = JSON.parse(res.tasks) as AllTask[];
                setTasks(tasks);
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error('请求失败，请稍后再试');
        }
    }

    return (
        <Card className="mb-8">
            <CardHeader className="flex md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <CardTitle>最近任务</CardTitle>
                <div className="flex items-center space-x-4">
                    <Button asChild>
                        <Link href="/taskcenter/create">
                            <Plus size={20} />发布任务
                        </Link>
                    </Button>
                    <Button variant="secondary" asChild>
                        <Link href="/taskcenter">
                            查看详情
                        </Link>
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                {
                    tasks === undefined ?
                        <div className="w-full h-full flex items-center justify-center">
                            <Spinner size="lg" />
                        </div>
                        :
                        <DataTable columns={columns} data={tasks ?? []} />
                }
            </CardContent>
        </Card>
    );
};

export default RecentTasks;