import { create } from "zustand";

import type { School } from "@/types/modelType/school";
import type { Teacher } from "@/types/modelType/teacher";
import type { Student } from "@/types/modelType/student";

type CurrentObject = School & Teacher & Student;

interface State {
    currentObject: CurrentObject | null;
    setCurrentObject: (currentObject: CurrentObject | null) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useCurrentObject = create<State>()((set) => ({
    currentObject: null,
    setCurrentObject: (currentObject) => set({ currentObject }),
}));

export default useCurrentObject;