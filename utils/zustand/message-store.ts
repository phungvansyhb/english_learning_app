import { create } from 'zustand';

type MessageStore = {
    message: string;
    isOpen: boolean;
    setMessage: (msg: string) => void;
    open: () => void;
    close: () => void;
};

export const useMessageStore = create<MessageStore>()((set) => ({
    isOpen: false,
    message: 'This is a demo msg',
    setMessage: (msg: string) => set({ message: msg }),
    open: () => {
        set({ isOpen: true });
        if (typeof window !== 'undefined') {
            window.clearTimeout((window as typeof window & { __stickmanHide?: number }).__stickmanHide);
            (window as typeof window & { __stickmanHide?: number }).__stickmanHide = window.setTimeout(() => {
                set({ isOpen: false });
            }, 3500);
        }
    },
    close: () => {
        if (typeof window !== 'undefined') {
            window.clearTimeout((window as typeof window & { __stickmanHide?: number }).__stickmanHide);
        }
        set({ isOpen: false });
    },
}));
