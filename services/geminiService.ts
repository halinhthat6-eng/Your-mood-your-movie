export interface MovieTitle {
  title: string;
  year: number;
}

/**
 * 从后端 API 获取推荐电影标题
 */
export const getMovieTitles = async (
  prompt: string,
  language: 'zh' | 'en'
): Promise<MovieTitle[]> => {
  try {
    const response = await fetch('/api/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, language }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Invalid data from backend:", data);
      throw new Error("Invalid response format from backend");
    }

    return data as MovieTitle[];
  } catch (err) {
    console.error("Error in getMovieTitles:", err);
    throw new Error("Failed to get movie recommendations");
  }
};
