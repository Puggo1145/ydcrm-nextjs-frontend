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
import { Search } from "lucide-react";

const TaskSearch: React.FC = () => {
    return (
        <div className="flex items-center justify-between gap-x-8">
            <div className="flex gap-x-2">
                <div className="flex gap-x-2">
                    <Select>
                        <SelectTrigger className="w-[128px]">
                            <SelectValue placeholder="全部" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">全部</SelectItem>
                            <SelectItem value="school">学校</SelectItem>
                            <SelectItem value="teacher">班主任</SelectItem>
                            <SelectItem value="student">学生</SelectItem>
                        </SelectContent>
                    </Select>
                    <Input placeholder="输入姓名以搜索..." />
                </div>
                <Button variant="secondary"><Search /></Button>
            </div>
        </div>
    );
};

export default TaskSearch;