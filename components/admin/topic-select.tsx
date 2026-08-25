'use client';

import { ComponentProps, useEffect, useState } from 'react';
import Combobox from '../ui/combobox';
import { listTopics } from '@/services/master-data';
import { Option } from '@/lib/types';

type Props = Omit<ComponentProps<typeof Combobox>, 'items'>;

export default function TopicSelect(props: Props) {
	const [items, setItems] = useState<Option[]>([]);

	async function fetchData() {
		const rs = await listTopics({ page: 1, perPage: 1000 });
		if (rs.data) {
			setItems(rs.data.map((item) => ({ value: String(item.id), label: item.name })));
		}
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
