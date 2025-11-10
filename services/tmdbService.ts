import { Movie, StreamingPlatform, UserReview } from '../types';
import { MovieTitle } from './geminiService';

// IMPORTANT: This API key is provided by the user.
// In a production environment, this should be stored securely in an environment variable.
const TMDB_API_KEY = '1d95f39ca6c000ffe7ccc9cf71daf2ce';
const TMDB_API_BASE_URL = 'https://api.themoviedb.org/3';

const getLanguageCode = (lang: 'zh' | 'en') => (lang === 'zh' ? 'zh-CN' : 'en-US');

// Statically define streaming platforms to always provide search links.
// Logo paths are sourced from the TMDb API for consistency.
const predefinedStreamingPlatforms = [
  { name: 'Netflix', logoPath: '/t2yyOv40HZeVlLjYsCsPHnWLk4W.jpg', searchUrl: (title: string) => `https://www.netflix.com/search?q=${encodeURIComponent(title)}` },
  { name: 'YouTube', logoPath: '/hTCNs222p0wpcp6b24I2zI4962Z.jpg', searchUrl: (title: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}` },
  { name: 'Tencent Video', logoPath: '/y2h0h2sYn2f7rvvG3j52402T6z6.jpg', searchUrl: (title: string) => `https://v.qq.com/x/search/?q=${encodeURIComponent(title)}` },
  { name: 'iQIYI', logoPath: '/2wOYsEprY7fO0H1ll2Mv2Qc5b2E.jpg', searchUrl: (title: string) => `https://www.iq.com/search?query=${encodeURIComponent(title)}` },
  { name: 'Youku', logoPath: '/h59J22j5L1s2Kx1L2aL05g5O6R.jpg', searchUrl: (title: string) => `https://so.youku.com/search_video/q_${encodeURIComponent(title)}` },
  { name: 'Bilibili', logoPath: '/3g7h24ds923A390aC0EVB1L2vSl.jpg', searchUrl: (title: string) => `https://search.bilibili.com/all?keyword=${encodeURIComponent(title)}` },
  { name: 'Mango TV', logoPath: '/7BUH3bPW2o1M5y2i7g02HPSVj54.jpg', searchUrl: (title: string) => `https://so.mgtv.com/so?k=${encodeURIComponent(title)}` },
];


const searchMovie = async (title: string, year: number, language: string): Promise<number | null> => {
    const url = `${TMDB_API_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}&year=${year}&language=${language}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(`TMDb search failed for "${title}" with status: ${response.status}`);
            return null;
        }
        const data = await response.json();
        return data.results && data.results.length > 0 ? data.results[0].id : null;
    } catch (error) {
        console.error(`Error during TMDb search for "${title}":`, error);
        return null;
    }
};

const getMovieDetails = async (movieId: number, language: string): Promise<Movie | null> => {
    const detailsUrl = `${TMDB_API_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=${language}&append_to_response=credits`;
    // Fetch reviews from the dedicated endpoint to get all languages, sorted by latest
    const reviewsUrl = `${TMDB_API_BASE_URL}/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}`;

    try {
        const [detailsResponse, reviewsResponse] = await Promise.all([
            fetch(detailsUrl),
            fetch(reviewsUrl)
        ]);

        if (!detailsResponse.ok) {
            console.error(`TMDb details fetch failed for ID ${movieId} with status: ${detailsResponse.status}`);
            return null;
        }
        
        const data = await detailsResponse.json();
        
        let reviewsData = { results: [] };
        if (reviewsResponse.ok) {
            reviewsData = await reviewsResponse.json();
        } else {
            console.warn(`Could not fetch reviews for movie ID ${movieId}. Status: ${reviewsResponse.status}`);
        }

        const director = data.credits?.crew?.find((person: any) => person.job === 'Director')?.name || 'N/A';
        const actors = data.credits?.cast?.slice(0, 5).map((actor: any) => actor.name) || [];
        
        const userReviews: UserReview[] = reviewsData.results?.slice(0, 5).map((review: any) => ({
            username: review.author,
            date: new Date(review.created_at).toLocaleDateString(),
            // Truncate long comments for better display
            comment: review.content.length > 350 ? review.content.substring(0, 350) + '...' : review.content,
        })) || [];
        
        // Always generate search links for predefined streaming platforms.
        const streamingLinks: StreamingPlatform[] = predefinedStreamingPlatforms.map(platform => ({
            name: platform.name,
            url: platform.searchUrl(data.title),
            logoPath: platform.logoPath,
        }));

        return {
            title: data.title,
            year: new Date(data.release_date).getFullYear(),
            director,
            actors,
            tmdbRating: data.vote_average,
            plotSummary: data.overview,
            userReviews,
            streamingLinks,
            posterPath: data.poster_path,
        };
    } catch (error) {
        console.error(`Error fetching TMDb details for movie ID ${movieId}:`, error);
        return null;
    }
};

export const getMovieDataByTitle = async (movieInfo: MovieTitle, lang: 'zh' | 'en'): Promise<Movie | null> => {
    const languageCode = getLanguageCode(lang);

    const movieId = await searchMovie(movieInfo.title, movieInfo.year, languageCode);
    if (!movieId) {
        console.warn(`Movie "${movieInfo.title} (${movieInfo.year})" not found on TMDb.`);
        return null;
    }

    return getMovieDetails(movieId, languageCode);
};