import { create } from 'zustand';
import type { Teacher } from '@/types/modelType/teacher';

interface SelectedTeacherState {
    selectedTeacher: Teacher | null;
    action: 'get' | 'search'
    setSelectedTeacher: (Teacher: Teacher | null, action?: 'get' | 'search') => void;
}

const useSelectedTeacher = create<SelectedTeacherState>()(set => ({
    selectedTeacher: null,
    action: 'get',
    setSelectedTeacher: (Teacher, action='get') => set({ 
        selectedTeacher: Teacher,
        action
    })
}));

export default useSelectedTeacher;