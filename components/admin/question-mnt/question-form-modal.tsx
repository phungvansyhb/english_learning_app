'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateQuestionInput, QuestionRow } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

interface QuestionFormModalProps {
	open: boolean;
	question: QuestionRow | null;
	onClose: () => void;
	onSave: (question: FormData) => void;
}

const schema = z.object({
	content: z.string().min(1, { message: 'Content is required.' }),
	audio_url: z.string().url({ message: 'Invalid audio URL.' }),
	image_url: z.string().url({ message: 'Invalid image URL.' }),
	question_type: z.enum(['FULL', 'SHORT', 'OPEN'], { message: 'Question type is required.' }),
	transcript: z.string().optional(),
	explanation: z.string().optional(),
	paraphrasing: z.string().optional(),
	group_data: z.array(z.number()).optional(),
	skill_id: z.number().optional(),
	exam_part_id: z.number().optional(),
	difficulty_id: z.number().optional(),
	test_id: z.number().optional(),
	choices: z
		.array(
			z.object({
				id: z.number().optional(),
				label: z.string().min(1, { message: 'Choice label is required.' }),
				content: z.string().min(1, { message: 'Choice content is required.' }),
				is_correct: z.boolean(),
				transcript: z.string().optional(),
			}),
		)
		.optional(),
});

type FormData = z.infer<typeof schema>;

const defaultQuestion: FormData = {
	content: '',
	audio_url: '',
	image_url: '',
	question_type: 'FULL',
	transcript: '',
	explanation: '',
	paraphrasing: '',
	group_data: [],
	skill_id: undefined,
	exam_part_id: undefined,
	difficulty_id: undefined,
	test_id: undefined,
	choices: [],
};

export function QuestionFormModal({ open, question, onClose, onSave }: QuestionFormModalProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: defaultQuestion,
		resolver: zodResolver(schema),
	});

	useEffect(() => {
		// if (open)
		// 	reset(
		// 		question
		// 			? {
		// 					...question,
		// 				}
		// 			: defaultQuestion,
		// 	);
	}, [open, question, reset]);

	const isEditing = Boolean(question && question.id);
	const submit = (values: FormData) =>
		onSave({
			...values,
		});

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={isEditing ? 'Edit Question' : 'Create new Question'}
			className='w-3xl'
			description={isEditing ? `Update question` : 'Add a new Question account.'}>
			<form
				onSubmit={handleSubmit(submit)}
				className='flex min-h-0 flex-1 flex-col'>
				<div className='flex-1 overflow-y-auto px-6 py-5 space-y-6'>
					<div className='grid grid-cols-1'>
						{/* <Field
							label='Title'
							placeholder='Enter Question name'
							error={errors.title}
							{...register('title', { required: 'Title is required.' })}
						/> */}
					</div>

					<div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
						{/* <Field
							label='Duration minute'
							placeholder='Enter Question time'
							error={errors.duration_minutes}
							type='number'
							{...register('duration_minutes')}
						/>
						<Field
							label='Question Type'
							placeholder='Select Question Type'
							error={errors.Question_type}
							{...register('Question_type')}>
							<select>
								<option value='FULL'>Full</option>
								<option value='SHORT'>Short</option>
							</select>
						</Field> */}
					</div>
				</div>
				<div className='flex justify-end gap-3 border-t border-border px-6 py-5'>
					<Button
						type='button'
						onClick={onClose}
						variant='secondary'>
						Cancel
					</Button>
					<Button type='submit'>{isEditing ? 'Save changes' : 'Create Question'}</Button>
				</div>
			</form>
		</Modal>
	);
}
