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
      // Clean up the prompt to use as the image description
      const promptDescription = userMessage
        .replace(/create an image of|generate an image of|draw a|make a picture of|generate image/gi, '')
        .trim();

      // Using Pollinations AI (Free, no API key required) for instant image generation
      // Alternatively, you can use OpenAI DALL-E 3 if you have an OpenAI API key configured.
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

    // 3. Format history
    const formattedHistory = rawHistory.map((msg) => {
      const role = msg.sender === 'user' || msg.role === 'user' ? 'user' : 'assistant';
      const content = msg.text || msg.content || '';
      return { role, content };
    }).filter(msg => msg.content.trim() !== '');

    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
    ];

    // 4. Construct message payload (supporting text + optional image upload)
    let currentUserContent;
    if (imageUrl) {
      currentUserContent = [
        { type: 'text', text: userMessage || 'Analyze this image and guide me on what it is about.' },
        { type: 'image_url', image_url: { url: imageUrl } },
      ];
    } else {
      currentUserContent = userMessage;
    }

    if (
      (userMessage || imageUrl) &&
      (formattedHistory.length === 0 ||
        formattedHistory[formattedHistory.length - 1]?.content !== userMessage)
    ) {
      messages.push({ role: 'user', content: currentUserContent });
    }

    // 5. Send to Groq Vision Model
    const completion = await groq.chat.completions.create({
      messages,
      model: 'qwen/qwen3.6-27b',
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