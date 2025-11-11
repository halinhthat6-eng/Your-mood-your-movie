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

  const response = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: `Recommend 3-4 movies based on: ${prompt}` }],
        },
      ],
    }),
  }
);


    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const movies = await response.json();
    return new Response(JSON.stringify(movies), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in recommendations API:", err);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
