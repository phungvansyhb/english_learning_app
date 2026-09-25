import { getListQuestionByTopic, type PracticeQuestion } from '@/services/question';
import { create } from 'zustand';

type PracticeStore = {
    index: number;
    isLoading: boolean;
    questions: PracticeQuestion[];
    next: () => void;
    resetIndex: () => void;
    getQuestion: (topicId: string, page: number) => void;
};

export const usePracticeStore = create<PracticeStore>()((set) => ({
    isLoading: false,
    index: 0,
    questions: [],
    getQuestion: async (topicId: string, pageNumber: number) => {
        set({ isLoading: true, index: 0 });
        const data = await getListQuestionByTopic(topicId, pageNumber);
        set({ questions: data, isLoading: false, index: 0 });
    },
    next: () => {
        set((state) => ({
            index: state.questions.length > 0 ? (state.index + 1) % state.questions.length : 0,
        }))
    },
    resetIndex: () => set({ index: 0 }),
}));
