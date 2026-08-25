'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateTestInput, TestRow } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Field } from '@/components/ui/field';
import { Button } from '@/components/ui/button';

interface TestFormModalProps {
    open: boolean;
    test: TestRow | null;
    onClose: () => void;
    onSave: (Test: CreateTestInput) => void;
}

const defaults: CreateTestInput = {
    title:'',
    test_type : 'FULL',
    duration_minutes: 200,
};

export function TestFormModal({ open, test, onClose, onSave }: TestFormModalProps) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTestInput>({ defaultValues: defaults });

    useEffect(() => {
        if (open)
            reset(
                test
                    ? {
                            ...test
                            
                        }
                    : defaults,
            );
    }, [open, test, reset]);

    const isEditing = Boolean(test);
    const submit = (values: CreateTestInput) =>
        onSave({
            ...values,
        });

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEditing ? 'Edit Test' : 'Create new Test'}
            className='w-3xl'
            description={isEditing ? `Update ${test?.title}` : 'Add a new Test account.'}>
            <form
                onSubmit={handleSubmit(submit)}
                className='flex min-h-0 flex-1 flex-col'>
                <div className='flex-1 overflow-y-auto px-6 py-5 space-y-6'>
                    <div className='grid grid-cols-1'>
                            <Field
                            label='Title'
                            placeholder='Enter test name'
                            error={errors.title}
                            {...register('title', { required: 'Title is required.' })}
                        />
                    </div>
                     
                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                        <Field
                            label='Duration minute'
                            placeholder='Enter test time'
                            error={errors.duration_minutes}
                            type='number'
                            {...register('duration_minutes')}
                        />
                        <Field
                            label='Test Type'
                            placeholder='Select Test Type'
                            error={errors.test_type}
                            {...register('test_type')}
                        >
                           <select>
                                <option value='FULL'>Full</option>
                                <option value='SHORT'>Short</option>
                            </select>
                            </Field>
                    </div>
                    
                </div>
                <div className='flex justify-end gap-3 border-t border-border px-6 py-5'>
                    <Button
                        type='button'
                        onClick={onClose}
                        variant='secondary'>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        >
                        {isEditing ? 'Save changes' : 'Create Test'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
