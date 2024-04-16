import { create } from 'zustand';
import type { School } from '@/types/modelType/school';

interface SelectedSchoolState {
    selectedSchool: School | null;
    action: 'get' | 'search',
    setSelectedSchool: (school: School | null, action?: 'get' | 'search') => void;
}

const useSelectedSchool = create<SelectedSchoolState>()(set => ({
    selectedSchool: null,
    action: 'get',
    setSelectedSchool: (school, action='get') => set({ 
        selectedSchool: school, 
        action
    })
}));

export default useSelectedSchool;