import { MetadataRoute } from 'next';
import { services } from '@/data/services';
import { cities } from '@/data/cities';
import { getAllPosts } from '@/data/blog-posts';

const BASE_URL = 'https://beautybeaute.fr';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const urls: MetadataRoute.Sitemap = [];
    const blogPosts = getAllPosts();

    // 1. Static pages
    urls.push({ url: BASE_URL, lastModified: new Date(), priority: 1.0, changeFrequency: 'weekly' });
    urls.push({ url: `${BASE_URL}/pro`, lastModified: new Date(), priority: 0.7, changeFrequency: 'monthly' });
    urls.push({ url: `${BASE_URL}/blog`, lastModified: new Date(), priority: 0.8, changeFrequency: 'weekly' });
    urls.push({ url: `${BASE_URL}/mentions-legales`, lastModified: new Date(), priority: 0.3, changeFrequency: 'monthly' });
    urls.push({ url: `${BASE_URL}/confidentialite`, lastModified: new Date(), priority: 0.3, changeFrequency: 'monthly' });
    urls.push({ url: `${BASE_URL}/cookies`, lastModified: new Date(), priority: 0.3, changeFrequency: 'monthly' });

    // 2. Service landing pages
    for (const service of services) {
        urls.push({
            url: `${BASE_URL}/${service.slug}`,
            lastModified: new Date(),
            priority: 0.9,
            changeFrequency: 'weekly',
        });
    }

    // 3. Blog article pages
    for (const post of blogPosts) {
        urls.push({
            url: `${BASE_URL}/blog/${post.slug}`,
            lastModified: new Date(),
            priority: 0.7,
            changeFrequency: 'monthly',
        });
    }

    // 4. City pages (/ville/[city])
    for (const city of cities) {
        urls.push({
            url: `${BASE_URL}/ville/${city.slug}`,
            lastModified: new Date(),
            priority: 0.7,
            changeFrequency: 'monthly',
        });
    }

    // 5. Service/City combination pages (/[service]/[city])
    for (const service of services) {
        for (const city of cities) {
            urls.push({
                url: `${BASE_URL}/${service.slug}/${city.slug}`,
                lastModified: new Date(),
                priority: 0.8,
                changeFrequency: 'monthly',
            });
        }
    }

    return urls;
}
