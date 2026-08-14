import React, { ComponentProps, ReactElement } from 'react';
import { FieldError } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface Props extends Omit<ComponentProps<'input'>, 'ref'> {
	children?: ReactElement;
	label: string;
	error?: FieldError;
	description?: string;
	ref?: React.Ref<HTMLInputElement>;
	suffixIcon?: ReactElement;
}

export const Field = React.forwardRef<HTMLInputElement, Props>(function Field(
	{ children, label, error, description, suffixIcon, className, ...rest },
	ref,
) {
	const inputProps = { ...rest, ref, id: rest.name };
	return (
		<div className='flex flex-col gap-2'>
			<label htmlFor={rest.name} className='label-text'>{label}</label>
			<div className='relative'>
				{children ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, { ...inputProps, className: twMerge('input-wrapper', (children.props as Record<string, string | undefined>).className) }) : (
					<input {...inputProps} className={twMerge('input-wrapper', error?.message ? 'border-destructive' : 'border-border', suffixIcon && 'pr-10', className)} />
				)}
				{suffixIcon}
			</div>
			{error && <p className='error-text' role='alert'>{error.message}</p>}
			{description && <span className='desc-text'>{description}</span>}
		</div>
	);
});
