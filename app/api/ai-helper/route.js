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

    // 2. Regular Multilingual System Prompt
    const baseSystemPrompt = body.systemPrompt || 'You are a helpful AI assistant.';
    const systemPrompt = `${baseSystemPrompt} Always detect the language of the user's latest message and respond fluently in that exact same language.`;

    // 3. Format history safely (preserving previous text strings)
    const formattedHistory = rawHistory.slice(0, -1).map((msg) => {
      const role = msg.sender === 'user' || msg.role === 'user' ? 'user' : 'assistant';
      // Handle if content is string or array parts
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

    // 5. Send to Groq Vision Model (Ensure a vision-capable model is used)
    const completion = await groq.chat.completions.create({
      messages,
      model: 'qwen/qwen3.6-27b', // Verified vision-capable model on Groq
      temperature: 0.7,
    });

    const result = completion.choices[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ result, text: result });
  } catch (err) {
    console.error('AI Helper Error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}