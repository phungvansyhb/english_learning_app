import React from 'react';

type Props = {
	pageName: string;
	rightBarSlot: React.ReactNode;
	contentSlot: React.ReactNode;
	otherSlot: React.ReactNode;
};

export default function AdminPageLayout(props: Props) {
	return (
		<section className='rounded-3xl border border-border bg-card p-4 sm:p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-xl font-bold text-foreground'>{props.pageName}</h1>
				</div>

				<div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
					{/* right tools bar */}
					{props.rightBarSlot}
				</div>
			</div>

			<div className='mt-6 rounded-2xl bg-card'>
				{/* Content : table , tabs */}
				{props.contentSlot}
			</div>
			{props.otherSlot}
		</section>
	);
}
