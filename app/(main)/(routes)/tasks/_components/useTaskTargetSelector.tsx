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

const useTaskTargetlector = () => {
    const [selectedTarget, setSelectedTarget] = useState<string>('全部');
    const targets = ['全部', '班主任', '学生'];

    const TaskTargetSelector = () => (
        <Select value={selectedTarget} onValueChange={(e) => setSelectedTarget(e)}>
            <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
                {
                    targets.map((item, index) => {
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

    return { TaskTargetSelector, selectedTarget }
};

export default useTaskTargetlector;