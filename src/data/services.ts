import { Service } from '@/types';

export const services: Service[] = [
    {
        id: 'laser',
        name: 'Épilation Laser',
        slug: 'epilation-laser',
        seoKeyword: 'épilation laser définitive',
        heroImage: '/images/services/epilation-laser.jpg',
        description: 'Découvrez les meilleurs centres d\'épilation laser près de chez vous. Technologie de pointe pour une peau lisse et durable.',
        icon: 'Zap',
    },
    {
        id: 'cryo',
        name: 'Cryolipolyse',
        slug: 'cryolipolyse-minceur',
        seoKeyword: 'cryolipolyse minceur',
        heroImage: '/images/services/cryolipolyse.jpg',
        description: 'Éliminez les graisses localisées par le froid. Trouvez les instituts certifiés pour la cryolipolyse dans votre ville.',
        icon: 'Snowflake',
    },
    {
        id: 'hydra',
        name: 'Soin Hydrafacial',
        slug: 'soin-hydrafacial',
        seoKeyword: 'soin hydrafacial visage',
        heroImage: '/images/services/hydrafacial.jpg',
        description: 'Le soin visage révolutionnaire qui nettoie, exfolie et hydrate. Comparez les meilleurs instituts de beauté.',
        icon: 'Droplets',
    },
    {
        id: 'injections',
        name: 'Injections & Botox',
        slug: 'injections-esthetique',
        seoKeyword: 'injections esthétiques botox',
        heroImage: '/images/services/injections.jpg',
        description: 'Injections d\'acide hyaluronique et Botox par des médecins qualifiés. Trouvez un praticien de confiance.',
        icon: 'Syringe',
    },
];

export function getServiceBySlug(slug: string): Service | undefined {
    return services.find((s) => s.slug === slug);
}

export function getAllServiceSlugs(): string[] {
    return services.map((s) => s.slug);
}
