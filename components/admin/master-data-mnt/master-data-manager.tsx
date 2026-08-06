'use client';

import { Tabs } from '@base-ui/react/tabs';

import SkillsTab from './skill-tab/SkillTab';
import DifficultyLevelsTab from './difficulty-tab/DifficultyLevelsTab';
import ExamPartsTab from './examination-part-tab/ExamPartsTab';
import TopicsTab from './topic-tab/TopicsTab';
import BadgesTab from './badge-tab/BadgesTab';

type Props = {};

const tabClassName =
	'flex h-[calc(2rem+1px)] items-center justify-center bg-transparent px-3 py-1 font-inherit text-sm font-normal leading-5 break-keep whitespace-nowrap text-neutral-600 outline-none select-none hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white data-active:text-neutral-950 data-active:font-semibold dark:text-neutral-300 dark:hover:text-white dark:data-active:text-white';

const panelClassName =
	'col-start-1 row-start-1 flex w-full flex-col gap-6 bg-white p-4 text-neutral-950 outline-none focus-visible:z-1 focus-visible:outline-2 focus-visible:outline-solid focus-visible:-outline-offset-1 focus-visible:outline-neutral-950 dark:focus-visible:outline-white dark:bg-neutral-950 dark:text-white [[hidden]]:hidden rounded-b-xl overflow-y-auto';

export default function MaterDataManager({}: Props) {
	return (
		<section className='rounded-3xl border border-border bg-card p-4 sm:p-6'>
			<div className='mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-xl font-bold text-foreground'>Master data</h1>
					<p className='mt-0.5 text-sm text-muted-foreground'>
						Manage TOEIC master tables in one place.
					</p>
				</div>
			</div>

			<Tabs.Root
				defaultValue='skills'
				className='w-full overflow-y-auto'>
				<Tabs.List className='relative z-1 -mb-px flex flex-wrap gap-1'>
					<Tabs.Tab
						className={tabClassName}
						value='skills'>
						Skills
					</Tabs.Tab>
					<Tabs.Tab
						className={tabClassName}
						value='difficulty'>
						Difficulty
					</Tabs.Tab>
					<Tabs.Tab
						className={tabClassName}
						value='examParts'>
						Exam parts
					</Tabs.Tab>
					<Tabs.Tab
						className={tabClassName}
						value='topics'>
						Topics
					</Tabs.Tab>
					<Tabs.Tab
						className={tabClassName}
						value='badges'>
						Badges
					</Tabs.Tab>
					<Tabs.Indicator className='absolute top-0 left-0 -z-1 h-full w-(--active-tab-width) translate-x-(--active-tab-left) border-x border-t bg-white transition-[translate,width] duration-150 ease-in-out dark:border-white dark:bg-neutral-950 rounded-t' />
				</Tabs.List>

				<div className='grid w-full h-full grid-cols-1 rounded-b-xl border border-border bg-white dark:border-white dark:bg-neutral-950'>
					<Tabs.Panel
						className={panelClassName}
						value='skills'>
						<SkillsTab />
					</Tabs.Panel>
					<Tabs.Panel
						className={panelClassName}
						value='difficulty'>
						<DifficultyLevelsTab />
					</Tabs.Panel>
					<Tabs.Panel
						className={panelClassName}
						value='examParts'>
						<ExamPartsTab />
					</Tabs.Panel>
					<Tabs.Panel
						className={panelClassName}
						value='topics'>
						<TopicsTab />
					</Tabs.Panel>
					<Tabs.Panel
						className={panelClassName}
						value='badges'>
						<BadgesTab />
					</Tabs.Panel>
				</div>
			</Tabs.Root>
		</section>
	);
}
