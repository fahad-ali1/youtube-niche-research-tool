// Re-export the YouTube client function from the oauth file
import { getYouTubeClient as getClient } from './youtube-oauth';

export const getYouTubeClient = getClient;
