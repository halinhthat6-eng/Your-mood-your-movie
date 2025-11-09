import React from 'react';
import { Movie } from '../types';
import { StarIcon, DirectorIcon, ActorsIcon, ReviewIcon, PlayIcon } from './Icons';
import StreamingLink from './StreamingLink';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {

  return (
    <div className="bg-cyan-400/5 backdrop-blur-md rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col border border-cyan-300/10 hover:border-cyan-300/30 hover:shadow-cyan-500/10">
      <div className="relative">
        <img src={movie.posterUrl} alt={`${movie.title} poster`} className="w-full h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-bold text-slate-100 pr-2">{movie.title}</h2>
          <div className="flex items-center gap-1 bg-cyan-400/20 text-cyan-300 font-bold px-2 py-1 rounded-md text-sm flex-shrink-0 border border-cyan-400/30">
            <StarIcon className="h-4 w-4" />
            <span>{movie.tmdbRating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-sm text-slate-400 mb-4">{movie.year}</p>

        <p className="text-slate-300 text-sm mb-4 leading-relaxed flex-grow">{movie.plotSummary}</p>

        <div className="space-y-3 text-sm mb-5">
            <div className="flex items-center gap-2 text-slate-400">
                <DirectorIcon className="h-5 w-5 flex-shrink-0 text-cyan-400" />
                <span className="font-semibold text-slate-300 mr-1">Director:</span>
                <span>{movie.director}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
                <ActorsIcon className="h-5 w-5 flex-shrink-0 mt-0.5 text-cyan-400" />
                <span className="font-semibold text-slate-300 mr-1">Actors:</span>
                <span>{movie.actors.join(', ')}</span>
            </div>
        </div>
        
        <div className="mb-5">
            <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-2">
                <ReviewIcon className="h-5 w-5 text-cyan-400" />
                User Reviews
            </h3>
            <div className="h-40 space-y-2 overflow-y-auto rounded-lg bg-slate-900/40 p-3 border border-slate-700/50">
                {movie.userReviews.length > 0 ? movie.userReviews.map((review, index) => (
                    <div key={index} className="bg-slate-800/50 p-3 rounded-md text-sm">
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-cyan-300 text-xs">{review.username}</p>
                            <p className="text-slate-500 text-xs">{review.date}</p>
                        </div>
                        <p className="text-slate-300 italic">"{review.comment}"</p>
                    </div>
                )) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-slate-500">No user reviews available.</p>
                    </div>
                )}
            </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-cyan-300/10">
          <h3 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <PlayIcon className="h-5 w-5 text-cyan-400" />
            Watch Now On
          </h3>
          <div className="flex flex-wrap gap-2">
            {movie.streamingLinks.length > 0 ? (
                movie.streamingLinks.map(link => <StreamingLink key={link.url} platform={link} />)
            ) : (
                <p className="text-xs text-slate-500">No streaming links available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;