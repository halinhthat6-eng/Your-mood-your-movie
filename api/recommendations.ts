// api/recommendations.ts
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  try {
    const { prompt } = req.body;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      throw new Error("Missing Gemini API key in environment variables");
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `推荐几部电影，基于这个描述：${prompt}` }] }],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Error in /api/recommendations:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
