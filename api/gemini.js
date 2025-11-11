import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  try {
    const { prompt, language } = req.body;

    const API_KEY = process.env.API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "Missing API key" });
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
    res.status(200).json(movies);
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}

