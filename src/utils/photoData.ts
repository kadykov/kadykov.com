import { photoManifestSchema, type PhotoManifestItem } from './photoManifestSchema';

const manifestUrl = 'https://share.kadykov.com/image_manifest.json';

let cachedManifest: PhotoManifestItem[] | null = null;
let fetchPromise: Promise<PhotoManifestItem[]> | null = null;

/**
 * Fetches, parses, and validates the photo manifest.
 * Implements in-memory caching to avoid multiple fetches during a single build process.
 * @returns A promise that resolves to an array of PhotoManifestItem.
 * @throws Error if fetching or parsing fails.
 */
export async function fetchPhotoManifest(): Promise<PhotoManifestItem[]> {
  if (cachedManifest) {
    return cachedManifest;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      console.log('Fetching photo manifest...'); // Log to see how often it's called
      const response = await fetch(manifestUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch manifest from ${manifestUrl}: ${response.statusText} (status ${response.status})`);
      }
      const jsonData = await response.json();
      const parsed = photoManifestSchema.safeParse(jsonData);

      if (!parsed.success) {
        console.error('Failed to parse photo manifest:', parsed.error.flatten());
        throw new Error('Failed to parse photo manifest: ' + parsed.error.toString());
      }

      cachedManifest = parsed.data;
      return cachedManifest;
    } catch (error) {
      // Ensure fetchPromise is cleared on error so subsequent calls can retry
      fetchPromise = null;
      // Re-throw the error to be handled by the caller
      if (error instanceof Error) {
        console.error(`Error in fetchPhotoManifest: ${error.message}`);
        throw error;
      } else {
        console.error('An unknown error occurred in fetchPhotoManifest');
        throw new Error('An unknown error occurred while fetching photo manifest.');
      }
    } finally {
      // Clear the promise lock once resolved or rejected, unless it resolved to cache.
      // If it cached, future calls hit the cache. If it failed, fetchPromise is already null.
      // This simple caching assumes the manifest doesn't change *during a single build*.
    }
  })();

  return fetchPromise;
}
