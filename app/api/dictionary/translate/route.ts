import { NextResponse } from 'next/server';
import { z } from 'zod';
import { translate } from '@/services/aidictionary';

const requestSchema = z.object({
    word: z.string().trim().min(1).max(60),
});

export async function POST(request: Request) {
    try {
        const body = requestSchema.parse(await request.json());
        const data = await translate(body.word);
        return NextResponse.json({ data });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'A valid word is required' }, { status: 400 });
        }

        console.error('Dictionary translation failed', error);
        return NextResponse.json({ error: 'Unable to translate word' }, { status: 500 });
    }
}