import { Badge } from "@/components/ui/badge";
import { PropsWithChildren } from "react";
// types
import type { TeacherStatus } from "@/types/modelType/teacher";
import type { StudentStatus } from "@/types/modelType/student";

export type ObjectStatus = TeacherStatus | StudentStatus;

const ObjectStatusBadge: React.FC<PropsWithChildren> = ({ children }) => {
    const ObjectStatusColor: Record<ObjectStatus, string> = {
        '未对接': '#6c6c6c',
        '对接中': '#FF8A00',
        '对接成功': '#30CB5B',
        '对接失败': '#DE1F1F',
        '已联系': '#2563eb',
        '未报名': '#6c6c6c',
        '预报名': '#FF8A00',
        '全费报名': '#30CB5B',
        '已入学': '#6c6c6c',
        '退学退费': '#DE1F1F',
    };

    return (
        <Badge
            className="dark:opacity-70 whitespace-nowrap"
            style={{ backgroundColor: ObjectStatusColor[children as ObjectStatus] }}
        >
            {children}
        </Badge>
    );
};

export default ObjectStatusBadge;