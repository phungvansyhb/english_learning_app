import { DictionaryEntry } from '@/lib/dictionary-data';
import CheckboxRow from './check-box-row';
import MeaningCard from './meaning-card';

export default function MeaningTab({
	entry,
	withExamples,
	setWithExamples,
}: {
	entry: DictionaryEntry;
	withExamples: boolean;
	setWithExamples: (value: boolean) => void;
}) {
	return (
		<div className='flex flex-col gap-3'>
			<CheckboxRow
				checked={withExamples}
				onChange={setWithExamples}
				label='Kèm ví dụ khi thêm từ'
			/>

			{entry.groups.map((group) => (
				<div
					key={group.pos}
					className='flex flex-col gap-2'>
					<p className='text-xs font-bold uppercase tracking-wide text-brand-orange'>
						{group.pos}
					</p>
					{group.meanings.map((meaning) => (
						<MeaningCard
							key={meaning.meaning}
							meaning={meaning}
							withExamples={withExamples}
						/>
					))}
				</div>
			))}
		</div>
	);
}
