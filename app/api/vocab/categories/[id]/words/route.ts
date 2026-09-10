import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
	addWordToCategory,
	listCategoryWords,
	removeWordFromCategory,
} from '@/services/user-vocab-category';

type RouteContext = { params: Promise<{ id: string }> };

const wordSchema = z.object({ wordId: z.number().int().positive() });

function parseId(value: string) {
	const id = Number(value);
	if (!Number.isSafeInteger(id) || id < 1) throw new Error('INVALID_ID');
	return id;
}

function errorResponse(error: unknown) {
	if (error instanceof Error) {
		if (error.message === 'UNAUTHORIZED') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		if (error.message === 'CATEGORY_NOT_FOUND') {
			return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		}
		if (error.message === 'INVALID_ID') {
			return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
		}
	}

	console.error('User vocab category words API error', error);
	return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(_request: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const data = await listCategoryWords(parseId(id));
		return NextResponse.json({ data });
	} catch (error) {
		return errorResponse(error);
	}
}

export async function POST(request: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const { wordId } = wordSchema.parse(await request.json());
		const data = await addWordToCategory(parseId(id), wordId);
		return NextResponse.json({ data }, { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.flatten() }, { status: 400 });
		}
		return errorResponse(error);
	}
}

export async function DELETE(request: Request, context: RouteContext) {
	try {
		const { id } = await context.params;
		const { wordId } = wordSchema.parse(await request.json());
		const data = await removeWordFromCategory(parseId(id), wordId);
		if (!data) return NextResponse.json({ error: 'Word is not in category' }, { status: 404 });
		return NextResponse.json({ data });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.flatten() }, { status: 400 });
		}
		return errorResponse(error);
	}
}