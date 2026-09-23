import { getListQuestionByTopic } from '@/services/question';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic') ?? 'all';
    const page = Number(searchParams.get('page') ?? '1');

    if (!Number.isInteger(page) || page < 1) {
        return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
    }

    try {
        const questions = await getListQuestionByTopic(topic, page);
        return NextResponse.json(questions);
    } catch {
        return NextResponse.json({ error: 'Unable to load practice questions' }, { status: 500 });
    }
}