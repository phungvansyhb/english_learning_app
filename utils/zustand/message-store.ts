import { create } from 'zustand';
type MessageStore = {
    message: string;
    isOpen: boolean;
    setMessage: (msg: string) => void
    open: () => void
    close: () => void
};

export const useMessageStore = create<MessageStore>()((set) => ({
    isOpen: false,
    message: 'This is a demo msg',
    setMessage: (msg: string) => set({ message: msg }),
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
}));
