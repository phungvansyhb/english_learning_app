import { MoreHorizontal } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const users = [
	{ name: 'Minh Anh', email: 'minhanh@example.com', status: 'Active', joined: '2 min ago', initials: 'MA', avatar: '/avatars/user.png' },
	{ name: 'Liam Nguyen', email: 'liam.nguyen@example.com', status: 'Active', joined: '18 min ago', initials: 'LN', avatar: '/avatars/user.png' },
	{ name: 'Sofia Tran', email: 'sofia.tran@example.com', status: 'Pending', joined: '1 hour ago', initials: 'ST', avatar: '/avatars/user.png' },
	{ name: 'Huy Pham', email: 'huy.pham@example.com', status: 'Active', joined: '3 hours ago', initials: 'HP', avatar: '/avatars/user.png' },
];

export function RecentUsers() {
	return <Card>
		<CardHeader className='flex flex-row items-start justify-between gap-3'><div><CardTitle>Recent learners</CardTitle><CardDescription className='mt-1'>The latest people joining Lingua</CardDescription></div><Button asChild variant='outline' size='sm'><a href='/admin/user'>View all</a></Button></CardHeader>
		<CardContent className='flex flex-col gap-1'>
			{users.map((user) => <div key={user.email} className='flex items-center gap-3 rounded-xl px-2 py-3 transition-colors hover:bg-secondary'>
				<div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-purple-soft text-xs font-bold text-primary'>{user.initials}</div>
				<div className='min-w-0 flex-1'><p className='truncate text-sm font-semibold'>{user.name}</p><p className='truncate text-xs text-muted-foreground'>{user.email}</p></div>
				<div className='hidden text-right sm:block'><Badge variant={user.status === 'Active' ? 'secondary' : 'outline'}>{user.status}</Badge><p className='mt-1 text-xs text-muted-foreground'>{user.joined}</p></div>
				<Button variant='ghost' size='icon-sm' aria-label={`More actions for ${user.name}`}><MoreHorizontal /></Button>
			</div>)}
		</CardContent>
	</Card>;
}
