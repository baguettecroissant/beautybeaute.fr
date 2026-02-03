/**
 * Post-process listings-db.json to extract lat/lng from Google Maps URLs
 * and improve city detection
 * 
 * Run: node scripts/enhance-listings.js
 */

const fs = require('fs');
const path = require('path');

const listingsPath = path.join(__dirname, '../src/data/listings-db.json');
const listings = JSON.parse(fs.readFileSync(listingsPath, 'utf-8'));

console.log(`📄 Processing ${listings.length} listings...`);

// Extract lat/lng from Google Maps URL
// Format: !8m2!3d45.7878131!4d4.7856434
function extractLatLng(gmapsUrl) {
    if (!gmapsUrl) return { lat: 0, lng: 0 };

    const latMatch = gmapsUrl.match(/!3d(-?\d+\.?\d*)/);
    const lngMatch = gmapsUrl.match(/!4d(-?\d+\.?\d*)/);

    if (latMatch && lngMatch) {
        return {
            lat: parseFloat(latMatch[1]),
            lng: parseFloat(lngMatch[1])
        };
    }

    return { lat: 0, lng: 0 };
}

// Determine city from lat/lng coordinates (approximate bounding boxes)
function getCityFromCoords(lat, lng) {
    // French city bounding boxes (approximate)
    const cities = [
        { name: 'Lyon', zip: '69000', latMin: 45.70, latMax: 45.82, lngMin: 4.75, lngMax: 4.92 },
        { name: 'Paris', zip: '75000', latMin: 48.80, latMax: 48.92, lngMin: 2.20, lngMax: 2.50 },
        { name: 'Bordeaux', zip: '33000', latMin: 44.78, latMax: 44.92, lngMin: -0.70, lngMax: -0.50 },
        { name: 'Marseille', zip: '13000', latMin: 43.20, latMax: 43.40, lngMin: 5.30, lngMax: 5.50 },
        { name: 'Toulouse', zip: '31000', latMin: 43.55, latMax: 43.70, lngMin: 1.35, lngMax: 1.55 },
        { name: 'Nice', zip: '06000', latMin: 43.65, latMax: 43.75, lngMin: 7.20, lngMax: 7.35 },
        { name: 'Villeurbanne', zip: '69100', latMin: 45.76, latMax: 45.79, lngMin: 4.87, lngMax: 4.92 },
        { name: 'Arcachon', zip: '33120', latMin: 44.60, latMax: 44.70, lngMin: -1.20, lngMax: -1.10 },
        { name: 'La Teste-de-Buch', zip: '33260', latMin: 44.60, latMax: 44.68, lngMin: -1.16, lngMax: -1.08 },
    ];

    // Expand Lyon area to include suburbs
    const lyonArea = { latMin: 45.65, latMax: 45.85, lngMin: 4.70, lngMax: 4.95, name: 'Lyon', zip: '69000' };
    // Expand Bordeaux area
    const bordeauxArea = { latMin: 44.75, latMax: 44.95, lngMin: -0.75, lngMax: 0.75, name: 'Bordeaux', zip: '33000' };

    // Check Lyon area first (most of our data is Lyon)
    if (lat >= lyonArea.latMin && lat <= lyonArea.latMax &&
        lng >= lyonArea.lngMin && lng <= lyonArea.lngMax) {
        return { city: 'Lyon', zipCode: '69000' };
    }

    // Check Bordeaux area
    if (lat >= bordeauxArea.latMin && lat <= bordeauxArea.latMax &&
        lng >= bordeauxArea.lngMin && lng <= bordeauxArea.lngMax) {
        return { city: 'Bordeaux', zipCode: '33000' };
    }

    // Check specific cities
    for (const c of cities) {
        if (lat >= c.latMin && lat <= c.latMax && lng >= c.lngMin && lng <= c.lngMax) {
            return { city: c.name, zipCode: c.zip };
        }
    }

    return null;
}

let enhanced = 0;
let citiesFixed = 0;

for (const listing of listings) {
    // Extract coordinates from URL
    const { lat, lng } = extractLatLng(listing.gmapsUrl);

    if (lat !== 0 && lng !== 0) {
        listing.lat = lat;
        listing.lng = lng;
        enhanced++;

        // If city is unknown, try to determine from coordinates
        if (listing.city === 'Inconnu' || listing.zipCode === '00000') {
            const cityInfo = getCityFromCoords(lat, lng);
            if (cityInfo) {
                listing.city = cityInfo.city;
                listing.zipCode = cityInfo.zipCode;
                // Update ID with new zip code
                const sluggedName = listing.id.replace(/-\d{5}(-\d+)?$/, '');
                listing.id = `${sluggedName}-${cityInfo.zipCode}`;
                citiesFixed++;
            }
        }
    }
}

// Write back
fs.writeFileSync(listingsPath, JSON.stringify(listings, null, 2), 'utf-8');

console.log(`✅ Enhanced ${enhanced} listings with coordinates`);
console.log(`✅ Fixed ${citiesFixed} unknown cities using geo-location`);

// City distribution after fix
const cityDistribution = {};
listings.forEach(l => {
    cityDistribution[l.city] = (cityDistribution[l.city] || 0) + 1;
});
console.log('\n🏙️  Updated city distribution:');
Object.entries(cityDistribution)
    .sort((a, b) => b[1] - a[1])
    .forEach(([city, count]) => {
        console.log(`   ${city}: ${count}`);
    });

// Sample with coordinates
const sample = listings.find(l => l.lat !== 0);
console.log('\n📋 Sample with coordinates:');
if (sample) {
    console.log(JSON.stringify(sample, null, 2));
}
