import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react';
// types
import type { Table } from "@tanstack/react-table"

interface PaginationProps<TData> {
    table: Table<TData>
}

// TODO: 改造成由 server 端控制分页
export default function Pagination<TData>(
    { table }: PaginationProps<TData>
) {
    return (
        <section className="flex items-center justify-end space-x-2 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                <ChevronLeft />
            </Button>
            <div>
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()} 
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                <ChevronRight />
            </Button>
        </section>
    );
}