export function createGrammarSlug(id: number, name: string) {
    const normalizedName = name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    return `${id}-${normalizedName || 'lesson'}`;
}

export function getGrammarIdFromSlug(slug: string) {
    const match = /^(\d+)(?:-|$)/.exec(slug);
    return match ? Number(match[1]) : null;
}

export function getDifficultyTone(label: string) {
    const normalizedLabel = label.toLowerCase();
    if (normalizedLabel.includes('beginner') || normalizedLabel.includes('basic')) {
        return 'bg-brand-mint text-brand-mint-foreground';
    }
    if (normalizedLabel.includes('advanced') || normalizedLabel.includes('upper')) {
        return 'bg-brand-pink/15 text-foreground';
    }
    return 'bg-brand-purple-soft text-foreground';
}
