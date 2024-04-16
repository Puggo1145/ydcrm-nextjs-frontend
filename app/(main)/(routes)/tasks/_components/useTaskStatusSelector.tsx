"use client"

// shadcn
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useState } from "react";

const useTaskStatusSelector = () => {
    const [selectedStatus, setSelectedStatus] = useState<string>('全部');
    const status = ['全部', '进行中', '待审核', '已完成', '已逾期', '需修改'];

    const TaskStatusSelector = () => (
        <Select value={selectedStatus} onValueChange={(e) => setSelectedStatus(e)}>
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
                {
                    status.map((item, index) => {
                        return (
                            <SelectItem
                                key={index}
                                value={item}
                            >
                                {item}
                            </SelectItem>
                        )
                    })
                }
            </SelectContent>
        </Select>
    )

    return { TaskStatusSelector, selectedStatus }
};

export default useTaskStatusSelector;