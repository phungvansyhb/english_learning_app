'use client';

import { ComponentProps, useEffect, useState } from 'react';
import Combobox from '../ui/combobox';
import { Option } from '@/lib/types';

type Props = Omit<ComponentProps<typeof Combobox>, 'items'>;

export default function TopicSelect(props: Props) {
	const [items, setItems] = useState<Option[]>([]);

	async function fetchData() {
		const response = await fetch('/api/master-data/topics?page=1&perPage=1000');
		if (!response.ok) {
			return;
		}
		const result = (await response.json()) as { data?: { id: number; name: string }[] };
		setItems((result.data ?? []).map((item) => ({ value: String(item.id), label: item.name })));
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Combobox
			{...props}
			items={items}
			onCreate={
				props.onCreate ? (value) => props.onCreate?.(value) as string | void : undefined
			}
		/>
	);
}
