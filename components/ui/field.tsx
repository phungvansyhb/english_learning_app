import React, { ComponentProps, forwardRef } from 'react';
import { FieldError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props extends ComponentProps<'input'> {
	children?: React.ReactElement;
	label: string;
	error?: FieldError;
	description?: string;
	ref: React.Ref<HTMLInputElement>;
	suffixIcon?: React.ReactElement;
}

export const Field = (props: Props) => {
	const { children, label, error, description, ref, suffixIcon, ...rest } = props;
	const inputProps = { ...rest, ref, id: props.name };
	return (
		<div className='space-y-2'>
			<label
				htmlFor={props.name}
				className='label-text'>
				{label}
			</label>
			<div className='relative'>
				{children ? (
					React.cloneElement(children, inputProps)
				) : (
					<input
						{...inputProps}
						className={twMerge(
							'input-wrapper',
							error?.message ? 'border-red-500' : 'border-border',
							suffixIcon ? 'pr-10' : '',
						)}
					/>
				)}
				{suffixIcon}
			</div>

			{error && <p className='mt-1 error-text'>{error.message}</p>}
			{description && <span className='desc-text'>{description}</span>}
		</div>
	);
};
