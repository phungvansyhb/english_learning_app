import { createTopic, listTopics } from '@/services/master-data';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page') ?? '1');
    const perPage = Number(searchParams.get('perPage') ?? '10');

    if (!Number.isInteger(page) || page < 1 || !Number.isInteger(perPage) || perPage < 1) {
        return NextResponse.json({ error: 'Invalid pagination' }, { status: 400 });
    }

    try {
        const topics = await listTopics({ page, perPage, search: searchParams.get('search') ?? undefined });
        return NextResponse.json(topics);
    } catch {
        return NextResponse.json({ error: 'Unable to load topics' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as { name?: string };
        const name = body.name?.trim();
        if (!name) return NextResponse.json({ error: 'Topic name is required' }, { status: 400 });
        const topic = await createTopic({ name });
        return NextResponse.json(topic, { status: 201 });
    } catch {
        return NextResponse.json({ error: 'Unable to create topic' }, { status: 500 });
    }
}