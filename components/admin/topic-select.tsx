'use client';

import { Option } from '@/lib/types';
import { ComponentProps, useEffect, useState } from 'react';
import Combobox from '../ui/combobox';

type Props = Omit<ComponentProps<typeof Combobox>, 'items'>;

export default function TopicSelect(props: Props) {
	const [items, setItems] = useState<Option[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	async function fetchData() {
		setIsLoading(true);
		try {
			const response = await fetch('/api/master-data/topics?page=1&perPage=1000', {
				cache: 'reload',
			});
			if (!response.ok) {
				return;
			}
			const result = (await response.json()) as { data?: { id: number; name: string }[] };
			setItems(
				(result.data ?? []).map((item) => ({
					value: String(item.id),
					label: item.name,
				})),
			);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Combobox
			{...props}
			isLoadingValue={isLoading}
			items={items}
			key={'id'}
			onCreate={
				props.onCreate ? (value) => props.onCreate?.(value) as string | void : undefined
			}
		/>
	);
}
