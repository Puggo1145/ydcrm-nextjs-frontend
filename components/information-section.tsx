interface Props {
    children: React.ReactNode;
    title: string;
    desc?: string;
}

const InformationSection: React.FC<Props> = ({ children, title, desc }) => {
    return (
        <li className="flex flex-col gap-4 md:flex-row md:gap-x-16 border-t py-4">
            <div className="w-[164px]">
                <h2 className="text-xl font-bold">
                    {title}
                </h2>
                <p className="text-sm text-muted-foreground">
                    {desc}
                </p>
            </div>
            <section className="w-full md:w-1/2 space-y-6">
                {children}
            </section>
        </li>
    );
};

export default InformationSection;