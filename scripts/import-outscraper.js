#!/usr/bin/env node
/**
 * Import Outscraper JSON data into listings-db.json
 * 
 * Usage: node scripts/import-outscraper.js <path-to-outscraper-json> <serviceId>
 * 
 * Example:
 *   node scripts/import-outscraper.js ~/Downloads/epilation_laser.json laser
 *   node scripts/import-outscraper.js ~/Downloads/cryolipolyse.json cryo
 *   node scripts/import-outscraper.js ~/Downloads/hydrafacial.json hydra
 *   node scripts/import-outscraper.js ~/Downloads/injections.json injections
 */

const fs = require('fs');
const path = require('path');

// Configuration
const LISTINGS_DB_PATH = path.join(__dirname, '../src/data/listings-db.json');

// Get command line arguments
const args = process.argv.slice(2);
if (args.length < 1) {
    console.error('Usage: node import-outscraper.js <outscraper-json-path> [serviceId]');
    console.error('');
    console.error('serviceId options: laser, cryo, hydra, injections');
    console.error('If not specified, will try to detect from query field');
    process.exit(1);
}

const inputPath = args[0];
const forceServiceId = args[1] || null;

// Helper: slugify name for ID
function slugify(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Helper: detect serviceId from query
function detectServiceId(query) {
    const q = (query || '').toLowerCase();
    if (q.includes('épilation') || q.includes('epilation') || q.includes('laser')) return 'laser';
    if (q.includes('cryolipolyse') || q.includes('cryo')) return 'cryo';
    if (q.includes('hydrafacial') || q.includes('hydra')) return 'hydra';
    if (q.includes('injection') || q.includes('botox') || q.includes('esthétique') || q.includes('medecine')) return 'injections';
    return 'laser'; // default
}

// Helper: transform Outscraper record to our format
function transformRecord(record, defaultServiceId) {
    const serviceId = forceServiceId || detectServiceId(record.query) || defaultServiceId;
    const name = record.name || '';
    const city = record.city || '';
    const zipCode = String(record.postal_code || '').padStart(5, '0');

    // Generate unique ID
    const id = slugify(`${name}-${zipCode}`);

    // Parse reviews per score
    const reviewsPerScore = record.reviews_per_score || null;

    return {
        id,
        name,
        serviceId,
        address: record.street || record.address || '',
        city,
        zipCode,
        lat: record.latitude || 0,
        lng: record.longitude || 0,
        phone: record.phone || '',
        website: record.website || '',
        rating: typeof record.rating === 'number' ? record.rating : 0,
        reviewCount: typeof record.reviews === 'number' ? Math.floor(record.reviews) : 0,
        reviewsPerScore: reviewsPerScore,
        reviewsLink: record.reviews_link || '',
        imageUrl: record.photo && record.photo.startsWith('http') ? record.photo : '/images/placeholder-listing.jpg',
        gmapsUrl: record.location_link || '',
        verified: record.verified === true,
        workingHours: record.working_hours || null,
        bookingUrl: record.booking_appointment_link || record.website || ''
    };
}

// Main import function
async function importData() {
    console.log('📥 Importing Outscraper data...');
    console.log(`   Input: ${inputPath}`);

    // Read input file
    if (!fs.existsSync(inputPath)) {
        console.error(`❌ File not found: ${inputPath}`);
        process.exit(1);
    }

    const rawData = fs.readFileSync(inputPath, 'utf-8');
    let records;

    try {
        records = JSON.parse(rawData);
    } catch (e) {
        console.error('❌ Failed to parse JSON:', e.message);
        process.exit(1);
    }

    if (!Array.isArray(records)) {
        console.error('❌ Expected an array of records');
        process.exit(1);
    }

    console.log(`   Found ${records.length} records`);

    // Read existing listings
    let existingListings = [];
    if (fs.existsSync(LISTINGS_DB_PATH)) {
        existingListings = JSON.parse(fs.readFileSync(LISTINGS_DB_PATH, 'utf-8'));
        console.log(`   Existing listings: ${existingListings.length}`);
    }

    // Create a map of existing IDs to avoid duplicates
    const existingIds = new Set(existingListings.map(l => l.id));
    const existingPlaceIds = new Set(existingListings.map(l => l.gmapsUrl).filter(Boolean));

    // Transform and filter records
    let added = 0;
    let skipped = 0;
    let duplicates = 0;

    const newListings = [];

    for (const record of records) {
        // Skip if no name
        if (!record.name) {
            skipped++;
            continue;
        }

        // Skip if business is closed
        if (record.business_status === 'CLOSED_PERMANENTLY' || record.business_status === 'CLOSED_TEMPORARILY') {
            skipped++;
            continue;
        }

        // Transform record
        const listing = transformRecord(record);

        // Check for duplicates by ID or gmaps URL
        if (existingIds.has(listing.id)) {
            duplicates++;
            continue;
        }

        if (listing.gmapsUrl && existingPlaceIds.has(listing.gmapsUrl)) {
            duplicates++;
            continue;
        }

        // Add to new listings
        newListings.push(listing);
        existingIds.add(listing.id);
        existingPlaceIds.add(listing.gmapsUrl);
        added++;
    }

    console.log(`   ✅ Added: ${added}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   🔄 Duplicates: ${duplicates}`);

    // Merge and save
    const mergedListings = [...existingListings, ...newListings];

    // Sort by rating descending
    mergedListings.sort((a, b) => b.rating - a.rating);

    // Write to file
    fs.writeFileSync(LISTINGS_DB_PATH, JSON.stringify(mergedListings, null, 2));

    console.log(`   📁 Total listings: ${mergedListings.length}`);
    console.log(`   💾 Saved to: ${LISTINGS_DB_PATH}`);

    // Print stats by service
    const byService = {};
    for (const l of mergedListings) {
        byService[l.serviceId] = (byService[l.serviceId] || 0) + 1;
    }
    console.log('\n📊 Listings by service:');
    for (const [service, count] of Object.entries(byService)) {
        console.log(`   ${service}: ${count}`);
    }

    // Print stats by city (top 10)
    const byCity = {};
    for (const l of mergedListings) {
        byCity[l.city] = (byCity[l.city] || 0) + 1;
    }
    const topCities = Object.entries(byCity)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    console.log('\n📍 Top 10 cities:');
    for (const [city, count] of topCities) {
        console.log(`   ${city}: ${count}`);
    }
}

// Run
importData().catch(console.error);
