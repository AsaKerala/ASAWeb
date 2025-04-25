import { MediaCoverage } from './types';
import { api } from '../lib/api';

export async function getMediaCoverage(): Promise<MediaCoverage[]> {
  try {
    const { data } = await api.get('/media-coverage');
    return data;
  } catch (error) {
    console.error('Failed to fetch media coverage:', error);
    throw error;
  }
} 