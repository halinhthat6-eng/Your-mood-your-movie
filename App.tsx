
import React, { useState, useCallback, useEffect } from 'react';
import { Movie } from './types';
import { getMovieTitles } from './services/geminiService';
import { getMovieDataByTitle } from './services/tmdbService';
import MovieCard from './components/MovieCard';
import LoadingSpinner from './components/LoadingSpinner';
import { MvIcon, SparklesIcon, RefreshIcon, LanguageIcon } from './components/Icons';

const allSuggestionPromptsZh = [
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

const allSuggestionPromptsEn = [
  "Feeling down, want to watch something healing",
  "A comedy that can make me laugh out loud",
  "Recommend a mind-bending sci-fi movie",
  "An animated movie suitable for the whole family",
  "A classic Hong Kong martial arts film",
  "Find a highly-rated European art film",
  "A romantic movie for a couple's weekend night",
  "Any documentaries about food?",
  "An action blockbuster with stunning visual effects",
  "Recommend a film that makes you contemplate life",
  "Any good mystery movies lately?",
  "I want to watch a true biographical film",
];

const uiText = {
  zh: {
    subtitle: "分享你的心情、想法或想要的类型，我会为你找到完美的电影。",
    placeholder: "告诉我你的心情、喜欢的类型、国家或特定年代...",
    proTip: "专业提示：使用 Cmd/Ctrl + Enter 提交。",
    suggestionHeader: "或者试试这些想法：",
    errorInput: "请输入你的心情或想法。",
    errorAPI: "抱歉，查找推荐时遇到问题，请重试。",
    loading: "正在咨询电影宇宙...",
    initialMessage: "你的专属电影之夜正等待开启。",
    recommendationsHeader: "你的推荐",
    refresh: "刷新",
    language: "中文",
    getRecommendations: "为我推荐",
    refreshRecommendations: "换一批推荐",
  },
  en: {
    subtitle: "Share your mood, thoughts, or desired genre, and I'll find the perfect movies for you.",
    placeholder: "Tell me about your mood, a genre you like, a country, or a specific decade...",
    proTip: "Pro-tip: Use Cmd/Ctrl + Enter to submit.",
    suggestionHeader: "Or try one of these ideas:",
    errorInput: "Please tell me how you are feeling or what you are thinking about.",
    errorAPI: "Sorry, I had trouble finding recommendations. Please try again.",
    loading: "Consulting the cinematic cosmos...",
    initialMessage: "Your personalized movie night awaits.",
    recommendationsHeader: "Your Recommendations",
    refresh: "Refresh",
    language: "English",
    getRecommendations: "Get Recommendations",
    refreshRecommendations: "Refresh recommendations",
  }
};

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [lastUsedInput, setLastUsedInput] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestionPrompts, setSuggestionPrompts] = useState<string[]>([]);
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const currentUiText = uiText[language];
  const currentPrompts = language === 'zh' ? allSuggestionPromptsZh : allSuggestionPromptsEn;

  useEffect(() => {
    const shuffled = [...currentPrompts].sort(() => 0.5 - Math.random());
    setSuggestionPrompts(shuffled.slice(0, 6));
  }, [language, currentPrompts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
  };
  
  const fetchRecommendations = useCallback(async (prompt: string) => {
    if (!prompt.trim()) {
      setError(currentUiText.errorInput);
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecommendations([]);
    setLastUsedInput(prompt);

    try {
      const movieTitles = await getMovieTitles(prompt, language);
      
      const moviePromises = movieTitles.map(movieInfo => 
        getMovieDataByTitle(movieInfo, language)
      );
      
      const moviesData = await Promise.all(moviePromises);
      const validMovies = moviesData.filter((movie): movie is Movie => movie !== null);

      if (validMovies.length === 0) {
        throw new Error("Could not find details for any of the recommended movies.");
      }

      setRecommendations(validMovies);

    } catch (e) {
      console.error(e);
      setError(currentUiText.errorAPI);
    } finally {
      setIsLoading(false);
    }
  }, [language, currentUiText]);
  
  const handleGetRecommendations = () => {
    fetchRecommendations(userInput);
  }

  const handleRefreshRecommendations = () => {
    if (lastUsedInput) {
        fetchRecommendations(lastUsedInput);
    }
  }

  const handleSuggestionClick = (prompt: string) => {
    setUserInput(prompt);
    fetchRecommendations(prompt);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGetRecommendations();
    }
  };
  
  const toggleLanguage = () => {
    setLanguage(prevLang => {
        const newLang = prevLang === 'zh' ? 'en' : 'zh';
        // Clear recommendations when language changes
        setRecommendations([]);
        setError(null);
        setUserInput('');
        return newLang;
    });
  }

  return (
    <div className="min-h-screen text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-6xl mx-auto flex justify-between items-center mb-6 md:mb-10">
        <div className="flex items-center gap-3">
          <MvIcon className="h-10 w-10 text-cyan-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 glow-text tracking-wider">
            🎬 Your mood, your movie.
          </h1>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 rounded-lg text-sm transition-colors"
          aria-label={`Switch to ${language === 'zh' ? 'English' : '中文'}`}
        >
          <LanguageIcon className="h-5 w-5" />
          <span>{language === 'zh' ? 'English' : '中文'}</span>
        </button>
      </header>

      <main className="w-full max-w-3xl mx-auto flex-grow flex flex-col">
        <div className="bg-slate-900/50 backdrop-blur-sm border border-cyan-400/10 rounded-xl p-6 md:p-8 shadow-2xl shadow-slate-950/50">
          <p className="text-slate-300 text-center mb-6">{currentUiText.subtitle}</p>
          <div className="relative">
            <textarea
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={currentUiText.placeholder}
              className="w-full h-28 p-4 bg-slate-800/70 border border-slate-700 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-none transition-all duration-300"
              aria-label="User input for movie recommendations"
            />
            <span className="absolute bottom-2 right-3 text-xs text-slate-500">{currentUiText.proTip}</span>
          </div>
          <button
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className="w-full mt-4 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <>
                <LoadingSpinner />
                <span>{currentUiText.loading}</span>
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5" />
                <span>{currentUiText.getRecommendations}</span>
              </>
            )}
          </button>
          {error && <p className="text-red-400 text-sm mt-4 text-center">{error}</p>}
        </div>

        <div className="mt-8 text-center">
          <h2 className="text-slate-400 text-sm font-semibold mb-4">{currentUiText.suggestionHeader}</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestionPrompts.map(prompt => (
              <button
                key={prompt}
                onClick={() => handleSuggestionClick(prompt)}
                className="bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 text-sm px-4 py-2 rounded-full transition-colors duration-200 border border-slate-700"
              >
                {prompt}
              </button>
            ))}
             <button onClick={() => {
                const shuffled = [...currentPrompts].sort(() => 0.5 - Math.random());
                setSuggestionPrompts(shuffled.slice(0, 6));
             }} className="p-2 bg-slate-800/60 hover:bg-slate-700/80 rounded-full transition-colors duration-200 border border-slate-700" aria-label={currentUiText.refresh}>
                <RefreshIcon className="h-5 w-5 text-slate-300" />
            </button>
          </div>
        </div>

        <div className="mt-12 w-full">
            {isLoading && !recommendations.length && (
              <div className="text-center flex flex-col items-center justify-center p-8">
                <LoadingSpinner />
                <p className="mt-4 text-slate-400">{currentUiText.loading}</p>
              </div>
            )}

            {!isLoading && !recommendations.length && (
                <div className="text-center p-8">
                    <MvIcon className="h-16 w-16 text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500">{currentUiText.initialMessage}</p>
                </div>
            )}

            {recommendations.length > 0 && (
              <>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                      <h2 className="text-2xl font-bold text-slate-200">{currentUiText.recommendationsHeader}</h2>
                       <button
                          onClick={handleRefreshRecommendations}
                          disabled={isLoading}
                          className="p-2 bg-slate-800/60 hover:bg-slate-700/80 rounded-full transition-all duration-200 border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={currentUiText.refreshRecommendations}
                      >
                          <RefreshIcon className="h-5 w-5 text-slate-300" />
                      </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {recommendations.map((movie, index) => (
                    <MovieCard key={`${movie.title}-${index}`} movie={movie} language={language} />
                  ))}
                </div>
              </>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
