
import { Service, City } from '@/types';

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

interface ListingJsonLdProps {
    listings: ListingSearchResult[];
    city: City;
    service: Service;
}

export function ListingJsonLd({ listings, city, service }: ListingJsonLdProps) {
    // Only include listings with coordinates or ensure at least address is present
    // Focusing on real listings mostly, or mocks if they have enough info
    const businessList = listings.map((listing, index) => {
        const item: any = {
            "@type": "LocalBusiness",
            "name": listing.name,
            "image": listing.imageUrl,
            "url": `https://beautybeaute.fr/${service.slug}/${city.slug}/${listing.slug}`,
            "telephone": listing.phone,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": listing.address,
                "addressLocality": city.name,
                "postalCode": listing.zip || city.zip,
                "addressCountry": "FR"
            },
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": listing.rating,
                "reviewCount": listing.reviewCount
            }
        };

        if (listing.lat && listing.lng) {
            item.geo = {
                "@type": "GeoCoordinates",
                "latitude": listing.lat,
                "longitude": listing.lng
            };
        }

        // If it's a real listing and has a specific Google Maps URL, we can add it as sameAs
        if (listing.gmapsUrl) {
            item.sameAs = listing.gmapsUrl;
        }

        return {
            "@type": "ListItem",
            "position": index + 1,
            "item": item
        };
    });

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": `Top ${listings.length} ${service.name} à ${city.name}`,
        "description": `Liste des meilleurs centres de ${service.name} à ${city.name} avec avis et notes.`,
        "numberOfItems": listings.length,
        "itemListElement": businessList
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
