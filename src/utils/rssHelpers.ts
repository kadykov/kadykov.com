/**
 * RSS Feed Helpers
 *
 * Centralized logic for generating RSS feed items for blog posts and photos.
 * Ensures consistent enclosure handling across all RSS feeds.
 */

import type { CollectionEntry } from "astro:content"
import type { PhotoManifestItem } from "./photoManifestSchema"

export interface RSSItem {
  title: string
  pubDate: Date
  description: string
  link: string
  categories?: string[]
  enclosure?: {
    url: string
    type: string
    length: number
  }
}

/**
 * Create RSS item for a blog post
 *
 * Includes OpenGraph PNG image as enclosure for RSS readers.
 * OpenGraph images are 1200×630 PNG files, universally compatible.
 */
export function createBlogRSSItem(
  post: CollectionEntry<"blog">,
  siteUrl: string
): RSSItem {
  return {
    title: post.data.title,
    pubDate: post.data.pubDate,
    description: post.data.description,
    link: `${siteUrl}blog/${post.slug}/`,
    categories: post.data.tags || [],
    enclosure: {
      url: `${siteUrl}blog/${post.slug}/og.png`,
      type: "image/png",
      length: 0,
    },
  }
}

/**
 * Create RSS item for a photo
 *
 * Includes OpenGraph JPEG image as enclosure for RSS readers.
 * Note: OpenGraph images are 1200×630 and may be cropped for portrait photos.
 *
 * TODO: When non-AVIF optimized images are available, consider using
 * medium-resolution WebP/JPEG versions instead of cropped OG images.
 */
export function createPhotoRSSItem(
  photo: PhotoManifestItem,
  siteUrl: string
): RSSItem {
  return {
    title: photo.title || `Photo from ${photo.dateTaken || photo.relativePath}`,
    pubDate: photo.dateTaken
      ? new Date(photo.dateTaken)
      : new Date(photo.year ?? 0, (photo.month ?? 1) - 1, photo.day ?? 1),
    description: photo.description || photo.title || "",
    link: `${siteUrl}photo/${photo.slug}/`,
    categories: photo.tags || [],
    enclosure: {
      url: `${siteUrl}photo/${photo.slug}/og.jpg`,
      type: "image/jpeg",
      length: 0,
    },
  }
}
