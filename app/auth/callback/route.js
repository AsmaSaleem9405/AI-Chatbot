import { createClient } from '@/app/utils/supabase/server'; // Make sure your server client utility path is correct
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Next string tells us where to redirect after a successful code exchange
  const next = searchParams.get('next') || '/update-password'; 

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Code is valid! User is now logged in. Send them to the update-password page
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, return the user to the home page or an error page
  return NextResponse.redirect(`${origin}/auth/auth-error`);
}