/**
 * Cities Data Loader
 * Provides typed access to 35K French cities with utility functions
 */

import { City } from '@/types';
import citiesData from './cities-full.json';

// Type assertion and sort by population descending
let loadedCities: City[] = (citiesData as City[]).sort(
    (a, b) => b.population - a.population
);

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
        // On clone pour ne pas muter l'original si utilisé ailleurs, mais ici on remplace le slug
        // En fait, on veut juste que CETTE ville soit accessible via le slug simple
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
