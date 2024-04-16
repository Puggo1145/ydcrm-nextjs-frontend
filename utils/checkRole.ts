import { getServerSession } from "next-auth";
import { authOptions } from "@/constants/authOptions";
// types
import type { Session } from "next-auth";
import type { role } from "@/types/modelType/user";

async function checkRoles(allowedRole: role[]) {
    const session: Session | null = await getServerSession({ ...authOptions }) as Session;
    const role = session?.user?.role as role;

    return allowedRole.includes(role);
}

export default checkRoles;