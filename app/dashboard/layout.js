// app/(dashboard)/layout.js
import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import DashboardNav from './DashboardNav';

export default async function DashboardLayout({ children }) {
  // 1. Initialize Supabase server client
  const supabase = await createClient();

  // 2. Fetch current authenticated user session
  const { data: { user } } = await supabase.auth.getUser();

  // 3. Block unauthenticated bypass attempts and send them back to login
  if (!user) {
    redirect('/login');
  }

  // 4. Render layout UI if authorized
  return <DashboardNav>{children}</DashboardNav>;
}