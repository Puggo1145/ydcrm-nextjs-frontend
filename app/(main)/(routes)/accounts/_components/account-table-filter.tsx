"use client"

// shadcn
import { Input } from '@/components/ui/input'

// types
import type { Table } from "@tanstack/react-table"

interface DataTableToolbarProps<TData> {
    table: Table<TData>
}

export default function AccountTableFilter<TData>(
    { table }: DataTableToolbarProps<TData>
) {
    return (
        <section className="w-full flex items-center justify-between gap-x-4">
            {/* Filter */}
            <Input
                placeholder="输入员工姓名以查询"
                value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                className="max-w-sm"
            />
        </section>
    );
}