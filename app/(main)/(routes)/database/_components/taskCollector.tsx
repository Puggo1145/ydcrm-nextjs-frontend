import { cn } from "@/lib/utils";
// icons
import {
  X,
  AlignJustify
} from "lucide-react";
// components
import { Button } from "@/components/ui/button";
import SelectedObject from "../../taskcenter/create/_components/selected-object";
// hooks
import useCreateTaskTemp from "@/stores/taskcenter/createTaskTemp";
import { useState } from "react";
import { useRouter } from "next-nprogress-bar";

const TaskCollector: React.FC = () => {
  const router = useRouter();

  const { task_target, task_target_object, removeTaskTargetObject } = useCreateTaskTemp();
  const [isListCollapsed, setIsListCollapsed] = useState<boolean>(false);

  return (
    <div className="p-4 w-[330px] rounded-xl bg-background border drop-shadow-sm">
      <section
        className={cn([
          isListCollapsed ? "border-b h-[300px] mb-4" : "h-0",
          "overflow-hidden transition-all duration-500",
          "flex flex-col"
        ])}
      >
        {
          task_target_object.map((object) => (
            <li
              className="flex items-center justify-between"
              key={object._id}
            >
              <SelectedObject
                object={object}
                task_target={task_target!}
              />
              <Button
                type="button"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => removeTaskTargetObject(object)}
              >
                <X size={16} />
              </Button>
            </li>
          ))
        }
      </section>
      <div
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-x-4">
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent"
            onClick={() => setIsListCollapsed(!isListCollapsed)}
          >
            <AlignJustify size={24} className={isListCollapsed ? "text-primary" : "text-muted-foreground"} />
          </Button>
          <div>
            <span className="text-xs leading-none text-muted-foreground">正在创建任务</span>
            <p className="text-sm">
              已选择 {task_target_object.length} 名{task_target}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push('/taskcenter/create')}>
          选择完成
        </Button>
      </div>
    </div>
  );
};

export default TaskCollector;