'use server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login({ email, password }: { email: string, password: string }) {
	if (email && password) {
		const cookieStore = await cookies();
		const supabase = createClient(cookieStore);

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			// Xử lý lỗi đăng nhập
			redirect('/login?message=Lỗi đăng nhập');
		}

		redirect('/');
	}
}
export async function loginSSO(provider : 'google'|'facebook'){

}