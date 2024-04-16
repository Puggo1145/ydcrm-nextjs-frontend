"use client"

// components
import TaskCollector from "./_components/taskCollector";
// utils
import Loader from "@/components/loader";
// hooks
import { useState, useEffect } from "react";
import useCreateTaskTemp from "@/stores/taskcenter/createTaskTemp";
// types
import type { PropsWithChildren } from "react";

const DatabaseLayout: React.FC<PropsWithChildren> = ({ children }) => {
    const [isMounted, setIsMounted] = useState(false);
    const { isCreating } = useCreateTaskTemp();

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) {
        return (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="relative p-4 h-full flex flex-col gap-y-4">
            {
                isCreating &&
                <div className="z-50 fixed bottom-4 right-4">
                    <TaskCollector />
                </div>
            }
            <div className="relative z-0 flex-1">
                {children}
            </div>
        </div>
    );
};

export default DatabaseLayout;