import type { Navigation } from "@/types/dataType/navigation";

export const navigationLinks: Navigation[] = [
    { name: "总览", path: "/dashboard", role: ['super_admin'] },
    { name: "任务中心", path: "/taskcenter", role: ['super_admin', 'admin'] },
    { name: "数据库", path: "/database", role: ['super_admin', 'admin'] },
    { name: "账号管理", path: "/accounts", role: ['super_admin'] },
    
    // employee
    { name: "我的任务", path: "/tasks", role: ['admin', 'employee', 'parttime_employee'] },
];