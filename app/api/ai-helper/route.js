import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();

    const userMessage = body.userMessage || body.prompt || '';
    const rawHistory = body.history || [];

    // 1. Multilingual-ready dynamic system prompt
    const baseSystemPrompt = body.systemPrompt || 'You are a helpful AI assistant.';
    const systemPrompt = `${baseSystemPrompt} Always detect the language of the user's latest message and respond fluently in that exact same language.`;

    // 2. Format history to standard Groq schema ({ role, content })
    const formattedHistory = rawHistory.map((msg) => {
      const role =
        msg.sender === 'user' || msg.role === 'user'
          ? 'user'
          : 'assistant';

      const content = msg.text || msg.content || '';

      return { role, content };
    }).filter(msg => msg.content.trim() !== '');

    // 3. Assemble full messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
    ];

    if (
      userMessage &&
      (formattedHistory.length === 0 ||
        formattedHistory[formattedHistory.length - 1]?.content !== userMessage)
    ) {
      messages.push({ role: 'user', content: userMessage });
    }

    // 4. Send conversation to Groq
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
    });

    const result = completion.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ result, text: result });
  } catch (err) {
    console.error('Groq AI Error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}