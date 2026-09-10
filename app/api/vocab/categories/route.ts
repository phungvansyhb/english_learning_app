import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
	createUserVocabCategory,
	listUserVocabCategories,
} from '@/services/user-vocab-category';

const createSchema = z.object({
	name: z.string().trim().min(1).max(100),
	description: z.string().trim().max(500).nullable().optional(),
});

function errorResponse(error: unknown) {
	if (error instanceof Error && error.message === 'UNAUTHORIZED') {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	console.error('User vocab category API error', error);
	return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(request: Request) {
	try {
		const search = new URL(request.url).searchParams.get('search') ?? undefined;
		const data = await listUserVocabCategories({ search });
		return NextResponse.json({ data });
	} catch (error) {
		return errorResponse(error);
	}
}

export async function POST(request: Request) {
	try {
		const input = createSchema.parse(await request.json());
		const data = await createUserVocabCategory(input);
		return NextResponse.json({ data }, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.flatten() }, { status: 400 });
		}
		return errorResponse(error);
	}
}