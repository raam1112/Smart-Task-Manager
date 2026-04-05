import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.OPENAI_API_KEY || '';
const openai = new OpenAI({ apiKey });

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API Key is not configured." }, { status: 500 });
  }

  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages.length - 1]?.content;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful AI assistant for the 'Smart Task Manager' web application. Your goal is to help users understand how to use the app, explain features like priority tracking and task boards, and give productivity tips. Be concise, friendly, and act naturally. Provide realistic advice." 
        },
        { role: "user", content: latestMessage }
      ],
    });

    return NextResponse.json({ message: response.choices[0].message.content });
  } catch (error: any) {
    console.error("OpenAI API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process chat." }, { status: 500 });
  }
}
