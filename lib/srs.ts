export type SrsRating = 'correct' | 'incorrect';

export type SrsProgressState = {
    srs_stage: number;
    ease_factor: number;
    interval_days: number;
    next_review_at: string;
    last_reviewed_at: string | null;
    correct_count: number;
    wrong_count: number;
    status: 'learning' | 'mastered';
};

const MIN_EASE_FACTOR = 1.3;
const MASTERED_STAGE = 5;

export function calculateNextSrsState(
    current: Partial<SrsProgressState> | null,
    rating: SrsRating,
    now = new Date(),
): SrsProgressState {
    const stage = current?.srs_stage ?? 0;
    const easeFactor = current?.ease_factor ?? 2.5;
    const intervalDays = current?.interval_days ?? 0;
    const isCorrect = rating === 'correct';
    const nextStage = isCorrect ? stage + 1 : 0;
    const nextEaseFactor = isCorrect
        ? Math.min(2.5, easeFactor + (stage === 0 ? 0 : 0.1))
        : Math.max(MIN_EASE_FACTOR, easeFactor - 0.2);
    const nextIntervalDays = isCorrect
        ? stage === 0
            ? 1
            : stage === 1
                ? 3
                : Math.max(1, Math.round(intervalDays * nextEaseFactor))
        : 1;
    const nextReviewAt = new Date(now);
    nextReviewAt.setDate(nextReviewAt.getDate() + nextIntervalDays);

    return {
        srs_stage: nextStage,
        ease_factor: nextEaseFactor,
        interval_days: nextIntervalDays,
        next_review_at: nextReviewAt.toISOString(),
        last_reviewed_at: now.toISOString(),
        correct_count: (current?.correct_count ?? 0) + (isCorrect ? 1 : 0),
        wrong_count: (current?.wrong_count ?? 0) + (isCorrect ? 0 : 1),
        status: nextStage >= MASTERED_STAGE ? 'mastered' : 'learning',
    };
}