// icons
import { MoveRight } from 'lucide-react';
// types
import { PropsWithChildren } from 'react';

const TempFlag: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            {
                children &&
                <div className='flex items-center gap-4'>
                    <MoveRight size={16} className="text-muted-foreground" />
                    <span className="bg-muted rounded-md px-2 py-1 text-sm text-muted-foreground">
                        {children}
                    </span>
                </div>
            }
        </>
    );
};

export default TempFlag;