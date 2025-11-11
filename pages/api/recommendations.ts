export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Only POST requests allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { prompt, language } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ message: "Missing prompt" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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
              parts: [{ text: `请推荐 5 部${language === "zh" ? "中文" : "英文"}电影，主题是：${prompt}` }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    const movies = text
      .split("\n")
      .map(line => line.replace(/^\d+\.\s*/, "").trim())
      .filter(Boolean)
      .map(title => ({ title, year: 0 }));

    return new Response(JSON.stringify(movies), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ message: "Error calling Gemini API" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


