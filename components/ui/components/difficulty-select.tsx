'use client';

import { ComponentProps, useEffect, useState } from 'react';
import Combobox from '../combobox';
import { listDifficultyLevels } from '@/services/master-data';
import { Option } from '@/lib/types';

type Props = {
	type: 'vocab' | 'grammar';
} & Omit<ComponentProps<typeof Combobox>, 'items'>;

export default function DifficultySelect(props: Props) {
	const [items, setItems] = useState<Option[]>([]);

	async function fetchData() {
		const rs = await listDifficultyLevels({ level_type: props.type });
		if (rs.data) {
			setItems(rs.data.map((item) => ({ value: item.id, label: item.label })));
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
