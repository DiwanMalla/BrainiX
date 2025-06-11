import { unstable_cache } from 'next/cache';

// Cache duration in seconds
const CACHE_DURATION = 60; // 1 minute

export const getCachedCourses = unstable_cache(
  async (filters: any) => {
    // Your existing course fetching logic here
    return [];
  },
  ['courses'],
  {
    revalidate: CACHE_DURATION,
    tags: ['courses'],
  }
);

export const getCachedCategories = unstable_cache(
  async () => {
    // Your existing categories fetching logic here
    return [];
  },
  ['categories'],
  {
    revalidate: CACHE_DURATION,
    tags: ['categories'],
  }
);

export const getCachedUserData = unstable_cache(
  async (userId: string) => {
    // Your existing user data fetching logic here
    return null;
  },
  ['user-data'],
  {
    revalidate: CACHE_DURATION,
    tags: ['user-data'],
  }
);
