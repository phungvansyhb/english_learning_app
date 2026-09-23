import { getListQuestionByTopic, type PracticeQuestion } from '@/services/question';
import { create } from 'zustand';

type PracticeStore = {
    index: number;
    isLoading: boolean;
    questions: PracticeQuestion[];
    next: () => void;
    getQuestion: (topicId: string, page: number) => void;
};

export const usePracticeStore = create<PracticeStore>()((set) => ({
    isLoading: false,
    index: 0,
    questions: [],
    getQuestion: async (topicId: string, pageNumber: number) => {
        set({ isLoading: true })
        const data = await getListQuestionByTopic(topicId, pageNumber)
        set({ questions: data, isLoading: false });
    },
    next: () => set((state) => ({ index: state.index + 1 })),
}));
