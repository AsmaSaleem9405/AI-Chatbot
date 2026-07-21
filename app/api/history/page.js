import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for the API route
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Or use cookies/auth helper depending on your setup
);

// GET: Fetch all chat history for the user
export async function GET(request) {
  try {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete a specific history item by ID or clear all
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Delete a single item
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } else {
      // Optional: Clear all items if no ID is passed
      const { error } = await supabase
        .from('chat_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows safely

      if (error) throw error;
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}