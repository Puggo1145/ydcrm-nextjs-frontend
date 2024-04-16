import React from "react";
import { Badge } from "@/components/ui/badge";

interface Props {
    children?: React.ReactNode;
    desc?: string;
    type: '学校' | '班主任' | '学生'
}

const Name: React.FC<Props> = ({ children, desc, type }) => {
    return (
        <section className="py-4 space-y-1">
            <div className="flex items-end gap-4">
                <h1 className="text-3xl md:text-4xl font-bold">
                    {children}
                </h1>
                <Badge className="mb-[6px]" variant="default">
                    {type}
                </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{desc || ''}</p>
        </section>
    );
};

export default Name;