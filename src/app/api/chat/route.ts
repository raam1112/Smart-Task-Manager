import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API Key is not configured." }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    
    // We get the last message and append it to the chat
    const latestMessage = messages[messages.length - 1]?.content;

    // We can format history if needed for the SDK, but let's keep it simple for now
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create prompt structure with context
    const prompt = `You are a helpful AI assistant for the 'Smart Task Manager' web application.
Your goal is to help users understand how to use the app, explain features like priority tracking and task boards, and give productivity tips.
Be concise, friendly, and act naturally. Provide realistic advice.

User asks: ${latestMessage}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ message: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat." }, { status: 500 });
  }
}
