import { create } from 'zustand'

/**
 * Normalize a selection into a comparable term: trim, lowercase, collapse
 * inner whitespace and strip leading/trailing punctuation so "Switch." and
 * "switch" resolve to the same entry.
 */
export function normalizeTerm(raw: string): string {
    return raw
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
}

type LookedUpState = {
    /** Normalized terms the user has already looked up. */
    words: string[]
    /** Record a term as looked up (no-op for duplicates/empty). */
    markLookedUp: (word: string) => void
    /** Whether a term has been looked up before. */
    isLookedUp: (word: string) => boolean
    /** Forget every looked-up term. */
    clear: () => void
}

export const useLookedUpStore = create<LookedUpState>()((set, get) => ({
    words: [],
    markLookedUp: (word) => {
        const term = normalizeTerm(word)
        if (!term) return
        set((state) =>
            state.words.includes(term) ? state : { words: [...state.words, term] },
        )
    },
    isLookedUp: (word) => get().words.includes(normalizeTerm(word)),
    clear: () => set({ words: [] }),
}))
