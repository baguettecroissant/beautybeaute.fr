import { MetadataRoute } from 'next';
import { services } from '@/data/services';
import { cities } from '@/data/cities';
import { getAllPosts } from '@/data/blog-posts';

const BASE_URL = 'https://beautybeaute.fr';
const URLS_PER_SITEMAP = 10000;

// Calculate total number of sitemaps needed
function getTotalSitemaps(): number {
    const blogPosts = getAllPosts();
    // Homepage + services + cities + (services * cities) + blog pages
    const staticPages = 1 + services.length + 4 + 1; // +4 for legal pages, +1 for blog listing
    const blogPages = blogPosts.length;
    const cityPages = cities.length; // /ville/[city] pages
    const serviceCityPages = services.length * cities.length; // /[service]/[city] pages
    const totalUrls = staticPages + blogPages + cityPages + serviceCityPages;
    return Math.ceil(totalUrls / URLS_PER_SITEMAP);
}

// Generate individual sitemap IDs
export async function generateSitemaps() {
    const totalSitemaps = getTotalSitemaps();
    return Array.from({ length: totalSitemaps }, (_, i) => ({ id: i }));
}

// Generate URLs for a specific sitemap chunk
export default async function sitemap({
    id,
}: {
    id: number;
}): Promise<MetadataRoute.Sitemap> {
    const urls: MetadataRoute.Sitemap = [];
    const blogPosts = getAllPosts();

    // Build all URLs array
    const allUrls: { url: string; priority: number; changeFrequency: 'weekly' | 'monthly' }[] = [];

    // 1. Static pages
    allUrls.push({ url: BASE_URL, priority: 1.0, changeFrequency: 'weekly' });
    allUrls.push({ url: `${BASE_URL}/pro`, priority: 0.7, changeFrequency: 'monthly' });
    allUrls.push({ url: `${BASE_URL}/blog`, priority: 0.8, changeFrequency: 'weekly' });
    allUrls.push({ url: `${BASE_URL}/mentions-legales`, priority: 0.3, changeFrequency: 'monthly' });
    allUrls.push({ url: `${BASE_URL}/confidentialite`, priority: 0.3, changeFrequency: 'monthly' });
    allUrls.push({ url: `${BASE_URL}/cookies`, priority: 0.3, changeFrequency: 'monthly' });

    // 2. Service landing pages
    for (const service of services) {
        allUrls.push({
            url: `${BASE_URL}/${service.slug}`,
            priority: 0.9,
            changeFrequency: 'weekly',
        });
    }

    // 3. Blog article pages
    for (const post of blogPosts) {
        allUrls.push({
            url: `${BASE_URL}/blog/${post.slug}`,
            priority: 0.7,
            changeFrequency: 'monthly',
        });
    }

    // 4. City pages (/ville/[city]) - ALL 35K cities
    for (const city of cities) {
        allUrls.push({
            url: `${BASE_URL}/ville/${city.slug}`,
            priority: 0.7,
            changeFrequency: 'monthly',
        });
    }

    // 4. Service/City combination pages (/[service]/[city]) - ALL combinations
    for (const service of services) {
        for (const city of cities) {
            allUrls.push({
                url: `${BASE_URL}/${service.slug}/${city.slug}`,
                priority: 0.8,
                changeFrequency: 'monthly',
            });
        }
    }

    // Calculate slice for this sitemap chunk
    const startIndex = id * URLS_PER_SITEMAP;
    const endIndex = startIndex + URLS_PER_SITEMAP;
    const chunkUrls = allUrls.slice(startIndex, endIndex);

    // Transform to sitemap format
    for (const item of chunkUrls) {
        urls.push({
            url: item.url,
            lastModified: new Date(),
            changeFrequency: item.changeFrequency,
            priority: item.priority,
        });
    }

    return urls;
}
