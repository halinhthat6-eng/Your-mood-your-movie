import React from 'react';
import { StreamingPlatform } from '../types';
import { LinkIcon } from './Icons';

interface StreamingLinkProps {
  platform: StreamingPlatform;
}

// Use the recommended 'media' subdomain for consistency and reliability.
const TMDB_LOGO_BASE_URL = 'https://media.themoviedb.org/t/p/w45';

const StreamingLink: React.FC<StreamingLinkProps> = ({ platform }) => {
  const logoUrl = platform.logoPath ? `${TMDB_LOGO_BASE_URL}${platform.logoPath}` : null;

  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400/20 text-slate-300 hover:text-cyan-200 text-xs font-medium pl-2 pr-3 py-1.5 rounded-full transition-colors duration-200 border border-transparent hover:border-cyan-400/30"
    >
      {logoUrl ? (
        <img src={logoUrl} alt={`${platform.name} logo`} className="h-5 w-5 rounded-full" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
      <span>{platform.name}</span>
    </a>
  );
};

export default StreamingLink;