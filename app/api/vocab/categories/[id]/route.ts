import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
	deleteUserVocabCategory,
	getUserVocabCategory,
	updateUserVocabCategory,
} from '@/services/user-vocab-category';

type RouteContext = { params: Promise<{ id: string }> };

function parseId(value: string) {
	const id = Number(value);
	if (!Number.isSafeInteger(id) || id < 1) throw new Error('INVALID_ID');
	return id;
}

const updateSchema = z
	.object({
		name: z.string().trim().min(1).max(100).optional(),
		description: z.string().trim().max(500).nullable().optional(),
	})
	.refine((value) => value.name !== undefined || value.description !== undefined, {
		message: 'At least one field is required',
	});

function errorResponse(error: unknown) {
	if (error instanceof Error) {
		if (error.message === 'UNAUTHORIZED') {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
		}
		if (error.message === 'INVALID_ID') {
			return NextResponse.json({ error: 'Invalid category id' }, { status: 400 });
		}
	}

	console.error('User vocab category API error', error);
	return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export async function GET(_request: Request, context: RouteContext) {
	try {
		const { id: rawId } = await context.params;
		const data = await getUserVocabCategory(parseId(rawId));
		if (!data) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		return NextResponse.json({ data });
	} catch (error) {
		return errorResponse(error);
	}
}

export async function PATCH(request: Request, context: RouteContext) {
	try {
		const { id: rawId } = await context.params;
		const updates = updateSchema.parse(await request.json());
		const data = await updateUserVocabCategory(parseId(rawId), updates);
		if (!data) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		return NextResponse.json({ data });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.flatten() }, { status: 400 });
		}
		return errorResponse(error);
	}
}

export async function DELETE(_request: Request, context: RouteContext) {
	try {
		const { id: rawId } = await context.params;
		const data = await deleteUserVocabCategory(parseId(rawId));
		if (!data) return NextResponse.json({ error: 'Category not found' }, { status: 404 });
		return NextResponse.json({ data });
	} catch (error) {
		return errorResponse(error);
	}
}