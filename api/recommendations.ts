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

    const apiKey = process.env.API_KEY;

    // ✅ 检查环境变量
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

    // ✅ 用 query 参数方式传递 key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;

    const geminiResponse = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a movie recommendation expert. Based on the user's request, suggest 3-4 movies. 
Return ONLY valid JSON in this format:
[
  {"title": "Movie Title", "year": 2019},
  {"title": "Another Film", "year": 2021}
]
User request: "${prompt}"
Language: ${language === "zh" ? "Chinese" : "English"}`
              },
            ],
          },
        ],
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("❌ Gemini API error:", geminiResponse.status, errText);

      return new Response(
        JSON.stringify({
          message: "Gemini API request failed",
          status: geminiResponse.status,
          details: errText,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await geminiResponse.json();
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

    let parsedMovies;
    try {
      parsedMovies = JSON.parse(text);
    } catch (err) {
      console.error("⚠️ Gemini returned non-JSON response:", text);
      return new Response(
        JSON.stringify({
          message: "Invalid response format from Gemini API",
          raw: text,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsedMovies), {
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
