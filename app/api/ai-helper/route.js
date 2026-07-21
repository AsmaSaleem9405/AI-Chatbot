import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    // 1. Destructure history along with systemPrompt and userMessage
    const { systemPrompt, history = [], userMessage } = await req.json();

    // 2. Format history into Groq's expected schema ({ role, content })
    const formattedHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // 3. Assemble full messages array: System Prompt + Past History
    // If userMessage wasn't pushed to history on frontend yet, ensure it's included
    const messages = [
      { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
      ...formattedHistory,
    ];

    // If history is empty or doesn't include the latest userMessage, append it
    if (
      formattedHistory.length === 0 ||
      formattedHistory[formattedHistory.length - 1]?.content !== userMessage
    ) {
      messages.push({ role: 'user', content: userMessage });
    }

    // 4. Send the complete conversation to Groq
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
    });

    const result = completion.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ result });
  } catch (err) {
    console.error('Groq AI Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}