"use client"

// shadcn
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { columns } from "./_components/tasks_column"
// icons
import {
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
// components
import DatePicker from "@/components/date-picker";
import { DataTable } from "@/components/ui/data-tabel";
import useTaskStatusSelector from "../tasks/_components/useTaskStatusSelector";
import useTaskTargetlector from "../tasks/_components/useTaskTargetSelector";
// hooks
import { useState, useEffect } from "react";
import useSpinner from "@/hooks/useSpinner";
// utils
import Link from "next/link";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import PubSub from "pubsub-js";
// server actions
import { getAllTasks } from "@/actions/task/action";
// types
import type { Task } from "@/types/modelType/task";
import type { Account } from "@/types/modelType/user";
import type { DateRange } from "react-day-picker";

export interface AllTask extends Omit<Task, 'task_target_object'> {
  employee: Pick<Account, '_id' | 'name'>;
}

const TaskCenterPage: React.FC = () => {
  // component initialization
  const { Spinner } = useSpinner({ loadByDefault: true });
  const { TaskStatusSelector, selectedStatus } = useTaskStatusSelector();
  const { TaskTargetSelector, selectedTarget } = useTaskTargetlector();
  const queryComponents = [
    { name: "任务状态", component: TaskStatusSelector },
    { name: "任务对象", component: TaskTargetSelector },
  ]

  const [tasks, setTasks] = useState<AllTask[]>();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState<number>(0);
  const [date, setDate] = useState<DateRange>({
    from: addDays(new Date(), -7),
    to: addDays(new Date(), 7),
  });

  useEffect(() => {
    const token = PubSub.subscribe("refresh-task-list", () => getTasks());

    return () => {
      PubSub.unsubscribe(token);
    }
  }, []);

  useEffect(() => {
    if (date && date.from && date.to) {
      setTasks(undefined);
      getTasks();
    }
  }, [date, page, selectedStatus, selectedTarget]);

  async function getTasks() {
    try {
      const formattedFrom = format(date.from as Date, 'yyyy-MM-dd');
      const formattedTo = format(date.to as Date, 'yyyy-MM-dd');

      const res = await getAllTasks(
        page, 
        10, 
        formattedFrom, 
        formattedTo, 
        selectedStatus === '全部' ? '' : selectedStatus, 
        selectedTarget === '全部' ? '' : selectedTarget
      );

      if (res.ok) {
        const tasks = JSON.parse(res.tasks) as AllTask[];
        setTasks(tasks);
        setTotal(res.total);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error('请求失败，请稍后再试');
    }
  }

  return (
    <Card className="flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-col gap-y-4">
        <div className="w-full flex flex-col items-start md:flex-row md:items-center justify-between gap-4">
          <CardTitle>全部任务</CardTitle>
          <Button asChild>
            <Link href="/taskcenter/create">
              <Plus />
              创建任务
            </Link>
          </Button>
        </div>
        <ul className="flex items-center gap-6 flex-wrap">
          <li className="space-y-2">
            <span className="text-muted-foreground text-sm">
              截止时间
            </span>
            <DatePicker date={date} setDate={setDate} />
          </li>
          <li className="flex items-center gap-6">
            {
              queryComponents.map(item => {
                return (
                  <div
                    className="space-y-2"
                    key={item.name}
                  >
                    <span className="text-muted-foreground text-sm">
                      {item.name}
                    </span>
                    <item.component />
                  </div>
                )
              })
            }
          </li>
        </ul>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4">
        {
          tasks === undefined ?
            <div className="w-full h-full flex items-center justify-center">
              <Spinner size="lg" />
            </div>
            :
            <DataTable columns={columns} data={tasks ?? []} />
        }

        {/* Pagination */}
        <section className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft />
          </Button>
          <span>
            {page} / {total === 0 ? "..." : total}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= total}
          >
            <ChevronRight />
          </Button>
        </section>
      </CardContent>
    </Card>
  );
};

export default TaskCenterPage;