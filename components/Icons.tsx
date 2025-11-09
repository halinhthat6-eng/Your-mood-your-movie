

import React from 'react';

type IconProps = {
  className?: string;
};

export const StarIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.818 3.765 4.156.604c.73.106 1.021.996.494 1.508l-3.008 2.932.71 4.138c.125.726-.638 1.282-1.29.952L10 15.174l-3.722 1.956c-.652.33-1.415-.226-1.29-.952l.71-4.138-3.008-2.932c-.527-.512-.236-1.402.494-1.508l4.156-.604 1.818-3.765z" clipRule="evenodd" />
  </svg>
);

export const DirectorIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

export const ActorsIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962a3.752 3.752 0 0 1-4.498 0 3 3 0 0 1-4.498 0" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.121 21.121c-2.399 2.399-6.326 2.399-8.725 0-2.399-2.399-2.399-6.326 0-8.725 2.399-2.399 6.326-2.399 8.725 0 2.399 2.399 2.399 6.326 0 8.725Z" />
    </svg>
);

export const QuoteIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M14.017 18h-2.017v-6h2.017v6zm-8 0h-2v-6h2v6zm4-14c-4.411 0-8 3.589-8 8s3.589 8 8 8 8-3.589 8-8-3.589-8-8-8zm0 14c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691-6-6-6z" />
    </svg>
);

export const ReviewIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3.75h9m-9 3.75h3.75m-3.75 0h.008v.015h-.008V15zm-2.25-8.25h13.5M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
  </svg>
);

export const TencentVideoIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M19.33,10.63,12,16.29,4.67,10.63,3,12l9,9,9-9Z" />
        <path d="M12,3,3,9,4.67,10.63,12,5.71,19.33,10.63,21,9Z" />
    </svg>
);

export const IQiyiIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <circle cx="12" cy="4" r="2.5" />
        <path d="M12,8c-3.86,0-7,3.14-7,7s3.14,7,7,7,7-3.14,7-7S15.86,8,12,8Zm0,12c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5S14.76,20,12,20Z" />
    </svg>
);

export const YoukuIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <circle cx="12" cy="12" r="10" />
    </svg>
);

export const BilibiliIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M14,10v4h-4v-4Zm-6-6v16h12V4ZM4,2H20a2,2,0,0,1,2,2V20a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V4A2,2,0,0,1,4,2Z" />
    </svg>
);

export const MangoTVIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12,2A10,10,0,0,0,2,12a10,10,0,0,0,10,10,10,10,0,0,0,10-10A10,10,0,0,0,12,2Zm0,18a8,8,0,0,1-8-8,8,8,0,0,1,8-8,8,8,0,0,1,8,8,8,8,0,0,1-8-8Z" />
        <path d="M12,7a5,5,0,0,0-5,5,1,1,0,0,0,2,0,3,3,0,0,1,3-3,1,1,0,0,0,0-2Z" />
    </svg>
);

export const NetflixIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M15.34 22.5h-3.32V11.84L8.66 22.5H5.5V2.5h3.32v10.66L12.18 2.5h3.16v20z"/></svg>
);

export const LinkIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
);

export const FilmIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m-3.75-3.75v3.75m-3.75-3.75v3.75c0 .621.504 1.125 1.125 1.125h13.5c.621 0 1.125-.504 1.125-1.125v-3.75M12 3.75v3.75m-3.75-3.75v3.75m-3.75-3.75v3.75M3 15h18M3 8.25h18M3 11.25h18" />
    </svg>
);
  
export const SparklesIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.562L16.25 21.75l-.648-1.188a2.25 2.25 0 01-1.47-1.47L12.964 18l1.188-.648a2.25 2.25 0 011.47-1.47L16.25 15l.648 1.188a2.25 2.25 0 011.47 1.47L19.536 18l-1.188.648a2.25 2.25 0 01-1.47 1.47z" />
    </svg>
);

export const RefreshIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-3.181-3.183l-3.181-3.182a8.25 8.25 0 00-11.664 0l-3.181 3.182" />
    </svg>
);
