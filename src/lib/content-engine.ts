/**
 * Deterministic Content Engine for BeautyBeaute.fr
 * Generates unique French content based on city and service
 * Uses seeded random for hydration-safe deterministic output
 */

import { Service, City, GeneratedContent, FAQItem } from '@/types';
import listingsDb from '@/data/listings-db.json';

// Seeded random number generator for deterministic output
function createSeededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return function () {
        hash = (hash * 1103515245 + 12345) & 0x7fffffff;
        return hash / 0x7fffffff;
    };
}

// Pick from array using seeded random
function pick<T>(arr: T[], random: () => number): T {
    return arr[Math.floor(random() * arr.length)];
}

// Normalize string to URL-safe slug (remove accents, special chars)
function slugify(str: string): string {
    return str
        .toLowerCase()
        .normalize('NFD') // Decompose accents
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
        .replace(/-+/g, '-') // Collapse multiple hyphens
        .replace(/^-|-$/g, ''); // Trim hyphens from ends
}

// Content templates (Intros, WhyChoose, etc.) - Kept same as before but shortened for brevity here
const metropolisIntros = [
    "Découvrez les meilleurs centres de {service} à {city}. Notre sélection des professionnels les plus qualifiés de la métropole vous garantit des résultats exceptionnels.",
    "À {city}, profitez de l'expertise des plus grands spécialistes en {service}. Comparez les avis, Prix et disponibilités des instituts de référence.",
    "La métropole de {city} regroupe l'élite des praticiens en {service}. Trouvez le centre idéal parmi notre sélection rigoureuse de professionnels certifiés.",
];

const urbanIntros = [
    "Trouvez le meilleur centre de {service} à {city}. Notre guide compare les instituts de la ville pour vous aider à faire le bon choix.",
    "À {city}, de nombreux professionnels proposent des soins de {service} de qualité. Découvrez notre sélection des meilleurs centres de la ville.",
    "Besoin d'un spécialiste en {service} à {city} ? Consultez notre comparatif des centres les plus recommandés de votre ville.",
];

const ruralIntros = [
    "Trouvez un spécialiste en {service} proche de {city}. Même dans votre région, des professionnels qualifiés vous accueillent pour des soins de qualité.",
    "À {city} et ses environs, découvrez les praticiens en {service} qui se déplacent ou proposent leurs services à proximité.",
    "Pas besoin d'aller loin ! Des experts en {service} exercent près de {city}. Trouvez un professionnel proche de chez vous.",
];

const whyChooseMetropolis = [
    "En tant que grande métropole française, {city} dispose d'un large éventail de centres spécialisés en {service}. Les professionnels de la ville suivent régulièrement des formations aux techniques les plus récentes.",
    "Choisir {city} pour votre {service}, c'est accéder aux meilleurs praticiens de France. La concurrence entre les établissements garantit un niveau de service optimal.",
];

const whyChooseUrban = [
    "À {city}, vous trouverez plusieurs centres de {service} répondant à vos attentes. La ville offre un bon équilibre entre qualité de soins et accessibilité.",
    "{city} propose une offre variée en matière de {service}. Comparez les établissements et choisissez celui qui correspond le mieux à vos besoins.",
];

const whyChooseRural = [
    "Bien que {city} soit une commune de taille modeste, des praticiens qualifiés proposent des services de {service} dans les environs. La proximité n'exclut pas la qualité.",
    "Les habitants de {city} ont accès à des centres de {service} de qualité à distance raisonnable. Découvrez les options disponibles dans votre secteur.",
];

export function generateContent(service: Service, city: City): GeneratedContent {
    const random = createSeededRandom(`${city.slug}-${service.slug}`);

    // Determine city size category
    const isMetropolis = city.population > 100000;
    const isUrban = city.population >= 10000;

    // Select intro templates based on population
    let introTemplates: string[];
    let whyChooseTemplates: string[];

    if (isMetropolis) {
        introTemplates = metropolisIntros;
        whyChooseTemplates = whyChooseMetropolis;
    } else if (isUrban) {
        introTemplates = urbanIntros;
        whyChooseTemplates = whyChooseUrban;
    } else {
        introTemplates = ruralIntros;
        whyChooseTemplates = whyChooseRural;
    }

    // Generate content with template replacement
    const intro = pick(introTemplates, random)
        .replace(/{city}/g, city.name)
        .replace(/{service}/g, service.name.toLowerCase());

    const whyChoose = pick(whyChooseTemplates, random)
        .replace(/{city}/g, city.name)
        .replace(/{service}/g, service.name.toLowerCase());

    // Generate H1
    const h1 = `Top 10 ${service.name} à ${city.name} (${city.zip}) - Avis & Prix 2026`;

    // Generate meta title (max 60 chars)
    const metaTitle = `${service.name} ${city.name} : Meilleurs Centres & Prix 2026`;

    // Generate meta description (max 155 chars)
    const metaDescription = `Comparez les ${isMetropolis ? 'meilleurs' : ''} centres de ${service.name.toLowerCase()} à ${city.name} (${city.department_code}). Avis clients, prix et disponibilités ${new Date().getFullYear()}.`;

    return {
        h1,
        metaTitle,
        metaDescription,
        introduction: intro,
        whyChooseCity: whyChoose,
    };
}

export function generateFAQ(service: Service, city: City): FAQItem[] {
    // Basic FAQ generation logic kept simple for brevity
    return [
        {
            question: `Quel est le prix moyen pour ${service.name} à ${city.name} ?`,
            answer: `Les tarifs à ${city.name} varient généralement selon la renommée du praticien et la complexité de l'intervention. Comptez en moyenne entre 50€ et 300€ par séance.`
        },
        {
            question: `Comment choisir son praticien à ${city.name} ?`,
            answer: `Vérifiez les avis certifiés, l'hygiène du cabinet et l'expérience du professionnel. BeautyBeauté vous aide à comparer les meilleurs centres de ${city.name}.`
        }
    ];
}

interface ListingSearchResult {
    id: string;
    name: string;
    address: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
    phone: string;
    imageUrl: string;
    slug: string;
    isReal: boolean;
    reviewsPerScore?: { [key: string]: number } | null;
    reviewsLink?: string;
    gmapsUrl?: string;
    lat?: number;
    lng?: number;
    zip?: string;
}

export function generateMockedCentres(service: Service, city: City): ListingSearchResult[] {
    const random = createSeededRandom(`centres-${city.slug}-${service.slug}`);

    // Map service slug to serviceId used in listings-db
    const serviceIdMap: Record<string, string[]> = {
        'epilation-laser': ['laser'],
        'cryolipolyse-minceur': ['cryo', 'cryolipolyse'],
        'soin-hydrafacial': ['hydra', 'hydrafacial'],
        'injections-esthetique': ['injections', 'botox'],
    };

    const validServiceIds = serviceIdMap[service.slug] || [service.id];

    // 1. Try to find REAL listings from DB
    // Filter by city name AND serviceId, then deduplicate by ID
    const realListings = (listingsDb as any[])
        .filter(l => {
            const cityMatch = l.city.toLowerCase() === city.name.toLowerCase() || l.zipCode === city.zip;
            const serviceMatch = validServiceIds.includes(l.serviceId);
            return cityMatch && serviceMatch;
        })
        .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

    if (realListings.length > 0) {
        return realListings.map(l => ({
            id: l.id,
            name: l.name,
            address: l.address || `${l.zipCode} ${l.city}`,
            rating: typeof l.rating === 'number' ? l.rating : parseFloat(String(l.rating).replace(',', '.')),
            reviewCount: typeof l.reviewCount === 'number' ? l.reviewCount : parseInt(String(l.reviewCount)),
            verified: true,
            phone: l.phone || '',
            imageUrl: l.imageUrl && l.imageUrl.startsWith('http') ? l.imageUrl : '/images/placeholder-listing.jpg',
            slug: l.id,
            isReal: true,
            reviewsPerScore: l.reviewsPerScore || null,
            reviewsLink: l.reviewsLink || '',
            gmapsUrl: l.gmapsUrl || '',
            lat: l.lat,
            lng: l.lng,
            zip: l.zipCode
        }));
    }

    // 2. Fallback to MOCKS if no real data found
    const prefixes = ['Institut', 'Centre', 'Clinique', 'Espace', 'Studio'];
    const names = ['Beauté', 'Esthétique', 'Harmonie', 'Élégance', 'Prestige', 'Sérénité', 'Éclat'];
    const centres: ListingSearchResult[] = [];
    const count = Math.min(5, 3 + Math.floor(random() * 3)); // 3-5 centres

    for (let i = 0; i < count; i++) {
        const prefix = pick(prefixes, random);
        const name = pick(names, random);
        const rating = Number((3.5 + random() * 1.5).toFixed(1));
        const slug = slugify(`${prefix}-${name}-${city.name}`);

        centres.push({
            id: `mock-${city.slug}-${i}`,
            name: `${prefix} ${name} ${city.name}`,
            address: `${Math.floor(random() * 150) + 1} ${['rue', 'avenue', 'boulevard'][Math.floor(random() * 3)]} ${['de la République', 'Victor Hugo', 'Jean Jaurès'][Math.floor(random() * 3)]}, ${city.zip} ${city.name}`,
            rating,
            reviewCount: Math.floor(random() * 200) + 20,
            verified: random() > 0.8,
            phone: '01 00 00 00 00',
            imageUrl: `https://images.unsplash.com/photo-1629198688000-71f23e745b6e?auto=format&fit=crop&w=800&q=80`,
            slug: slug,
            isReal: false
        });
    }

    // Sort by rating descending
    return centres.sort((a, b) => b.rating - a.rating);
}
