import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();

    const userMessage = body.userMessage || body.prompt || '';
    const rawHistory = body.history || [];
    const imageUrl = body.imageUrl || body.image || null;

    // 1. Check if the user is asking to create/generate an image
    const lowerMsg = userMessage.toLowerCase();
    const isImageGenerationRequest = 
      lowerMsg.includes('create an image') || 
      lowerMsg.includes('generate an image') || 
      lowerMsg.includes('draw a') || 
      lowerMsg.includes('make a picture') ||
      lowerMsg.includes('generate image');

    if (isImageGenerationRequest) {
      const promptDescription = userMessage
        .replace(/create an image of|generate an image of|draw a|make a picture of|generate image/gi, '')
        .trim();

      const encodedPrompt = encodeURIComponent(promptDescription || userMessage);
      const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

      return NextResponse.json({
        result: `Here is the image you requested for: "${promptDescription || userMessage}"`,
        generatedImageUrl: generatedImageUrl,
        text: `Here is the image you requested for: "${promptDescription || userMessage}"`
      });
    }

    // 2. Strict Short Response System Prompt
    const baseSystemPrompt = body.systemPrompt || 'You are a helpful AI assistant.';
    const systemPrompt = `${baseSystemPrompt} Rules: Detect the language of the user's latest message and reply in that exact language. If the user says a casual greeting like "hello", "hi", or "hey", reply ONLY with a short phrase like "Hello! How can I help you today?" Do not write meta-commentary, do not explain what you are doing, and keep all greetings short and direct.`;

    // 3. Format history safely
    const formattedHistory = rawHistory.slice(0, -1).map((msg) => {
      const role = msg.sender === 'user' || msg.role === 'user' ? 'user' : 'assistant';
      let content = '';
      if (typeof msg.content === 'string') {
        content = msg.content;
      } else if (Array.isArray(msg.content)) {
        const textPart = msg.content.find(p => p.type === 'text');
        content = textPart ? textPart.text : '[Image Attachment]';
      } else {
        content = msg.text || '';
      }
      return { role, content };
    }).filter(msg => msg.content && msg.content.trim() !== '');

    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
    ];

    // 4. Construct current user content payload supporting image + text
    let currentUserContent;
    if (imageUrl) {
      currentUserContent = [
        { type: 'text', text: userMessage || 'Analyze this image and guide me on what it is about.' },
        { type: 'image_url', image_url: { url: imageUrl } },
      ];
    } else {
      currentUserContent = userMessage || 'Hello';
    }

    messages.push({ role: 'user', content: currentUserContent });

    // 5. Send to Groq Vision Model with reasoning hidden
    const completion = await groq.chat.completions.create({
      messages,
      model: 'qwen/qwen3.6-27b',
      temperature: 0.5,
      reasoning_format: 'hidden', // Hides the <think> blocks from output
    });

    const rawResult = completion.choices[0]?.message?.content || 'No response generated.';
    
    // Safety fallback to strip any accidental think tags if returned
    const result = rawResult.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    return NextResponse.json({ result, text: result });
  } catch (err) {
    console.error('AI Helper Error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}