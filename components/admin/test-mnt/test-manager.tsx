'use client';

import { Pencil, Plus, PlusCircleIcon, Search, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import { DataTable } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/modal';
import { Pagination } from '@/components/ui/pagination';
import { usePagination } from '@/hooks/use-pagination';
import type { CreateTestInput, TestRow } from '@/lib/types';
import { deleteTest, listTests } from '@/services/test';
import { TestFormModal } from './test-form-modal';
import { Switch } from '@base-ui/react';
import { Button } from '@/components/ui/button';


export function TestManager() {
    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState<TestRow | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<TestRow | null>(null);
    const [savePending, startSaveTransition] = useTransition();
    const [deletePending, startDeleteTransition] = useTransition();

    const {
        data: tests,
        page,
        totalPages,
        error,
        pending,
        setPage,
        reload,
    } = usePagination({
        apiFunction: listTests,
        params: {
            search: query || undefined,
            role: roleFilter || undefined,
            status: statusFilter || undefined,
        },
    });

    function handleSave(test: CreateTestInput) {
        // startSaveTransition(async () => {
        //     try {
        //         if (user.id) {
        //             await updateUser(user.id, user);
        //         } else {
        //             await createUser(user as CreateUserInput);
        //         }
        //         await reload();
        //         setFormOpen(false);
        //         setEditing(null);
        //     } catch (err) {
        //         console.error(err);
        //     }
        // });
    }

    function handleDelete() {
        if (!deleteTarget) return;

        startDeleteTransition(async () => {
            try {
                await deleteTest(deleteTarget.id);
                setDeleteTarget(null);
                reload();
            } catch (err) {
                console.error(err);
            }
        });
    }

    const loading = pending || savePending || deletePending;

    return (
        <section className='rounded-3xl border border-border bg-card p-4 sm:p-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                    <h1 className='text-xl font-bold text-foreground'>Tests</h1>
                    <p className='mt-0.5 text-sm text-muted-foreground'>
                        {tests.length} {tests.length === 1 ? 'test' : 'tests'} found
                    </p>
                </div>

                <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                    <div className='relative flex-1 sm:w-64'>
                        <Search className='pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
                        <input
                            type='search'
                            value={query}
                            onChange={(e) => {
                                setPage(1);
                                setQuery(e.target.value);
                            }}
                            placeholder='Search test title'
                            aria-label='Search tests'
                            className='h-11 w-full rounded-full border border-border bg-secondary/50 pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/30'
                        />
                    </div>
                    <div className='flex items-center gap-2'>
                        <button
                            type='button'
                            onClick={() => {
                                setEditing(null);
                                setFormOpen(true);
                            }}
                            className='inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90'>
                            <Plus className='size-4' />
                            <span className='hidden sm:inline'>Add test</span>
                        </button>
                    </div>
                </div>
            </div>

            <DataTable
                isLoading={loading}
                columns={[
                    {
                        key: 'title',
                        header: 'Title',
                        cellClassName: 'break-all text-foreground',
                    },
                    {
                        key: 'test_type',
                        header: 'Test type',
                        cellClassName: 'text-foreground',
                    },
                    { key: 'duration_minutes', header: 'Duration Minutes', cellClassName: 'text-foreground' },
                    { key: 'status', header: 'Status', cellClassName: 'text-foreground' , render : (test) => <label className="flex items-center gap-2 text-sm font-normal text-neutral-950 ">
                            <Switch.Root
                                checked={test.status === 'ACTIVE'}
                                className="flex h-4 w-9 shrink-0 border border-accent-foreground bg-white p-0.5 rounded transition-colors duration-150 ease-[ease]   data-checked:bg-neutral-950  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 "
                            >
                                <Switch.Thumb className="size-2.5 bg-accent transition-[translate,background-color] duration-150 ease-[ease] data-checked:translate-x-4 data-checked:bg-white " />
                            </Switch.Root>
                            Active
                            </label> },
                    {
                        key: 'created_at',
                        header: 'Created at',
                        cellClassName: 'text-muted-foreground',
                        render: (user) => new Date(user.created_at).toLocaleDateString(),
                    },
                    {
                        key: 'actions',
                        header: 'Actions',
                        className: 'text-center',
                        render: (test) => (
                            <div className='flex justify-center gap-1'>
                                <Button
                                    size='icon'
                                    variant='ghost'
                                    onClick={() => {
                                        setEditing(test);
                                        setFormOpen(true);
                                    }}
                                    aria-label={`Edit ${test.title}`}
                                    >
                                    <Pencil className='size-4' />
                                </Button>
                                 <Button
                                    size='icon'
                                    variant='ghost'
                                    onClick={() => setDeleteTarget(test)}
                                    aria-label={`Add Question`}
                                    className='transition-colors hover:bg-secondary hover:text-foreground'>
                                    <PlusCircleIcon className='size-4' />
                                </Button>
                                <Button
                                    size='icon'
                                    variant='ghost'
                                    onClick={() => setDeleteTarget(test)}
                                    aria-label={`Delete ${test.title}`}
                                    className=' hover:bg-destructive/10 hover:text-destructive'>
                                    <Trash2 className='size-4' />
                                </Button>
                               
                            </div>
                        ),
                    },
                ]}
                data={tests}
                rowKey={(test) => test.id}
                emptyState='No tests found.'
                renderMobileCard={(test) => (
                    <div>
                        <div className='flex items-start justify-between gap-3'>
                            <div>
                                <p className='font-semibold text-foreground'>{test.title}</p>
                                <p className='text-sm text-muted-foreground'>{test.test_type}</p>
                            </div>
                            <span className='rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase text-muted-foreground'>
                                {test.duration_minutes}
                            </span>
                            <p className='text-sm text-muted-foreground'>{test.status}</p>

                        </div>
                        <div className='mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground'>
                            <span>{new Date(test.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className='mt-4 flex gap-2'>
                            <button
                                type='button'
                                onClick={() => {
                                    setEditing(test);
                                    setFormOpen(true);
                                }}
                                className='inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-accent'>
                                <Pencil className='size-4' /> Edit
                            </button>
                            <button
                                type='button'
                                onClick={() => setDeleteTarget(test)}
                                className='inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-destructive/10 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20'>
                                <Trash2 className='size-4' /> Delete
                            </button>
                        </div>
                    </div>
                )}
                className='mt-6'
            />

            <Pagination
                page={page}
                totalPages={totalPages}
                pending={loading}
                onPageChange={setPage}
            />

            {error && (
                <div className='mt-4 rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive'>
                    {error}
                </div>
            )}

            <TestFormModal
                open={formOpen}
                test={editing}
                onClose={() => {
                    setFormOpen(false);
                    setEditing(null);
                }}
                onSave={handleSave}
            />

            <Modal
                open={Boolean(deleteTarget)}
                onClose={() => setDeleteTarget(null)}
                title='Delete user'
                description={`This will permanently remove ${deleteTarget?.title}.`}>
                <div className='flex justify-end gap-3 px-6 py-5'>
                    <button
                        type='button'
                        onClick={() => setDeleteTarget(null)}
                        className='h-11 rounded-full px-5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary'>
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={handleDelete}
                        className='h-11 rounded-full bg-destructive px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90'>
                        Delete
                    </button>
                </div>
            </Modal>
        </section>
    );
}
