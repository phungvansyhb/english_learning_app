import type { Metadata } from 'next';

import { WordsManager } from '@/components/admin/words-manager';

export const metadata: Metadata = {
	title: 'Admin — Vocabulary | Lingua',
	description: 'Manage the Lingua vocabulary library: create, edit and delete word entries.',
};

export default function AdminWordsPage() {
	return (
		<section>
			<WordsManager />
		</section>
	);
}
