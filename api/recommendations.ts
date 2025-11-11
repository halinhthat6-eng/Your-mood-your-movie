export const config = {
  runtime: "edge",
};

// ✅ Vercel Edge Function 写法
export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Only POST requests allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { prompt, language } = await req.json();

    // ✅ 从 Vercel 环境变量读取
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("❌ Missing API_KEY in environment variables");
      return new Response(JSON.stringify({ message: "Missing Gemini API key" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ 调用 Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Recommend 3-4 movies based on this user input: "${prompt}". 
                         Return JSON array of objects like [{ "title": "Movie Name", "year": 2023 }]. 
                         Respond in ${language === "zh" ? "Chinese" : "English"}.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API Error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          message: `Gemini API error: ${response.status}`,
          details: errorText,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const data = await response.json();

    // Gemini 返回的结构是 nested JSON → 这里解析一下
    let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    try {
      const parsed = JSON.parse(text);
      return new Response(JSON.stringify(parsed), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.warn("⚠️ Gemini did not return valid JSON. Raw text:", text);
      return new Response(text, {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (err) {
    console.error("🔥 Error in /api/recommendations:", err);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
