import TaskModel from "@/models/tasks";

async function checkTaskDeadline(employee?: string) {
    const currentTime = new Date();
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {
        deadline: { $lt: currentTime },
        status: "进行中"
    }
    
    if (employee) {
        query["employee"] = employee
    }

    await TaskModel.updateMany(
        query,
        { status: "已逾期" }
    )
}

export default checkTaskDeadline;