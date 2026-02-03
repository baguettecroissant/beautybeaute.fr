/**
 * CSV Cleaner Script for BeautyBeaute.fr
 * Analyzes raw_listings.csv and outputs a cleaned version with proper headers
 * 
 * Run: node scripts/clean-csv.js
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const inputPath = path.join(__dirname, '../raw_listings.csv');
const outputPath = path.join(__dirname, '../raw_listings_cleaned.csv');

// Read CSV
const csvContent = fs.readFileSync(inputPath, 'utf-8');

// Parse with relaxed settings
const records = parse(csvContent, {
    columns: false,  // Parse as array
    skip_empty_lines: false,
    trim: true,
    relax_column_count: true,
    relax_quotes: true,
});

console.log(`📄 Found ${records.length} rows in CSV`);

// Check if row is a valid listing
function isValidListing(row) {
    return row[0] && row[0].includes('google.fr/maps/place');
}

// Extract zip code and city from any text
function extractZipAndCity(text) {
    if (!text) return null;

    // Match French postal code (5 digits) followed by city name
    const match = text.match(/(\d{5})\s*([A-Za-zÀ-ÿ\-\s]+?)(?:\s+France|\s*$)/i);
    if (match) {
        return {
            zipCode: match[1],
            city: match[2].trim()
        };
    }

    // Just zip code
    const zipMatch = text.match(/\b(\d{5})\b/);
    if (zipMatch) {
        return { zipCode: zipMatch[1], city: '' };
    }

    return null;
}

// Check if a string looks like a street address
function isStreetAddress(text) {
    if (!text || text.length < 5 || text.length > 150) return false;

    // Exclude obvious non-addresses
    if (/^(http|Ouvert|Fermé|·|Centre|Clinique|Institut|Cabinet|Médecin|Spa|Club)/i.test(text)) return false;
    if (text.includes('gstatic.com') || text.includes('googleusercontent')) return false;
    if (text.includes('google.com/maps')) return false;
    if (text.includes('doctolib.fr') || text.includes('planity.com')) return false;

    // French street patterns
    const streetPatterns = [
        /\d+\s*(rue|avenue|av\.|boulevard|bd\.|cours|cr\s|chemin|chem\.|place|pl\.|allée|all\.|quai|route|rte\.?|impasse|passage)/i,
        /\b(rue|avenue|boulevard|cours|chemin|place|allée|quai|route)\s+\w+/i,
        /\bBâtiment\b/i,
        /\bEspace\b/i,
        /\d{1,3}(,?\s*bis)?\s+(rue|av|bd|cr)/i,
    ];

    return streetPatterns.some(p => p.test(text));
}

// Check if text contains a French postal code
function hasPostalCode(text) {
    return /\b\d{5}\b/.test(text);
}

function extractAddress(row) {
    let address1 = '';
    let address2 = '';

    // Scan all columns to find address-like content
    const candidates = [];

    for (let i = 4; i < Math.min(row.length, 15); i++) {
        const cell = (row[i] || '').trim();
        if (!cell) continue;

        // Check if it's a street address
        if (isStreetAddress(cell)) {
            candidates.push({ value: cell, hasZip: hasPostalCode(cell), index: i });
        }
    }

    // Sort: prefer addresses with zip codes, then by position
    candidates.sort((a, b) => {
        if (a.hasZip && !b.hasZip) return -1;
        if (!a.hasZip && b.hasZip) return 1;
        return a.index - b.index;
    });

    if (candidates.length > 0) {
        address1 = candidates[0].value;
    }
    if (candidates.length > 1) {
        address2 = candidates[1].value;
    }

    // If no address found but there's location info, try columns 5-7
    if (!address1) {
        for (let i = 5; i <= 7; i++) {
            const cell = (row[i] || '').trim();
            if (cell && cell !== '·' && cell.length > 3 &&
                !cell.startsWith('http') &&
                !cell.startsWith('Ouvert') &&
                !cell.startsWith('Fermé') &&
                !cell.startsWith('· ') &&
                !cell.includes('googleusercontent') &&
                !cell.includes('gstatic')) {

                // Check if it might be a partial address
                if (/\d/.test(cell) && cell.length < 100) {
                    address1 = cell;
                    break;
                }
            }
        }
    }

    return { address1, address2 };
}

function extractImage(row) {
    for (let i = 0; i < row.length; i++) {
        const cell = (row[i] || '').trim();
        if (cell.includes('googleusercontent.com') &&
            (cell.includes('/p/AF') || cell.includes('gpscss')) &&
            !cell.includes('default_user')) {
            return cell;
        }
    }
    return '';
}

function cleanRow(row) {
    if (!isValidListing(row)) return null;

    const gmapsLink = row[0] || '';
    const name = (row[1] || '').trim();
    const rating = (row[2] || '').trim();
    const reviews = (row[3] || '').trim();

    if (!name) return null;

    const { address1, address2 } = extractAddress(row);
    const image = extractImage(row);

    return {
        gmaps_link: gmapsLink,
        name: name,
        rating: rating,
        reviews: reviews,
        address_1: address1,
        address_2: address2,
        image: image,
    };
}

// Process all rows
const cleanedRows = [];
for (const row of records) {
    const cleaned = cleanRow(row);
    if (cleaned) {
        cleanedRows.push(cleaned);
    }
}

console.log(`✅ Cleaned ${cleanedRows.length} valid listings`);

// Generate CSV output
const headers = ['gmaps_link', 'name', 'rating', 'reviews', 'address_1', 'address_2', 'image'];

function escapeCSV(value) {
    const str = String(value || '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

const csvLines = [headers.join(',')];
for (const row of cleanedRows) {
    const line = headers.map(h => escapeCSV(row[h])).join(',');
    csvLines.push(line);
}

fs.writeFileSync(outputPath, csvLines.join('\n'), 'utf-8');
console.log(`📁 Cleaned CSV saved to: ${outputPath}`);

// Show sample with address
const sampleWithAddress = cleanedRows.find(r => r.address_1);
console.log('\n📋 Sample with address:');
console.log(JSON.stringify(sampleWithAddress || cleanedRows[0], null, 2));

// Stats
const withAddress = cleanedRows.filter(r => r.address_1).length;
const withImage = cleanedRows.filter(r => r.image).length;
console.log(`\n📊 Extraction stats:`);
console.log(`   With address_1: ${withAddress}/${cleanedRows.length}`);
console.log(`   With image: ${withImage}/${cleanedRows.length}`);

// Now replace original with cleaned
fs.copyFileSync(outputPath, path.join(__dirname, '../raw_listings.csv'));
console.log(`\n✅ Original raw_listings.csv replaced with cleaned version`);
