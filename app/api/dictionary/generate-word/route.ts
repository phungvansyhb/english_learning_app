import { NextResponse } from 'next/server';
import { z } from 'zod';
import { generateWord, translate } from '@/services/aidictionary';

const requestSchema = z.object({
    wordNumber: z.number().min(1).max(20),
    topicId: z.number(),
});

export async function POST(request: Request) {
    try {
        const body = requestSchema.parse(await request.json());
        const data = await generateWord(body.wordNumber, body.topicId);
        return NextResponse.json({ data });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'A valid word number and topic ID are required' }, { status: 400 });
        }
        console.error('Dictionary generation failed', error);
        return NextResponse.json({ error: 'Unable to generate word' }, { status: 500 });
    }
}

