import { create } from 'zustand';
import type { Student } from '@/types/modelType/student';

interface SelectedStudentState {
    selectedStudent: Student | null;
    setSelectedStudent: (student: Student | null) => void;
}

const useSelectedStudent = create<SelectedStudentState>()(set => ({
    selectedStudent: null,
    setSelectedStudent: student => set({ selectedStudent: student })
}));

export default useSelectedStudent;