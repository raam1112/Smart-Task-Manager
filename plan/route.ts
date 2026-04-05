import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "Gemini API Key is not configured." }, { status: 500 });
  }

  try {
    const { tasks } = await req.json();
    
    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ suggestion: "You have no tasks! Enjoy your free time or add some tasks to get started." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `You are an expert productivity coach. Here is a list of the user's tasks right now:
${JSON.stringify(tasks, null, 2)}

Provide a very concise, motivating paragraph (3-4 sentences) outlining what they should focus on next based on priorities (high, medium, low) and status (todo, in-progress, completed). Don't use markdown formatting like bold/italics, just plain text.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ suggestion: text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate plan." }, { status: 500 });
  }
}
