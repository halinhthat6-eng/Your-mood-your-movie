import { GoogleGenAI, Type } from "@google/genai";
import { Movie } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const movieRecommendationSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { 
        type: Type.STRING, 
        description: "The full original title of the movie." 
      },
      year: { 
        type: Type.INTEGER, 
        description: "The year the movie was released." 
      },
       posterUrl: {
        type: Type.STRING,
        description: "The full, complete, and valid URL for the movie's poster image from themoviedb.org, using the w500 size. Example: https://image.tmdb.org/t/p/w500/qA5kPYpshYvyC_d25K_7T2I4u24.jpg",
      },
      director: { 
        type: Type.STRING, 
        description: "The director of the movie." 
      },
      actors: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "A list of the main actors in the movie."
      },
      tmdbRating: { 
        type: Type.NUMBER, 
        description: "The movie's rating on The Movie Database (TMDb), to one decimal place." 
      },
      plotSummary: { 
        type: Type.STRING, 
        description: "A concise plot summary of the movie." 
      },
      userReviews: {
        type: Type.ARRAY,
        description: "A list of 2-3 popular user reviews from themoviedb.org.",
        items: {
          type: Type.OBJECT,
          properties: {
            username: {
              type: Type.STRING,
              description: "The username of the person who wrote the review."
            },
            date: {
              type: Type.STRING,
              description: "The date the review was posted, e.g., '2023-05-15'."
            },
            comment: {
              type: Type.STRING,
              description: "The text content of the user review."
            }
          },
          required: ["username", "date", "comment"]
        }
      },
      streamingLinks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { 
              type: Type.STRING, 
              description: "Name of the streaming platform (e.g., Netflix, 腾讯视频, 爱奇艺, Bilibili, 优酷, 芒果TV)." 
            },
            url: { 
              type: Type.STRING, 
              description: "A direct, valid URL to watch the movie on the platform." 
            }
          },
          required: ["name", "url"]
        },
        description: "A list of platforms where the movie can be streamed."
      }
    },
    required: ["title", "year", "posterUrl", "director", "actors", "tmdbRating", "plotSummary", "userReviews", "streamingLinks"]
  }
};


export const getMovieRecommendations = async (prompt: string): Promise<Movie[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following mood and thoughts, please act as an expert movie recommendation agent. Recommend 2-3 relevant movies. For each movie, provide details sourced from The Movie Database (themoviedb.org), including its full poster image URL, TMDb rating, release year, director, main actors, and a few representative user reviews (with username and date). Additionally, please find direct links to watch it on major streaming platforms like Netflix, Tencent Video, iQIYI, Youku, Bilibili, or Mango TV.

User's input: "${prompt}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: movieRecommendationSchema,
        temperature: 0.7,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Basic validation to ensure the response is an array
    if (!Array.isArray(parsedData)) {
      console.error("Gemini API did not return an array:", parsedData);
      throw new Error("Received an invalid format from the recommendation service.");
    }

    return parsedData as Movie[];
    
  } catch (error) {
    console.error("Error fetching movie recommendations:", error);
    throw new Error("Failed to get movie recommendations from the AI service.");
  }
};