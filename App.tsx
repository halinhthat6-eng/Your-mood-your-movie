
import React, { useState, useCallback, useEffect } from 'react';
import { Movie } from './types';
import { getMovieRecommendations } from './services/geminiService';
import MovieCard from './components/MovieCard';
import LoadingSpinner from './components/LoadingSpinner';
import { FilmIcon, SparklesIcon, RefreshIcon } from './components/Icons';

const allSuggestionPrompts = [
  "心情低落，想看点治愈的",
  "一部能让我大笑的喜剧",
  "推荐一部烧脑的科幻片",
  "适合全家一起看的动画电影",
  "一部经典的香港武侠片",
  "找一部评分很高的欧洲文艺片",
  "周末晚上适合情侣看的浪漫电影",
  "有没有关于美食的纪录片",
  "一部视觉效果震撼的动作大片",
  "推荐一部让人思考人生的电影",
  "最近有什么好看的悬疑片吗",
  "想看一部真实的传记电影",
];

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestionPrompts, setSuggestionPrompts] = useState<string[]>([]);

  useEffect(() => {
    // Shuffle prompts and take the first 6 for display
    const shuffled = allSuggestionPrompts.sort(() => 0.5 - Math.random());
    setSuggestionPrompts(shuffled.slice(0, 6));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };

  const fetchRecommendations = useCallback(async () => {
    if (!userInput.trim()) {
      setError('Please tell me how you are feeling or what you are thinking about.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations([]);

    try {
      const movies = await getMovieRecommendations(userInput);
      setRecommendations(movies);
    } catch (e) {
      console.error(e);
      setError('Sorry, I had trouble finding recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);
  
  const handleSuggestionClick = (prompt: string) => {
    setUserInput(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      fetchRecommendations();
    }
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FilmIcon className="h-10 w-10 text-cyan-300" />
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-100 glow-text">
              AI Movie Oracle
            </h1>
          </div>
          <p className="text-lg text-slate-400">
            Share your mood, thoughts, or desired genre, and I'll find the perfect movies for you.
          </p>
        </header>

        <main className="w-full">
          <div className="relative mb-6">
            <textarea
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Tell me about your mood, a genre you like, a country, or a specific decade..."
              className="w-full h-32 p-4 pr-16 text-base bg-cyan-400/10 backdrop-blur-sm border border-cyan-300/20 rounded-lg focus:ring-2 focus:ring-cyan-300 focus:border-cyan-300 transition-all duration-300 resize-none placeholder-slate-400"
              rows={4}
              disabled={isLoading}
            />
            <button
              onClick={fetchRecommendations}
              disabled={isLoading || !userInput.trim()}
              className="absolute bottom-4 right-4 flex items-center justify-center h-10 w-10 bg-cyan-400/20 rounded-full text-cyan-300 hover:bg-cyan-400/30 hover:text-white disabled:bg-slate-700/50 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-cyan-400 shadow-[0_0_15px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)]"
              aria-label="Get Recommendations"
            >
              <SparklesIcon className="h-6 w-6" />
            </button>
          </div>
          <div className="text-xs text-center text-slate-500 mb-4 -mt-2">
            Pro-tip: Use Cmd/Ctrl + Enter to submit.
          </div>
          
          <div className="flex flex-col items-center gap-3 mb-8">
             <p className="text-sm text-slate-400">Or try one of these ideas:</p>
             <div className="flex flex-wrap justify-center gap-2">
                {suggestionPrompts.map((prompt) => (
                    <button
                    key={prompt}
                    onClick={() => handleSuggestionClick(prompt)}
                    className="bg-cyan-400/10 backdrop-blur-sm border border-transparent hover:border-cyan-400/50 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
                    >
                    {prompt}
                    </button>
                ))}
             </div>
          </div>


          {error && <p className="text-center text-red-300 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">{error}</p>}

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center mt-12">
              <LoadingSpinner />
              <p className="mt-4 text-lg text-slate-400">Consulting the cinematic cosmos...</p>
            </div>
          )}

          {!isLoading && recommendations.length === 0 && !error && (
             <div className="text-center text-slate-500 mt-16">
                <p>Your personalized movie night awaits.</p>
             </div>
          )}
          
          {!isLoading && recommendations.length > 0 && (
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-slate-300">Your Recommendations</h2>
              <button
                onClick={fetchRecommendations}
                disabled={isLoading}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-cyan-400/10 hover:bg-cyan-400/20 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                aria-label="Get new recommendations"
              >
                <RefreshIcon className="h-5 w-5" />
                <span>Refresh</span>
              </button>
            </div>
          )}


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recommendations.map((movie, index) => (
              <MovieCard key={`${movie.title}-${index}`} movie={movie} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
