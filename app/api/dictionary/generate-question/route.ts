import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateQuestion } from '@/services/aidictionary';

const requestSchema = z.object({
    topicId: z.number(),
});

export async function POST(request: Request) {
    try {
        const body = requestSchema.parse(await request.json());
        const data = await generateQuestion(body.topicId, 15);
        return NextResponse.json({ data });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'A valid topic ID are required' }, { status: 400 });
        }
        console.error('Dictionary generation failed', error);
        return NextResponse.json({ error: 'Unable to generate word' }, { status: 500 });
    }
}

