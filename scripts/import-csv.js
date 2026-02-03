/**
 * CSV Import Script for BeautyBeaute.fr
 * Parses raw_listings.csv and generates src/data/listings-db.json
 * 
 * Expected CSV columns (cleaned): gmaps_link, name, rating, reviews, address_1, address_2, image
 * 
 * Run: node scripts/import-csv.js
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const PLACEHOLDER_IMAGE = '/images/placeholder-listing.jpg';
const DEFAULT_SERVICE_ID = 'cryolipolyse';

/**
 * Generate a URL-safe slug from a string
 */
function slugify(text) {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric with hyphens
        .replace(/(^-|-$)/g, '')          // Remove leading/trailing hyphens
        .substring(0, 50);                 // Limit length
}

/**
 * Try to extract city from text (name or address)
 */
function extractCityFromText(text) {
    if (!text) return null;
    const normalized = text.toLowerCase();

    const cityPatterns = [
        { name: 'Lyon', patterns: [/\blyon\b/i, /69\d{3}/], defaultZip: '69000' },
        { name: 'Paris', patterns: [/\bparis\b/i, /75\d{3}/], defaultZip: '75000' },
        { name: 'Bordeaux', patterns: [/\bbordeaux\b/i, /33000/, /33\d{3}/], defaultZip: '33000' },
        { name: 'Marseille', patterns: [/\bmarseille\b/i, /13\d{3}/], defaultZip: '13000' },
        { name: 'Toulouse', patterns: [/\btoulouse\b/i, /31\d{3}/], defaultZip: '31000' },
        { name: 'Nice', patterns: [/\bnice\b/i, /06\d{3}/], defaultZip: '06000' },
        { name: 'Villeurbanne', patterns: [/\bvilleurbanne\b/i, /69100/], defaultZip: '69100' },
        { name: 'Ecully', patterns: [/\becully\b/i, /69130/], defaultZip: '69130' },
        { name: 'Oullins', patterns: [/\boullins\b/i, /69600/], defaultZip: '69600' },
        { name: 'Tassin', patterns: [/\btassin\b/i, /69160/], defaultZip: '69160' },
        { name: 'Le Bouscat', patterns: [/\bbouscat\b/i, /33110/], defaultZip: '33110' },
        { name: 'Arcachon', patterns: [/\barcachon\b/i, /33120/], defaultZip: '33120' },
        { name: 'Eysines', patterns: [/\beysines\b/i, /33320/], defaultZip: '33320' },
        { name: 'Audenge', patterns: [/\baudenge\b/i, /33980/], defaultZip: '33980' },
        { name: 'Saint-Étienne', patterns: [/\bst[.\s-]?etienne\b/i, /42\d{3}/], defaultZip: '42000' },
        { name: 'La Teste-de-Buch', patterns: [/\bla\s*teste\b/i, /33260/], defaultZip: '33260' },
    ];

    // First check for exact zip code patterns
    for (const city of cityPatterns) {
        for (const pattern of city.patterns) {
            if (pattern instanceof RegExp && pattern.test(normalized)) {
                // Try to extract specific zip code from text
                const zipMatch = text.match(/\b(\d{5})\b/);
                return {
                    city: city.name,
                    zipCode: zipMatch ? zipMatch[1] : city.defaultZip
                };
            }
        }
    }

    return null;
}

/**
 * Extract city and zip code from address and name
 */
function extractCityAndZip(fullAddress, name) {
    // First, try to find 5-digit French zip code in address
    const zipMatch = (fullAddress || '').match(/\b(\d{5})\b/);

    if (zipMatch) {
        const zipCode = zipMatch[1];

        // Try to get city name after zip code
        const afterZip = fullAddress.substring(fullAddress.indexOf(zipCode) + 5).trim();
        const cityMatch = afterZip.match(/^([A-Za-zÀ-ÿ\-\s]+?)(?:\s+France|\s*$)/i);

        if (cityMatch && cityMatch[1].trim().length > 1) {
            let city = cityMatch[1].trim()
                .split(/[\s-]+/)
                .filter(w => w.length > 0)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join('-');

            return { city, zipCode };
        }

        // Map zip code prefix to city
        const zipPrefixToCity = {
            '69': 'Lyon',
            '75': 'Paris',
            '33': 'Bordeaux',
            '13': 'Marseille',
            '31': 'Toulouse',
            '06': 'Nice',
            '44': 'Nantes',
            '67': 'Strasbourg',
            '34': 'Montpellier',
            '59': 'Lille',
            '42': 'Saint-Étienne',
        };

        const prefix = zipCode.substring(0, 2);
        if (zipPrefixToCity[prefix]) {
            return { city: zipPrefixToCity[prefix], zipCode };
        }
    }

    // Try to extract city from name
    const fromName = extractCityFromText(name);
    if (fromName) {
        return fromName;
    }

    // Try from address
    const fromAddress = extractCityFromText(fullAddress);
    if (fromAddress) {
        return fromAddress;
    }

    return { city: 'Inconnu', zipCode: '00000' };
}

/**
 * Parse a CSV row into a Listing object
 * Expected columns: gmaps_link, name, rating, reviews, address_1, address_2, image
 */
function parseRow(row) {
    // Get the name - skip empty rows
    const name = (row.name || '').trim();
    if (!name) return null;

    // Skip header-like rows
    if (name.toLowerCase() === 'name' || name.includes('Jn12ke')) return null;

    // Merge address fields: address_1 + address_2
    const address1 = (row.address_1 || row['W4Efsd 5'] || '').trim();
    const address2 = (row.address_2 || row['W4Efsd 6'] || '').trim();

    // Filter out status strings from address2
    let cleanAddress2 = address2;
    if (/^(Ouvert|Fermé|·)/i.test(cleanAddress2)) {
        cleanAddress2 = '';
    }

    const fullAddress = `${address1} ${cleanAddress2}`.replace(/\s+/g, ' ').trim();

    // Extract city and zip
    const { city, zipCode } = extractCityAndZip(fullAddress, name);

    // Parse rating (e.g., "4,5" or "4.5" or "5")
    const ratingStr = (row.rating || '0').replace(',', '.').trim();
    const rating = parseFloat(ratingStr) || 0;

    // Parse review count - handle "1 234" format (with spaces)
    const reviewStr = (row.reviews || '0').replace(/\s/g, '').replace(/[^0-9]/g, '');
    const reviewCount = parseInt(reviewStr, 10) || 0;

    // Generate ID from name and zip
    const id = `${slugify(name)}-${zipCode}`;

    // Get image URL
    let imageUrl = (row.image || '').trim();
    if (!imageUrl || imageUrl.includes('streetviewpixels') || !imageUrl.startsWith('http')) {
        imageUrl = PLACEHOLDER_IMAGE;
    }

    // Get Google Maps URL
    const gmapsUrl = (row.gmaps_link || '').trim();

    return {
        id,
        name,
        serviceId: DEFAULT_SERVICE_ID,
        address: fullAddress,
        city,
        zipCode,
        lat: 0,
        lng: 0,
        phone: '',
        website: '',
        rating: Math.round(rating * 10) / 10,
        reviewCount,
        imageUrl,
        gmapsUrl,
    };
}

/**
 * Main import function
 */
function importCSV() {
    const csvPath = path.join(__dirname, '../raw_listings.csv');
    const outputPath = path.join(__dirname, '../src/data/listings-db.json');

    // Check if CSV exists
    if (!fs.existsSync(csvPath)) {
        console.error(`❌ CSV file not found: ${csvPath}`);
        process.exit(1);
    }

    // Read and parse CSV
    const csvContent = fs.readFileSync(csvPath, 'utf-8');

    let records;
    try {
        records = parse(csvContent, {
            columns: true,           // Use first row as headers
            skip_empty_lines: true,
            trim: true,
            relax_column_count: true,
            relax_quotes: true,
        });
    } catch (error) {
        console.error('❌ Failed to parse CSV:', error.message);
        process.exit(1);
    }

    console.log(`📄 Found ${records.length} rows in CSV`);

    // Parse each row
    const listings = [];
    const seenIds = new Set();
    let skipped = 0;

    for (let i = 0; i < records.length; i++) {
        const listing = parseRow(records[i]);

        if (!listing) {
            skipped++;
            continue;
        }

        // Handle duplicate IDs
        let uniqueId = listing.id;
        let counter = 1;
        while (seenIds.has(uniqueId)) {
            uniqueId = `${listing.id}-${counter}`;
            counter++;
        }
        listing.id = uniqueId;
        seenIds.add(uniqueId);

        listings.push(listing);
    }

    // Write output
    fs.writeFileSync(outputPath, JSON.stringify(listings, null, 2), 'utf-8');

    console.log(`✅ Successfully imported ${listings.length} listings (${skipped} skipped)`);
    console.log(`📁 Output: ${outputPath}`);

    // Print sample
    if (listings.length > 0) {
        console.log('\n📋 Sample listing:');
        console.log(JSON.stringify(listings[0], null, 2));
    }

    // Print city distribution
    const cityDistribution = {};
    listings.forEach(l => {
        cityDistribution[l.city] = (cityDistribution[l.city] || 0) + 1;
    });
    console.log('\n🏙️  City distribution:');
    Object.entries(cityDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .forEach(([city, count]) => {
            console.log(`   ${city}: ${count}`);
        });

    // Warn about unknown cities
    if (cityDistribution['Inconnu'] > 0) {
        console.log(`\n⚠️  ${cityDistribution['Inconnu']} listings have unknown city - consider cleaning CSV with proper address_1/address_2 columns`);
    }
}

// Run the import
importCSV();
