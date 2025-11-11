import type { NextApiRequest, NextApiResponse } from "next";

interface MovieTitle {
  title: string;
  year: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 仅允许 POST 请求
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { prompt, language } = req.body;

  if (!prompt) {
    return res.status(400).json({ message: "Missing prompt" });
  }

  try {
    // 调用 Google Gemini API
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GOOGLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `请推荐 5 部${language === "zh" ? "中文" : "英文"}电影，主题是：${prompt}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API Error:", errText);
      return res.status(500).json({ message: "Gemini API request failed." });
    }

    const data = await response.json();

    // 从 Gemini 返回的文本中解析电影列表
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const movies = text
      .split("\n")
      .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((line: string) => line.length > 0)
      .map((title: string) => ({ title, year: 0 })) as MovieTitle[];

    return res.status(200).json(movies);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return res
      .status(500)
      .json({ message: "Internal server error calling Gemini API." });
  }
}

