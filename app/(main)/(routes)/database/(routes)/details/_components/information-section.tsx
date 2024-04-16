interface Props {
    children: React.ReactNode;
    title: "基础信息" | "状态信息" | "备注";
}

const InformationSection: React.FC<Props> = ({ children, title }) => {
    return (
        <li className="flex flex-col gap-4 md:flex-row md:gap-x-16 border-t py-4">
            <h2 className="w-[164px] text-xl font-bold">
                {title}
            </h2>
            <section className="space-y-4">
                {children}
            </section>
        </li>
    );
};

export default InformationSection;