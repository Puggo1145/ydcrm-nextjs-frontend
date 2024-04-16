import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from "@/components/ui/pagination"
// icons
import { ChevronLeft, ChevronRight } from "lucide-react"


interface Props {
    total: number
    page: number
    onPageChange: (page: number) => void
}

const CustomPagination: React.FC<Props> = ({ total, page, onPageChange }) => {

    const prevPage = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    }

    const nextPage = () => {
        if (page < total) {
            onPageChange(page + 1);
        }
    }

    return (
        <Pagination>
            <PaginationContent className="h-7">
                <PaginationItem onClick={prevPage} className="cursor-pointer">
                    <ChevronLeft />
                </PaginationItem>
                <PaginationItem>
                    {page} / {total}
                </PaginationItem>
                <PaginationItem onClick={nextPage} className="cursor-pointer">
                    <ChevronRight />
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    );
};

export default CustomPagination;