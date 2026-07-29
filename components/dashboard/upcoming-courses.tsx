import Image from 'next/image';
import { BookOpen, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { upcomingCourses } from '@/lib/data';
import type { CourseTag, UpcomingCourse } from '@/lib/types';
import { cn } from '@/lib/utils';

const tagStyles: Record<CourseTag['tone'], string> = {
	purple: 'bg-brand-purple text-accent-foreground',
	mint: 'bg-brand-mint text-brand-mint-foreground',
	orange: 'bg-brand-orange text-primary',
	pink: 'bg-brand-pink text-primary',
};

function CourseCard({ course }: { course: UpcomingCourse }) {
	return (
		<article className='bg-card p-5 border border-border rounded-3xl'>
			<div className='flex flex-wrap gap-2'>
				{course.tags.map((tag) => (
					<span
						key={tag.label}
						className={cn(
							'px-3 py-1 rounded-full font-semibold text-xs',
							tagStyles[tag.tone],
						)}>
						{tag.label}
					</span>
				))}
			</div>

			<div className='flex justify-between items-start gap-4 mt-3'>
				<h3 className='font-bold text-foreground text-lg'>{course.title}</h3>
				<p className='font-bold text-foreground text-lg shrink-0'>
					{course.price}
					<span className='font-semibold text-muted-foreground text-xs'>
						{course.cents}
					</span>
				</p>
			</div>

			<p className='mt-2 text-muted-foreground text-sm text-pretty leading-relaxed'>
				{course.description}
			</p>

			<div className='flex items-center gap-5 mt-4 font-medium text-muted-foreground text-xs'>
				<span className='flex items-center gap-1.5'>
					<Clock className='size-4' />
					{course.duration}
				</span>
				<span className='flex items-center gap-1.5'>
					<BookOpen className='size-4' />
					{course.lessons}
				</span>
			</div>

			<div className='flex justify-between items-center mt-5'>
				<div className='flex -space-x-2'>
					{course.students.map((student, index) => (
						<span
							key={`${course.id}-student-${index}`}
							className='rounded-full ring-2 ring-card overflow-hidden'>
							<Image
								src={student || '/placeholder.svg'}
								alt='Enrolled student'
								width={32}
								height={32}
								className='size-8 object-cover'
							/>
						</span>
					))}
				</div>
				<Button className='px-6 rounded-full h-10 text-sm'>Buy course</Button>
			</div>
		</article>
	);
}

export function UpcomingCourses() {
	return (
		<section>
			<h2 className='font-bold text-foreground text-lg'>Blogs</h2>
			<div className='flex flex-col gap-4 mt-4'>
				{upcomingCourses.map((course) => (
					<CourseCard
						key={course.id}
						course={course}
					/>
				))}
			</div>
		</section>
	);
}
