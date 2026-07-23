import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment variables are missing");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("chat_history")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("History GET Error:", error);

    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment variables are missing");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const { error } = await supabase
        .from("chat_history")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("chat_history")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("History DELETE Error:", error);

    return NextResponse.json(
      {
        error: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}