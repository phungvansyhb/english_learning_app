'use client';

import TopicSelect from '@/components/admin/topic-select';
import { usePracticeStore } from '@/utils/zustand/practice-store';
import { BookOpen } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

export default function PracticeControls() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathName = usePathname();
	const handleChangeTopic = (t: string) => {
		const params = new URLSearchParams(searchParams.toString());
		if (t) {
			params.set('topic', t);
		} else {
			params.delete('topic');
		}
		const query = params.toString();
		router.push(query ? `${pathName}?${query}` : pathName);
	};
	const { getQuestion } = usePracticeStore();
	useEffect(() => {
		getQuestion(searchParams.get('topic') as string, 1);
	}, [searchParams.get('topic')]);

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-3 rounded-3xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex items-center gap-3'>
					<div className='flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
						<BookOpen aria-hidden='true' />
					</div>
					<div>
						<p className='text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground'>
							Practice on topic
						</p>
					</div>
				</div>
				<div className='w-60'>
					<TopicSelect
						defaultValue={searchParams.get('topic')}
						label=''
						placeholder='All'
						onValueChange={(v) => handleChangeTopic(v as string)}
					/>
				</div>
			</div>
		</div>
	);
}
