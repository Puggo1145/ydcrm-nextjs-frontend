import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
// components
import TaskForm from "./_components/task-form";

const SelectTaskObjectPage: React.FC = () => {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader>
        创建任务
        <CardDescription>
          选择任务对象
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <TaskForm />
      </CardContent>
    </Card>
  );
};

export default SelectTaskObjectPage;