import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Supabase environment variables are missing');
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

// GET: Fetch all chat history
export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(data, { status: 200 });

  } catch (err) {
    console.error('GET history error:', err);

    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific history item or clear all
export async function DELETE(request) {
  try {
    const supabase = getSupabase();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

    } else {
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .neq(
          'id',
          '00000000-0000-0000-0000-000000000000'
        );

      if (error) throw error;
    }

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );

  } catch (err) {
    console.error('DELETE history error:', err);

    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}