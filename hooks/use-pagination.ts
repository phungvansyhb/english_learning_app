'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';

type PaginationResult<T> = {
    data: T[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
};

type ApiFunction<TItem, TParams extends Record<string, unknown>> = (
    params: TParams & { page: number; perPage: number },
) => Promise<PaginationResult<TItem>>;

type ParamsOf<TApiFunction> = TApiFunction extends (
    params: infer TParams,
) => Promise<PaginationResult<any>>
    ? Omit<TParams, 'page' | 'perPage'>
    : never;

type ItemOf<TApiFunction> = TApiFunction extends (
    params: any,
) => Promise<PaginationResult<infer TItem>>
    ? TItem
    : never;

type UsePaginationOptions<TApiFunction extends ApiFunction<any, any>> = {
    apiFunction: TApiFunction;
    perPage?: number;
    initialPage?: number;
    params?: ParamsOf<TApiFunction>;
};

export function usePagination<TApiFunction extends ApiFunction<any, any>>({
    apiFunction,
    perPage = 10,
    initialPage = 1,
    params,
}: UsePaginationOptions<TApiFunction>) {
    const [data, setData] = useState<ItemOf<TApiFunction>[]>([]);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const pageRef = useRef(initialPage);
    const paramsRef = useRef<ParamsOf<TApiFunction>>(params ?? ({} as ParamsOf<TApiFunction>));

    const normalizedParams = useMemo(() => (params ?? ({} as ParamsOf<TApiFunction>)), [params]);

    useEffect(() => {
        pageRef.current = page;
    }, [page]);

    useEffect(() => {
        paramsRef.current = normalizedParams;
    }, [normalizedParams]);

    const fetchPage = useCallback(
        async (nextPage = pageRef.current) => {
            setError(null);
            startTransition(async () => {
                try {
                    const result = await apiFunction({
                        ...(paramsRef.current as ParamsOf<TApiFunction>),
                        page: nextPage,
                        perPage,
                    } as Parameters<TApiFunction>[0]);

                    setData(result.data as ItemOf<TApiFunction>[]);
                    if (result.page !== pageRef.current) {
                        pageRef.current = result.page;
                        setPage(result.page);
                    }
                    setTotal(result.total);
                    setTotalPages(result.totalPages);
                } catch (nextError) {
                    setError((nextError as Error).message);
                }
            });
        },
        [apiFunction, perPage],
    );

    useEffect(() => {
        void fetchPage(initialPage);
    }, [fetchPage, initialPage]);

    return {
        data,
        page,
        total,
        totalPages,
        perPage,
        error,
        pending: isPending,
        setPage: (nextPage: number) => void fetchPage(nextPage),
        reload: () => void fetchPage(pageRef.current),
    } as {
        data: ItemOf<TApiFunction>[];
        page: number;
        total: number;
        totalPages: number;
        perPage: number;
        error: string | null;
        pending: boolean;
        setPage: (nextPage: number) => void;
        reload: () => void;
    };
}
