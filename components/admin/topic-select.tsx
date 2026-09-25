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

	async function createTopic(value: string) {
		const match = value.match(/^create\s+(['"])(.*?)\1$/i);
		const topicName = match?.[2]?.trim() ?? value.trim();
		const response = await fetch('/api/master-data/topics', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: topicName }),
		});
		if (!response.ok) throw new Error('Unable to create topic');
		const topic = (await response.json()) as { id: number };
		await fetchData();
		return String(topic.id);
	}

	async function handleCreate(value: string) {
		const createdValue = props.onCreate
			? await props.onCreate(value)
			: await createTopic(value);
		await fetchData();
		return createdValue;
	}

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<Combobox
			{...props}
			isLoadingValue={isLoading}
			items={items}
			key='id'
			creatable={props.creatable ?? true}
			onCreate={handleCreate}
		/>
	);
}
