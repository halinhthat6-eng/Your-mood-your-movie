
import React from 'react';
import { StreamingPlatform } from '../types';
import { BilibiliIcon, IQiyiIcon, MangoTVIcon, TencentVideoIcon, YoukuIcon, LinkIcon, NetflixIcon } from './Icons';

interface StreamingLinkProps {
  platform: StreamingPlatform;
}

const platformIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
  '腾讯视频': TencentVideoIcon,
  '爱奇艺': IQiyiIcon,
  '优酷': YoukuIcon,
  '芒果TV': MangoTVIcon,
  'bilibili': BilibiliIcon,
  'Bilibili': BilibiliIcon,
  '哔哩哔哩': BilibiliIcon,
  'Netflix': NetflixIcon,
};

const getPlatformIcon = (name: string) => {
  for (const key in platformIcons) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return platformIcons[key];
    }
  }
  return LinkIcon;
};


const StreamingLink: React.FC<StreamingLinkProps> = ({ platform }) => {
  const Icon = getPlatformIcon(platform.name);
  return (
    <a
      href={platform.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 bg-cyan-400/10 hover:bg-cyan-400/20 text-slate-300 hover:text-cyan-200 text-xs font-medium px-3 py-1.5 rounded-full transition-colors duration-200 border border-transparent hover:border-cyan-400/30"
    >
      <Icon className="h-4 w-4" />
      <span>{platform.name}</span>
    </a>
  );
};

export default StreamingLink;
