import React from 'react';
import { Badge } from './badge';

type Props = {};

export default function Logo({}: Props) {
	return (
		<div className='inline-flex title-text relative items-center gap-2 border p-2 border-primary w-fit'>
			<span className='leading-[1.7]'>Sentence</span>
			<span className='px-2 py-1 bg-primary text-white rounded inline-flex items-center'>
				Up
			</span>
		</div>
	);
}
