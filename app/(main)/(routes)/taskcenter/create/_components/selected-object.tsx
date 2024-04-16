// components
import ObjectStatusBadge from "@/components/object-status-badge";
// types
import type { StudentObject } from "@/stores/taskcenter/createTaskTemp";
import type { TeacherObject } from "@/stores/taskcenter/createTaskTemp";

interface Props {
    object: StudentObject | TeacherObject;
    task_target: string;
}

const SelectedObject: React.FC<Props> = ({ object, task_target }) => {
    return (
        <div className="flex items-center gap-x-4 text-sm">
            {
                task_target === "学生" ?
                    (
                        <>
                            <span>
                                {(object as StudentObject).student_name}
                            </span>
                            <ObjectStatusBadge>
                                {(object as StudentObject).student_status}
                            </ObjectStatusBadge>
                        </>
                    ) :
                    (
                        <>
                            <span>{
                                (object as TeacherObject).teacher_name}
                            </span>
                            <ObjectStatusBadge>
                                {(object as TeacherObject).teacher_status}
                            </ObjectStatusBadge>
                        </>
                    )
            }
        </div>
    );
};

export default SelectedObject;