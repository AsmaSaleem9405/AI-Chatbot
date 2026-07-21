import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { systemPrompt, userMessage } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      model: 'llama-3.3-70b-versatile',
    });

    const result = completion.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ result });
  } catch (err) {
    console.error('Groq AI Error:', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}