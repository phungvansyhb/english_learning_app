'use client';

import { useMemo, useRef, useState } from 'react';
import {
	Bold,
	Check,
	ChevronDown,
	Eye,
	Italic,
	List,
	ListOrdered,
	Pencil,
	Plus,
	Search,
	Trash2,
	Underline,
} from 'lucide-react';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';
type GrammarPoint = {
	id: number;
	name: string;
	description: string;
	difficulty: Difficulty;
	content: string;
	lessons: number;
	updated: string;
};

const initialGrammar: GrammarPoint[] = [
	{
		id: 1,
		name: 'Present Perfect',
		description: 'Talk about experiences and actions connected to the present.',
		difficulty: 'Intermediate',
		lessons: 12,
		updated: 'Today, 09:42',
		content:
			'<h2>Present Perfect</h2><p>Use the present perfect to connect a past action with the present.</p><h3>Form</h3><p><strong>have / has + past participle</strong></p><ul><li>I have finished my homework.</li><li>She has visited London.</li></ul><blockquote>Focus on the result or experience, not the exact time.</blockquote>',
	},
	{
		id: 2,
		name: 'Conditionals: Type 1',
		description: 'Describe real or likely situations and their results.',
		difficulty: 'Intermediate',
		lessons: 8,
		updated: 'Yesterday, 16:18',
		content:
			'<h2>First Conditional</h2><p>Use it for a possible future condition and its likely result.</p><p><strong>If + present simple, will + base verb.</strong></p><p>If you study, you will improve.</p>',
	},
	{
		id: 3,
		name: 'Articles: a, an, the',
		description: 'Choose articles correctly when referring to nouns.',
		difficulty: 'Beginner',
		lessons: 6,
		updated: '12 Aug, 11:05',
		content:
			'<h2>Articles</h2><p>Use <strong>a</strong> or <strong>an</strong> for one non-specific thing. Use <strong>the</strong> for something specific.</p>',
	},
	{
		id: 4,
		name: 'Reported Speech',
		description: 'Report what someone said without using their exact words.',
		difficulty: 'Advanced',
		lessons: 10,
		updated: '10 Aug, 14:26',
		content:
			'<h2>Reported Speech</h2><p>Reported speech tells us what another person said.</p><p>Direct: “I am tired.” Reported: She said that she was tired.</p>',
	},
];

const difficultyStyles: Record<Difficulty, string> = {
	Beginner: 'bg-brand-mint text-brand-mint-foreground',
	Intermediate: 'bg-brand-purple-soft text-foreground',
	Advanced: 'bg-brand-pink/15 text-foreground',
};

function sanitizeHtml(value: string) {
	if (typeof window === 'undefined') return value;
	const doc = new DOMParser().parseFromString(value, 'text/html');
	doc.querySelectorAll('script,style,iframe,object,embed,form').forEach((node) => node.remove());
	doc.querySelectorAll('*').forEach((node) => {
		[...node.attributes].forEach((attribute) => {
			if (attribute.name.startsWith('on') || attribute.name === 'style')
				node.removeAttribute(attribute.name);
			if (attribute.name === 'href' && !attribute.value.startsWith('#'))
				node.removeAttribute(attribute.name);
		});
	});
	return doc.body.innerHTML;
}

function EditorToolbar({ onCommand }: { onCommand: (command: string) => void }) {
	const actions = [
		{ command: 'bold', label: 'Bold', icon: Bold },
		{ command: 'italic', label: 'Italic', icon: Italic },
		{ command: 'underline', label: 'Underline', icon: Underline },
		{ command: 'insertUnorderedList', label: 'Bulleted list', icon: List },
		{ command: 'insertOrderedList', label: 'Numbered list', icon: ListOrdered },
	];
	return (
		<div className='flex flex-wrap items-center gap-1 border-border border-b p-2'>
			<select
				aria-label='Text style'
				className='bg-card px-2 rounded-lg h-9 text-muted-foreground text-xs outline-none'
				defaultValue='p'
				onChange={(event) =>
					onCommand(
						event.target.value === 'p'
							? 'formatBlock:p'
							: `formatBlock:${event.target.value}`,
					)
				}>
				<option value='p'>Paragraph</option>
				<option value='h2'>Heading 2</option>
				<option value='h3'>Heading 3</option>
				<option value='blockquote'>Quote</option>
			</select>
			<span className='bg-border mx-1 w-px h-5' />
			{actions.map(({ command, label, icon: Icon }) => (
				<button
					key={command}
					type='button'
					aria-label={label}
					onMouseDown={(event) => event.preventDefault()}
					onClick={() => onCommand(command)}
					className='flex justify-center items-center hover:bg-secondary rounded-lg size-9 text-muted-foreground hover:text-foreground transition-colors'>
					<Icon className='size-4' />
				</button>
			))}
		</div>
	);
}

export function GrammarManager() {
	const [items, setItems] = useState(initialGrammar);
	const [selected, setSelected] = useState<GrammarPoint | null>(null);
	const [query, setQuery] = useState('');
	const [difficulty, setDifficulty] = useState<'All' | Difficulty>('All');
	const [isPreview, setIsPreview] = useState(false);
	const editorRef = useRef<HTMLDivElement>(null);

	const filtered = useMemo(
		() =>
			items.filter(
				(item) =>
					item.name.toLowerCase().includes(query.toLowerCase()) &&
					(difficulty === 'All' || item.difficulty === difficulty),
			),
		[items, query, difficulty],
	);

	const openEditor = (item?: GrammarPoint) => {
		const draft = item ?? {
			id: Date.now(),
			name: '',
			description: '',
			difficulty: 'Beginner' as Difficulty,
			lessons: 0,
			updated: 'Just now',
			content: '<h2>New grammar point</h2><p>Start writing your lesson here...</p>',
		};
		setSelected(draft);
		setIsPreview(false);
		requestAnimationFrame(() => {
			if (editorRef.current) editorRef.current.innerHTML = draft.content;
		});
	};

	const save = () => {
		if (!selected || !selected.name.trim()) return;
		const content = sanitizeHtml(editorRef.current?.innerHTML ?? selected.content);
		const next = { ...selected, name: selected.name.trim(), content, updated: 'Just now' };
		setItems((current) =>
			current.some((item) => item.id === next.id)
				? current.map((item) => (item.id === next.id ? next : item))
				: [next, ...current],
		);
		setSelected(null);
	};

	const remove = (id: number) => setItems((current) => current.filter((item) => item.id !== id));

	return (
		<section className='flex flex-col gap-6'>
			<div className='flex sm:flex-row flex-col sm:justify-between sm:items-end gap-4'>
				<div>
					<p className='font-semibold text-brand-pink text-xs uppercase tracking-[0.18em]'>
						Content library
					</p>
					<h1 className='mt-2 font-bold text-foreground text-3xl tracking-tight'>
						Grammar points
					</h1>
					<p className='mt-2 max-w-xl text-muted-foreground text-sm leading-6'>
						Create clear, structured lessons that help learners understand grammar in
						context.
					</p>
				</div>
				<button
					type='button'
					onClick={() => openEditor()}
					className='inline-flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 px-4 rounded-xl h-11 font-semibold text-primary-foreground text-sm transition-colors'>
					<Plus className='size-4' />
					New grammar point
				</button>
			</div>

			<div className='flex sm:flex-row flex-col gap-3'>
				<label className='relative flex-1'>
					<Search className='top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2' />
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder='Search grammar points...'
						className='input-wrapper pl-10'
					/>
				</label>
				<label className='relative'>
					<ChevronDown className='top-1/2 right-3 absolute size-4 text-muted-foreground pointer-events-none -translate-y-1/2' />
					<select
						aria-label='Filter by difficulty'
						value={difficulty}
						onChange={(event) =>
							setDifficulty(event.target.value as 'All' | Difficulty)
						}
						className='input-wrapper sm:w-48 appearance-none pr-9'>
						<option>All</option>
						<option>Beginner</option>
						<option>Intermediate</option>
						<option>Advanced</option>
					</select>
				</label>
			</div>

			<div className='bg-card border border-border rounded-2xl overflow-hidden'>
				<div className='flex justify-between items-center px-5 py-4 border-border border-b'>
					<div>
						<h2 className='font-bold text-foreground'>All grammar points</h2>
						<p className='mt-1 text-muted-foreground text-xs'>
							{filtered.length} lessons in your library
						</p>
					</div>
					<span className='bg-secondary px-3 py-1 rounded-full font-semibold text-muted-foreground text-xs'>
						Draft mode
					</span>
				</div>
				<div className='divide-y divide-border'>
					{filtered.map((item) => (
						<div
							key={item.id}
							className='flex md:flex-row flex-col md:items-center gap-4 px-5 py-4 hover:bg-secondary/40 transition-colors'>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center gap-3'>
									<h3 className='font-semibold text-foreground truncate'>
										{item.name}
									</h3>
									<span
										className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${difficultyStyles[item.difficulty]}`}>
										{item.difficulty}
									</span>
								</div>
								<p className='mt-1 text-muted-foreground text-sm truncate'>
									{item.description}
								</p>
							</div>
							<div className='flex items-center gap-6 text-muted-foreground text-xs'>
								<span>{item.lessons} examples</span>
								<span className='hidden lg:inline'>{item.updated}</span>
								<button
									type='button'
									aria-label={`Edit ${item.name}`}
									onClick={() => openEditor(item)}
									className='hover:text-foreground'>
									<Pencil className='size-4' />
								</button>
								<button
									type='button'
									aria-label={`Delete ${item.name}`}
									onClick={() => remove(item.id)}
									className='hover:text-destructive'>
									<Trash2 className='size-4' />
								</button>
							</div>
						</div>
					))}
					{!filtered.length && (
						<div className='px-5 py-14 text-center text-muted-foreground text-sm'>
							No grammar points match your filters.
						</div>
					)}
				</div>
			</div>

			{selected && (
				<div className='z-50 fixed inset-0 flex justify-center items-center bg-foreground/40 p-4'>
					<div
						role='dialog'
						aria-modal='true'
						aria-label='Grammar point editor'
						className='flex flex-col bg-card shadow-2xl rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden'>
						<div className='flex justify-between items-start px-6 py-5 border-border border-b'>
							<div>
								<p className='font-semibold text-brand-pink text-xs uppercase tracking-[0.16em]'>
									Lesson editor
								</p>
								<h2 className='mt-1 font-bold text-foreground text-xl'>
									{selected.id > 1000000000000
										? 'New grammar point'
										: 'Edit grammar point'}
								</h2>
							</div>
							<button
								type='button'
								onClick={() => setSelected(null)}
								aria-label='Close editor'
								className='text-muted-foreground hover:text-foreground text-2xl'>
								×
							</button>
						</div>
						<div className='flex-1 gap-5 grid md:grid-cols-[260px_1fr] p-6 overflow-y-auto'>
							<div className='flex flex-col gap-4'>
								<label className='label-text'>
									Title
									<input
										value={selected.name}
										onChange={(event) =>
											setSelected({ ...selected, name: event.target.value })
										}
										className='input-wrapper mt-1'
										placeholder='e.g. Present Simple'
									/>
								</label>
								<label className='label-text'>
									Short description
									<textarea
										value={selected.description}
										onChange={(event) =>
											setSelected({
												...selected,
												description: event.target.value,
											})
										}
										className='input-wrapper mt-1 py-3 h-28 resize-none'
										placeholder='What will learners understand?'
									/>
								</label>
								<label className='label-text'>
									Difficulty
									<select
										value={selected.difficulty}
										onChange={(event) =>
											setSelected({
												...selected,
												difficulty: event.target.value as Difficulty,
											})
										}
										className='input-wrapper mt-1'>
										<option>Beginner</option>
										<option>Intermediate</option>
										<option>Advanced</option>
									</select>
								</label>
								<div className='bg-secondary p-4 rounded-xl text-muted-foreground text-xs leading-5'>
									<p className='font-semibold text-foreground'>Writing tip</p>
									<p className='mt-1'>
										Use a short rule, then add examples learners can reuse in
										real conversations.
									</p>
								</div>
							</div>
							<div className='flex flex-col gap-3 min-w-0'>
								<div className='flex justify-between items-center'>
									<label className='label-text'>Lesson content</label>
									<button
										type='button'
										onClick={() => setIsPreview((value) => !value)}
										className='inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-xs'>
										<Eye className='size-4' />
										{isPreview ? 'Edit content' : 'Preview'}
									</button>
								</div>
								{isPreview ? (
									<article
										className='prose prose-sm bg-secondary/50 p-5 rounded-xl min-h-72 max-w-none'
										dangerouslySetInnerHTML={{
											__html: sanitizeHtml(
												editorRef.current?.innerHTML ?? selected.content,
											),
										}}
									/>
								) : (
									<div className='border border-border rounded-xl overflow-hidden'>
										<EditorToolbar
											onCommand={(command) => {
												if (command.startsWith('formatBlock:'))
													document.execCommand(
														'formatBlock',
														false,
														command.split(':')[1],
													);
												else document.execCommand(command);
												editorRef.current?.focus();
											}}
										/>
										<div
											ref={editorRef}
											contentEditable
											suppressContentEditableWarning
											onInput={(event) =>
												setSelected({
													...selected,
													content: event.currentTarget.innerHTML,
												})
											}
											className='p-5 min-h-72 outline-none prose prose-sm max-w-none'
										/>
									</div>
								)}
							</div>
						</div>
						<div className='flex justify-end items-center gap-3 bg-secondary/40 px-6 py-4 border-border border-t'>
							<button
								type='button'
								onClick={() => setSelected(null)}
								className='hover:bg-secondary px-4 rounded-xl h-10 font-semibold text-muted-foreground text-sm'>
								Cancel
							</button>
							<button
								type='button'
								onClick={save}
								disabled={!selected.name.trim()}
								className='inline-flex items-center gap-2 disabled:opacity-50 bg-primary hover:bg-primary/90 px-4 rounded-xl h-10 font-semibold text-primary-foreground text-sm'>
								<Check className='size-4' />
								Save grammar point
							</button>
						</div>
					</div>
				</div>
			)}
		</section>
	);
}
