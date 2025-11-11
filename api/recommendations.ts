console.log("Gemini key present:", !!process.env.API_KEY);

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ message: "Only POST requests allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { prompt, language } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ message: "Missing prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ 检查环境变量是否存在
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("❌ Gemini API key not found in environment variables");
      return new Response(
        JSON.stringify({ message: "Missing Gemini API key on server" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // ✅ 调用 Gemini API
    const geminiResponse = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a movie recommendation expert. Based on the user's mood or request, suggest 3-4 movies. Respond only in valid JSON format as:
[
  {"title": "Movie title", "year": 2020},
  {"title": "Another movie", "year": 2018}
]
User's input: "${prompt}"
Language: ${language === "zh" ? "Chinese" : "English"}`
                },
              ],
            },
          ],
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("❌ Gemini API error:", geminiResponse.status, errorText);
      return new Response(
        JSON.stringify({
          message: `Gemini API error: ${geminiResponse.status}`,
          details: errorText,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await geminiResponse.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      console.error("⚠️ Failed to parse Gemini response:", text);
      return new Response(
        JSON.stringify({
          message: "Invalid response from Gemini API",
          raw: text,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("❌ Error in recommendations API:", err);
    return new Response(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
