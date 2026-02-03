/**
 * Mock Cities Generator for BeautyBeaute.fr
 * Generates 100 French cities: 50 major + 50 villages
 * Run: npx ts-node scripts/generate-mock-cities.ts
 */

import * as fs from 'fs';
import * as path from 'path';

interface City {
    name: string;
    slug: string;
    zipCode: string;
    department_code: string;
    population: number;
    lat: number;
    lng: number;
}

// 50 Real Major French Cities (accurate data)
const majorCities: City[] = [
    { name: 'Paris', slug: 'paris', zipCode: '75001', department_code: '75', population: 2161000, lat: 48.8566, lng: 2.3522 },
    { name: 'Marseille', slug: 'marseille', zipCode: '13001', department_code: '13', population: 870731, lat: 43.2965, lng: 5.3698 },
    { name: 'Lyon', slug: 'lyon', zipCode: '69001', department_code: '69', population: 522969, lat: 45.7640, lng: 4.8357 },
    { name: 'Toulouse', slug: 'toulouse', zipCode: '31000', department_code: '31', population: 493465, lat: 43.6047, lng: 1.4442 },
    { name: 'Nice', slug: 'nice', zipCode: '06000', department_code: '06', population: 342669, lat: 43.7102, lng: 7.2620 },
    { name: 'Nantes', slug: 'nantes', zipCode: '44000', department_code: '44', population: 314138, lat: 47.2184, lng: -1.5536 },
    { name: 'Montpellier', slug: 'montpellier', zipCode: '34000', department_code: '34', population: 295542, lat: 43.6108, lng: 3.8767 },
    { name: 'Strasbourg', slug: 'strasbourg', zipCode: '67000', department_code: '67', population: 284677, lat: 48.5734, lng: 7.7521 },
    { name: 'Bordeaux', slug: 'bordeaux', zipCode: '33000', department_code: '33', population: 260958, lat: 44.8378, lng: -0.5792 },
    { name: 'Lille', slug: 'lille', zipCode: '59000', department_code: '59', population: 236234, lat: 50.6292, lng: 3.0573 },
    { name: 'Rennes', slug: 'rennes', zipCode: '35000', department_code: '35', population: 222485, lat: 48.1173, lng: -1.6778 },
    { name: 'Reims', slug: 'reims', zipCode: '51100', department_code: '51', population: 182592, lat: 49.2583, lng: 4.0317 },
    { name: 'Saint-Étienne', slug: 'saint-etienne', zipCode: '42000', department_code: '42', population: 174082, lat: 45.4397, lng: 4.3872 },
    { name: 'Le Havre', slug: 'le-havre', zipCode: '76600', department_code: '76', population: 170147, lat: 49.4944, lng: 0.1079 },
    { name: 'Toulon', slug: 'toulon', zipCode: '83000', department_code: '83', population: 169634, lat: 43.1242, lng: 5.9280 },
    { name: 'Grenoble', slug: 'grenoble', zipCode: '38000', department_code: '38', population: 158198, lat: 45.1885, lng: 5.7245 },
    { name: 'Dijon', slug: 'dijon', zipCode: '21000', department_code: '21', population: 158002, lat: 47.3220, lng: 5.0415 },
    { name: 'Angers', slug: 'angers', zipCode: '49000', department_code: '49', population: 155850, lat: 47.4784, lng: -0.5632 },
    { name: 'Nîmes', slug: 'nimes', zipCode: '30000', department_code: '30', population: 151001, lat: 43.8367, lng: 4.3601 },
    { name: 'Villeurbanne', slug: 'villeurbanne', zipCode: '69100', department_code: '69', population: 150659, lat: 45.7676, lng: 4.8799 },
    { name: 'Aix-en-Provence', slug: 'aix-en-provence', zipCode: '13100', department_code: '13', population: 147122, lat: 43.5297, lng: 5.4474 },
    { name: 'Clermont-Ferrand', slug: 'clermont-ferrand', zipCode: '63000', department_code: '63', population: 146734, lat: 45.7772, lng: 3.0870 },
    { name: 'Le Mans', slug: 'le-mans', zipCode: '72000', department_code: '72', population: 144515, lat: 48.0061, lng: 0.1996 },
    { name: 'Brest', slug: 'brest', zipCode: '29200', department_code: '29', population: 140064, lat: 48.3904, lng: -4.4861 },
    { name: 'Tours', slug: 'tours', zipCode: '37000', department_code: '37', population: 136463, lat: 47.3941, lng: 0.6848 },
    { name: 'Amiens', slug: 'amiens', zipCode: '80000', department_code: '80', population: 134706, lat: 49.8941, lng: 2.2958 },
    { name: 'Limoges', slug: 'limoges', zipCode: '87000', department_code: '87', population: 132175, lat: 45.8336, lng: 1.2611 },
    { name: 'Annecy', slug: 'annecy', zipCode: '74000', department_code: '74', population: 131084, lat: 45.8992, lng: 6.1294 },
    { name: 'Perpignan', slug: 'perpignan', zipCode: '66000', department_code: '66', population: 120605, lat: 42.6886, lng: 2.8948 },
    { name: 'Besançon', slug: 'besancon', zipCode: '25000', department_code: '25', population: 117080, lat: 47.2378, lng: 6.0241 },
    { name: 'Metz', slug: 'metz', zipCode: '57000', department_code: '57', population: 116581, lat: 49.1193, lng: 6.1757 },
    { name: 'Orléans', slug: 'orleans', zipCode: '45000', department_code: '45', population: 116238, lat: 47.9029, lng: 1.9039 },
    { name: 'Rouen', slug: 'rouen', zipCode: '76000', department_code: '76', population: 113128, lat: 49.4432, lng: 1.0993 },
    { name: 'Mulhouse', slug: 'mulhouse', zipCode: '68100', department_code: '68', population: 108312, lat: 47.7508, lng: 7.3359 },
    { name: 'Caen', slug: 'caen', zipCode: '14000', department_code: '14', population: 106538, lat: 49.1829, lng: -0.3707 },
    { name: 'Nancy', slug: 'nancy', zipCode: '54000', department_code: '54', population: 104885, lat: 48.6921, lng: 6.1844 },
    { name: 'Argenteuil', slug: 'argenteuil', zipCode: '95100', department_code: '95', population: 104282, lat: 48.9472, lng: 2.2467 },
    { name: 'Saint-Denis', slug: 'saint-denis', zipCode: '93200', department_code: '93', population: 103742, lat: 48.9362, lng: 2.3574 },
    { name: 'Montreuil', slug: 'montreuil', zipCode: '93100', department_code: '93', population: 103068, lat: 48.8638, lng: 2.4486 },
    { name: 'Roubaix', slug: 'roubaix', zipCode: '59100', department_code: '59', population: 98828, lat: 50.6942, lng: 3.1746 },
    { name: 'Avignon', slug: 'avignon', zipCode: '84000', department_code: '84', population: 93671, lat: 43.9493, lng: 4.8055 },
    { name: 'Versailles', slug: 'versailles', zipCode: '78000', department_code: '78', population: 85205, lat: 48.8014, lng: 2.1301 },
    { name: 'Cannes', slug: 'cannes', zipCode: '06400', department_code: '06', population: 74152, lat: 43.5528, lng: 7.0174 },
    { name: 'La Rochelle', slug: 'la-rochelle', zipCode: '17000', department_code: '17', population: 77205, lat: 46.1603, lng: -1.1511 },
    { name: 'Antibes', slug: 'antibes', zipCode: '06600', department_code: '06', population: 73798, lat: 43.5808, lng: 7.1239 },
    { name: 'Béziers', slug: 'beziers', zipCode: '34500', department_code: '34', population: 78683, lat: 43.3449, lng: 3.2150 },
    { name: 'Troyes', slug: 'troyes', zipCode: '10000', department_code: '10', population: 61996, lat: 48.2973, lng: 4.0744 },
    { name: 'Chambéry', slug: 'chambery', zipCode: '73000', department_code: '73', population: 60100, lat: 45.5646, lng: 5.9178 },
    { name: 'Pau', slug: 'pau', zipCode: '64000', department_code: '64', population: 77627, lat: 43.2951, lng: -0.3708 },
    { name: 'Bayonne', slug: 'bayonne', zipCode: '64100', department_code: '64', population: 52006, lat: 43.4929, lng: -1.4748 },
];

// Generate 50 random village names with realistic French data
function generateVillages(): City[] {
    const prefixes = [
        'Saint-', 'Sainte-', 'La ', 'Le ', 'Les ', 'Château-', 'Mont-', 'Val-', 'Bois-', 'Pont-',
    ];
    const roots = [
        'Martin', 'Pierre', 'Jean', 'Marie', 'Michel', 'André', 'Paul', 'Louis', 'Georges', 'Henri',
        'Croix', 'Fontaine', 'Moulin', 'Église', 'Chapelle', 'Bourg', 'Ville', 'Fort', 'Roche', 'Pré',
    ];
    const suffixes = [
        '-sur-Mer', '-les-Bains', '-en-Beauce', '-le-Château', '-la-Forêt', '', '', '', '', '',
    ];

    const departments = [
        { code: '01', lat: 46.0, lng: 5.3 }, { code: '02', lat: 49.5, lng: 3.6 },
        { code: '03', lat: 46.3, lng: 3.4 }, { code: '04', lat: 44.1, lng: 6.2 },
        { code: '05', lat: 44.7, lng: 6.3 }, { code: '07', lat: 44.7, lng: 4.4 },
        { code: '08', lat: 49.7, lng: 4.7 }, { code: '09', lat: 42.9, lng: 1.6 },
        { code: '11', lat: 43.2, lng: 2.4 }, { code: '12', lat: 44.3, lng: 2.6 },
        { code: '15', lat: 45.0, lng: 2.7 }, { code: '16', lat: 45.6, lng: 0.1 },
        { code: '18', lat: 47.1, lng: 2.4 }, { code: '19', lat: 45.3, lng: 1.9 },
        { code: '23', lat: 46.2, lng: 2.0 }, { code: '24', lat: 45.0, lng: 0.7 },
        { code: '26', lat: 44.5, lng: 5.0 }, { code: '27', lat: 49.1, lng: 1.1 },
        { code: '28', lat: 48.3, lng: 1.5 }, { code: '32', lat: 43.7, lng: 0.6 },
    ];

    const villages: City[] = [];
    const usedNames = new Set<string>();

    for (let i = 0; i < 50; i++) {
        let name: string;
        do {
            const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
            const root = roots[Math.floor(Math.random() * roots.length)];
            const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
            name = `${prefix}${root}${suffix}`;
        } while (usedNames.has(name));

        usedNames.add(name);

        const dept = departments[i % departments.length];
        const latOffset = (Math.random() - 0.5) * 0.5;
        const lngOffset = (Math.random() - 0.5) * 0.5;

        const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        villages.push({
            name,
            slug,
            zipCode: `${dept.code}${String(100 + i).padStart(3, '0')}`,
            department_code: dept.code,
            population: Math.floor(Math.random() * 4500) + 500, // 500 - 5000
            lat: Number((dept.lat + latOffset).toFixed(4)),
            lng: Number((dept.lng + lngOffset).toFixed(4)),
        });
    }

    return villages;
}

// Main execution
const allCities: City[] = [...majorCities, ...generateVillages()];

// Sort by population (descending) for easier top-N selection
allCities.sort((a, b) => b.population - a.population);

const outputPath = path.join(__dirname, '../src/data/cities.json');
fs.writeFileSync(outputPath, JSON.stringify(allCities, null, 2), 'utf-8');

console.log(`✅ Generated ${allCities.length} cities to ${outputPath}`);
console.log(`   - ${majorCities.length} major cities`);
console.log(`   - ${allCities.length - majorCities.length} villages`);
