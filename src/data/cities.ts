/**
 * Cities Data Loader
 * Provides typed access to major French cities with utility functions
 */

import { City } from '@/types';
import citiesData from './cities.json';

// Extended type to handle both formats
interface RawCity {
    name: string;
    slug: string;
    zip?: string;
    zipCode?: string;
    department_code: string;
    population: number;
    lat?: number;
    lng?: number;
    coordinates?: { lat: number; lng: number };
    region?: string;
}

// Transform and normalize city data
function normalizeCity(raw: RawCity): City {
    return {
        name: raw.name,
        slug: raw.slug,
        zip: raw.zip || raw.zipCode || '',
        department_code: raw.department_code,
        population: raw.population || 0,
        lat: raw.lat || raw.coordinates?.lat || 0,
        lng: raw.lng || raw.coordinates?.lng || 0,
        region: raw.region,
    };
}

// Load, normalize, and deduplicate cities
const rawCities = (citiesData as RawCity[]).map(normalizeCity);

// Sort by population descending
rawCities.sort((a, b) => b.population - a.population);

// Deduplicate by city name (keep the one with highest population)
const cityByName = new Map<string, City>();
rawCities.forEach(city => {
    const normalizedName = city.name.toLowerCase().trim();
    if (!cityByName.has(normalizedName)) {
        cityByName.set(normalizedName, city);
    }
});

let loadedCities: City[] = Array.from(cityByName.values());

// Re-sort after deduplication
loadedCities.sort((a, b) => b.population - a.population);

// Patcher les slugs pour les grandes villes (Paris, Lyon, Marseille)
// On prend le premier arrondissement trouvé et on lui donne le slug simple
const majorCities = [
    { name: 'Paris', zipPrefix: '750', simpleSlug: 'paris' },
    { name: 'Lyon', zipPrefix: '690', simpleSlug: 'lyon' },
    { name: 'Marseille', zipPrefix: '130', simpleSlug: 'marseille' },
    { name: 'Nice', zipPrefix: '060', simpleSlug: 'nice' },
    { name: 'Bordeaux', zipPrefix: '330', simpleSlug: 'bordeaux' }
];

majorCities.forEach(major => {
    // Trouver une entrée correspondante (ex: Paris 1er ou un qui contient le nom avec le bon zip)
    const matchIndex = loadedCities.findIndex(c =>
        (c.slug === major.simpleSlug) || // Si existe déjà
        (c.name.toLowerCase() === major.name.toLowerCase() && c.zip.startsWith(major.zipPrefix))
    );

    if (matchIndex !== -1) {
        loadedCities[matchIndex].slug = major.simpleSlug;
    }
});

export const cities = loadedCities;

// Cache for faster lookups
const cityBySlugMap = new Map<string, City>();
cities.forEach((city) => cityBySlugMap.set(city.slug, city));

/**
 * Get city by slug - O(1) lookup
 */
export function getCityBySlug(slug: string): City | undefined {
    return cityBySlugMap.get(slug);
}

/**
 * Get all city slugs
 */
export function getAllCitySlugs(): string[] {
    return cities.map((c) => c.slug);
}

/**
 * Get top N cities by population (pre-sorted)
 */
export function getTopCities(limit: number = 20): City[] {
    return cities.slice(0, limit);
}

/**
 * Get cities by department
 */
export function getCitiesByDepartment(departmentCode: string): City[] {
    return cities.filter((c) => c.department_code === departmentCode);
}

/**
 * Get cities by region
 */
export function getCitiesByRegion(region: string): City[] {
    return cities.filter((c) => c.region === region);
}

/**
 * Get total city count
 */
export function getCityCount(): number {
    return cities.length;
}

/**
 * Search cities by name (for autocomplete)
 */
export function searchCities(query: string, limit: number = 10): City[] {
    const normalizedQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return cities
        .filter((c) =>
            c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(normalizedQuery)
        )
        .slice(0, limit);
}
