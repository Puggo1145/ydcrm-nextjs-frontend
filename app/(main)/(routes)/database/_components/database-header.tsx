"use client"

// shadcn components
import {
    Breadcrumb,
    BreadcrumbList,
} from "@/components/ui/breadcrumb"
// components
import ChooseAddObject from "./choose-add-object";
import useObjectSearch from "./object-search";
// hooks
import useBreadcrum from "@/hooks/useBreadcrum";

const DatabaseHeader: React.FC = () => {
    const breadcrumb = useBreadcrum();
    const { ObjectSearch } = useObjectSearch();

    return (
        <section className="flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between gap-x-8">
                <Breadcrumb>
                    <BreadcrumbList className="text-lg md:text-xl">
                        {breadcrumb}
                    </BreadcrumbList>
                </Breadcrumb>
                <ChooseAddObject />
            </div>
            <ObjectSearch />
        </section>
    );
};

export default DatabaseHeader;