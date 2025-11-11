import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server"; // 如果你用纯Vite则用vercel函数风格见下方

const API_KEY = process.env.API_KEY;

export const config = {
  runtime: "edge",
};

export default async function handler(req: NextRequest) {
  try {
    const { prompt, language } = await req.json();

    if (!API_KEY) {
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const langInstruction =
      language === "zh"
        ? "电影标题应使用原语言，但如果合适请优先推荐中文电影。"
        : "The movie titles should be in their original English language.";

    const response = await model.generateContent(
      `Based on the user's request, suggest 3-4 movies. For each movie, provide only its title and release year in JSON array.
${langInstruction}
User's request: "${prompt}"`
    );

    const text = response.response.text().trim();
    const movies = JSON.parse(text);
    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
  }
}

