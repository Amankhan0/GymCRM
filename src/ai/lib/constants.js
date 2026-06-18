export const BRAND = 'Nyra';

export const ASPECT_RATIOS = [
  { id: '1:1', label: '1:1', hint: 'Square', box: 'h-6 w-6' },
  { id: '16:9', label: '16:9', hint: 'Landscape', box: 'h-[14px] w-6' },
  { id: '9:16', label: '9:16', hint: 'Portrait', box: 'h-6 w-[14px]' },
];

export const STYLES = [
  { id: 'none', label: 'Auto' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'photorealistic', label: 'Realistic' },
  { id: 'anime', label: 'Anime' },
  { id: '3d', label: '3D Render' },
  { id: 'digital-art', label: 'Digital Art' },
];

export const QUALITIES = [
  { id: 'standard', label: 'Standard' },
  { id: 'hd', label: 'HD' },
];

export const VIDEO_DURATIONS = [
  { id: '5', label: '5s' },
  { id: '10', label: '10s' },
];

export const VIDEO_FORMATS = [
  { id: 'horizontal', label: 'Horizontal', hint: '16:9' },
  { id: 'vertical', label: 'Vertical', hint: '9:16' },
];

export const VIDEO_RESOLUTIONS = [
  { id: '480p', label: '480p' },
  { id: '720p', label: '720p' },
  { id: '1080p', label: '1080p' },
];

// Local mirror of backend plans for the landing page (so it renders before the API responds).
export const PLAN_FALLBACK = [
  { key: 'starter', name: 'Starter', price: 499, credits: 200, video: false, perks: ['200 image credits / month', 'Standard quality', 'All aspect ratios', 'Generation history'] },
  { key: 'pro', name: 'Pro', price: 999, credits: 600, video: true, perks: ['600 credits / month', 'HD quality', 'Image + Video generation', 'Priority queue', 'Generation history'], highlight: true },
  { key: 'ultra', name: 'Ultra', price: 2499, credits: 2000, video: true, perks: ['2000 credits / month', 'Max quality', 'Image + Video generation', 'Fastest priority queue', 'Commercial license'] },
];
