'use client';

import { BookOpen } from 'lucide-react';
import TopicSelect from '@/components/admin/topic-select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { usePracticeStore } from '@/utils/zustand/practice-store';

export default function PracticeControls() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const pathName = usePathname();
	const practiceControl = usePracticeStore();
	const handleChangeTopic = (t: string) => {
		const url =
			pathName +
			'?ask=' +
			searchParams.get('ask') +
			'&answer=' +
			searchParams.get('answer') +
			'&topic=' +
			t;
		router.push(url);
	};
	const defaultValue = useMemo(() => searchParams.get('topic'), [searchParams]);

	useEffect(() => {
		practiceControl.getQuestion(searchParams.get('topic') as string, 1);
	}, []);

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
						value={defaultValue?.toString()}
						label=''
						placeholder='All'
						onValueChange={(v) => handleChangeTopic(v as string)}
					/>
				</div>
			</div>
		</div>
	);
}
