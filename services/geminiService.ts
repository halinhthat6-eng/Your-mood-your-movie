
import { GoogleGenAI, Type } from "@google/genai";

// API_KEY is automatically injected by the environment
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const movieTitlesSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { 
        type: Type.STRING, 
        description: "The original title of the movie." 
      },
      year: { 
        type: Type.INTEGER, 
        description: "The release year of the movie." 
      },
    },
    required: ["title", "year"]
  }
};

export interface MovieTitle {
  title: string;
  year: number;
}

export const getMovieTitles = async (prompt: string, language: 'zh' | 'en'): Promise<MovieTitle[]> => {
  try {
    const langInstruction = language === 'zh' 
      ? "The movie titles should be in their original language, but prioritize well-known Chinese films if relevant."
      : "The movie titles should be in their original English language, or the most common English title.";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the user's request, suggest 3-4 movies. For each movie, provide only its original title and its release year. Do not provide any other information. ${langInstruction}

User's request: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieTitlesSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    if (!Array.isArray(parsedData)) {
      console.error("Gemini API did not return an array:", parsedData);
      throw new Error("Received an invalid format from the recommendation service.");
    }

    return parsedData as MovieTitle[];
    
  } catch (error) {
    console.error("Error fetching movie titles from Gemini:", error);
    throw new Error("Failed to get movie recommendations from the AI service.");
  }
};
