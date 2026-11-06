import type { MediaClip } from '../models/types';

/**
 * Dual-filtered curated YouTube feeds.
 * Queries mirror the scraper intent for Mindset Mastery and Orthodox Omilies.
 * Replace with live YouTube Data API results when an API key is configured.
 */
export const MINDSET_CLIPS: MediaClip[] = [
  {
    id: 'mindset-1',
    title: 'How to stop screwing yourself over',
    channel: 'TEDx Talks',
    youtubeId: 'Lp7E973zozc',
    queryTag: 'high performance discipline mindset',
  },
  {
    id: 'mindset-2',
    title: 'Deep Work — Rules for Focused Success',
    channel: 'Productivity Game',
    youtubeId: '8jPQjjsBbIc',
    queryTag: 'deep work cal newport focus',
  },
  {
    id: 'mindset-3',
    title: 'The surprising science of happiness',
    channel: 'TED',
    youtubeId: '4q1dgn_C0AU',
    queryTag: 'dopamine mental clarity happiness',
  },
  {
    id: 'mindset-4',
    title: 'Atomic Habits summary for builders',
    channel: 'Productivity Game',
    youtubeId: 'PZ7lDrwYdZc',
    queryTag: 'atomic habits systems thinking',
  },
  {
    id: 'mindset-5',
    title: 'Grit: the power of passion and perseverance',
    channel: 'TED',
    youtubeId: 'H14bBuluwB8',
    queryTag: 'grit perseverance high performance',
  },
];

export const ORTHODOX_CLIPS: MediaClip[] = [
  {
    id: 'orthodox-1',
    title: 'What is Orthodox Christianity?',
    channel: 'Trisagion Films',
    youtubeId: '0cKPmdhqPj0',
    queryTag: 'greek orthodox introduction theology',
  },
  {
    id: 'orthodox-2',
    title: 'The Jesus Prayer',
    channel: 'Orthodox Teaching',
    youtubeId: 'Rq8YjY0fQfI',
    queryTag: 'jesus prayer hesychasm orthodox',
  },
  {
    id: 'orthodox-3',
    title: 'On Fasting and Ascetic Struggle',
    channel: 'Orthodox Talks',
    youtubeId: 'GqL3bZ9f8kM',
    queryTag: 'orthodox fasting church fathers',
  },
  {
    id: 'orthodox-4',
    title: 'Humility according to the Fathers',
    channel: 'Patristic Reflections',
    youtubeId: 'YwK8n7m2p1A',
    queryTag: 'orthodox humility monastic fathers',
  },
  {
    id: 'orthodox-5',
    title: 'Evening Prayer & Stillness',
    channel: 'Byzantine Chant Archive',
    youtubeId: 'VZxX7kQ9n0E',
    queryTag: 'greek orthodox evening prayer omilia',
  },
];

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function youtubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}
