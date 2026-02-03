/**
 * Geo Utilities for BeautyBeaute.fr
 * Haversine formula for distance calculation and nearby cities
 */

import { City, NearbyCity } from '@/types';

const EARTH_RADIUS_KM = 6371;

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
}

/**
 * Calculate distance between two points using Haversine formula
 * @returns Distance in kilometers
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c;
}

/**
 * Get the N closest cities to a given city
 */
export function getNearbyCities(
    city: City,
    allCities: City[],
    limit: number = 10
): NearbyCity[] {
    const citiesWithDistance = allCities
        .filter((c) => c.slug !== city.slug) // Exclude current city
        .map((c) => ({
            ...c,
            distance: calculateDistance(city.coordinates.lat, city.coordinates.lng, c.coordinates.lat, c.coordinates.lng),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);

    return citiesWithDistance;
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)} m`;
    }
    return `${Math.round(km)} km`;
}

/**
 * Get cities within a radius (useful for local SEO)
 */
export function getCitiesWithinRadius(
    city: City,
    allCities: City[],
    radiusKm: number
): NearbyCity[] {
    return allCities
        .filter((c) => c.slug !== city.slug)
        .map((c) => ({
            ...c,
            distance: calculateDistance(city.coordinates.lat, city.coordinates.lng, c.coordinates.lat, c.coordinates.lng),
        }))
        .filter((c) => c.distance <= radiusKm)
        .sort((a, b) => a.distance - b.distance);
}
